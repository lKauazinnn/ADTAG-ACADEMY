import { Response } from 'express';
import Groq from 'groq-sdk';
import supabase from '../lib/supabase';
import { AuthRequest } from '../middlewares/auth.middleware';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Você é a Lumi, assistente virtual da plataforma ADTAG — ensino de criação de conteúdo digital.

PERSONALIDADE:
- Simpática, direta e acolhedora. Não fria, não robótica.
- Máximo 2-3 frases por resposta. Sem enrolação.
- Sem introduções longas ("Claro!", "Com certeza!"). Vai ao ponto.
- Negrito (**texto**) só para dados chave (nomes, números, %).

REGRAS DE FERRAMENTAS — CRÍTICO:
- NUNCA use ferramentas em saudações ou bate-papo casual ("oi", "tudo bem", "obrigado"). Responda naturalmente.
- get_user_progress → só se pedir progresso/desempenho explicitamente.
- list_modules → só se pedir lista de módulos/cursos explicitamente.
- get_next_video → só se pedir próximo vídeo explicitamente.
- navigate_to → só se pedir para navegar/ir a algum lugar explicitamente ("me leva", "abre", "quero ver").
- Em caso de dúvida: NÃO use ferramentas. Responda normalmente.

APÓS navigate_to: sempre confirme em 1 frase curta onde está levando o usuário.`;

/* ─── Tool definitions ─── */
const TOOLS: Groq.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_user_progress',
      description: 'Busca o progresso do usuário. Use APENAS quando o usuário pedir explicitamente seu progresso, desempenho ou quantos vídeos completou.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_modules',
      description: 'Lista os módulos da plataforma. Use APENAS quando o usuário pedir explicitamente a lista de módulos, trilhas ou cursos disponíveis.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_next_video',
      description: 'Retorna o próximo vídeo não assistido. Use APENAS quando o usuário pedir explicitamente o próximo vídeo ou continuar de onde parou.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate_to',
      description: 'Navega para uma página da plataforma. Use APENAS quando o usuário pedir explicitamente para ir a algum lugar ("me leva", "quero ver", "abre o módulo", "ir para"). NUNCA use por iniciativa própria.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: `Caminho exato da rota. Rotas disponíveis:
- /dashboard → trilhas de editor (Photoshop, Premiere, etc.)
- /social-media → trilhas de redes sociais
- /musicos → trilhas de música e produção musical
- /module/[UUID] → detalhe de um módulo específico (use o ID real retornado por list_modules)
- /video/[UUID] → player de um vídeo específico (use o ID real retornado por get_next_video)
NUNCA invente um UUID. NUNCA use palavras como "musicos", "social" ou "editor" como ID de módulo.`,
          },
          reason: {
            type: 'string',
            description: 'Mensagem curta explicando para onde o usuário está sendo levado',
          },
        },
        required: ['path', 'reason'],
      },
    },
  },
];

/* ─── Tool executors ─── */
async function executeTool(name: string, args: any, userId: string) {
  switch (name) {
    case 'get_user_progress': {
      const { data: modules } = await supabase
        .from('modules')
        .select('id, title, videos(id)')
        .order('order', { ascending: true });

      if (!modules?.length) return { error: 'Sem módulos encontrados' };

      const allVideoIds = modules.flatMap((m: any) => m.videos.map((v: any) => v.id));
      const { data: progress } = await supabase
        .from('video_progress')
        .select('videoId, completed')
        .eq('userId', userId)
        .in('videoId', allVideoIds);

      const totalVideos = allVideoIds.length;
      const totalCompleted = (progress || []).filter((p: any) => p.completed).length;
      const overallProgress = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0;

      const moduleStats = modules.map((m: any) => {
        const completed = m.videos.filter((v: any) =>
          (progress || []).find((p: any) => p.videoId === v.id && p.completed)
        ).length;
        return {
          title: m.title,
          totalVideos: m.videos.length,
          completedVideos: completed,
          percent: m.videos.length > 0 ? Math.round((completed / m.videos.length) * 100) : 0,
        };
      });

      return { overallProgress, totalVideos, totalCompleted, modules: moduleStats };
    }

    case 'list_modules': {
      const { data: modules } = await supabase
        .from('modules')
        .select('id, title, description, videos(id)')
        .order('order', { ascending: true });

      if (!modules) return { error: 'Erro ao buscar módulos' };

      return modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        totalVideos: m.videos.length,
        path: `/module/${m.id}`,
      }));
    }

    case 'get_next_video': {
      const { data: modules } = await supabase
        .from('modules')
        .select('id, title, videos(id, title, order)')
        .order('order', { ascending: true });

      if (!modules?.length) return { message: 'Nenhum módulo encontrado' };

      const allVideoIds = modules.flatMap((m: any) => m.videos.map((v: any) => v.id));
      const { data: progress } = await supabase
        .from('video_progress')
        .select('videoId, completed')
        .eq('userId', userId)
        .in('videoId', allVideoIds);

      const completedIds = new Set((progress || []).filter((p: any) => p.completed).map((p: any) => p.videoId));

      for (const module of modules as any[]) {
        const sorted = [...module.videos].sort((a: any, b: any) => a.order - b.order);
        const next = sorted.find((v: any) => !completedIds.has(v.id));
        if (next) {
          return {
            videoId: next.id,
            videoTitle: next.title,
            moduleTitle: module.title,
            moduleId: module.id,
            path: `/video/${next.id}`,
          };
        }
      }

      return { message: 'Parabéns! Você completou todos os vídeos disponíveis! 🎉' };
    }

    case 'navigate_to':
      // Handled in the caller — just return confirmation
      return { navigating: true, path: args.path, reason: args.reason };

    default:
      return { error: `Tool desconhecida: ${name}` };
  }
}

/* ─── Controller ─── */
export class ChatController {
  async sendMessage(req: AuthRequest, res: Response) {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Mensagem muito longa' });
    }

    const userId = req.userId!;

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    if (!process.env.GROQ_API_KEY) {
      console.error('[Lumi] GROQ_API_KEY não configurada');
      return res.status(500).json({ error: 'Serviço de IA não configurado' });
    }

    try {

    let pendingAction: { type: 'navigate'; path: string } | null = null;
    const MAX_TOOL_ROUNDS = 5;

    let response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      max_tokens: 1024,
      temperature: 0.65,
    });

    /* ── Tool calling loop ── */
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const choice = response.choices[0];
      if (choice.finish_reason !== 'tool_calls' || !choice.message.tool_calls?.length) break;

      // Append assistant message with tool_calls
      messages.push(choice.message);

      // Execute each tool
      for (const toolCall of choice.message.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments || '{}');

        const result = await executeTool(fnName, args, userId);

        // Capture navigate action
        if (fnName === 'navigate_to' && args.path) {
          pendingAction = { type: 'navigate', path: args.path };
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      // Next round
      response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
        max_tokens: 1024,
        temperature: 0.65,
      });
    }

    const reply = response.choices[0]?.message?.content;

    // If model returned no text but navigated somewhere, use a graceful fallback
    if (!reply && pendingAction) {
      const fallbackMsg = `Te levando para lá agora! 🚀`;
      return res.json({ reply: fallbackMsg, action: pendingAction });
    }

    if (!reply) return res.status(500).json({ error: 'Erro ao gerar resposta' });

    return res.json({ reply, action: pendingAction });
    } catch (err: any) {
      console.error('[Lumi] Erro:', err?.message ?? err);
      return res.status(500).json({ error: 'Erro interno ao processar mensagem' });
    }
  }
}
