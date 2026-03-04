import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Começando seed do banco de dados...');

  // Limpar dados antigos
  await prisma.video.deleteMany();
  await prisma.module.deleteMany();
  console.log('🗑️  Dados antigos removidos.');

  // ─── Módulo 1: Premiere Pro ───────────────────────────────────────────────
  const module1 = await prisma.module.create({
    data: {
      title: 'Premiere Pro: Edição de Vídeo do Zero',
      description: 'Aprenda a editar vídeos profissionais com o Adobe Premiere Pro — da importação ao produto final.',
      order: 1,
      videos: {
        create: [
          {
            title: 'Introdução ao Premiere Pro — Interface e Primeiros Passos',
            description: 'Conheça a interface do Premiere Pro, configure seu projeto e importe suas primeiras mídias.',
            url: 'https://www.youtube.com/embed/gOoEQUt6Dns',
            duration: 780,
            order: 1,
          },
          {
            title: 'Linha do Tempo e Cortes Básicos',
            description: 'Aprenda a trabalhar na timeline, realizar cortes precisos e organizar os clipes.',
            url: 'https://www.youtube.com/embed/u8xX067nfuo',
            duration: 900,
            order: 2,
          },
          {
            title: 'Transições e Efeitos de Vídeo',
            description: 'Adicione transições elegantes e efeitos visuais para deixar sua edição dinâmica.',
            url: 'https://www.youtube.com/embed/PlTId-bpMJA',
            duration: 720,
            order: 3,
          },
          {
            title: 'Correção de Cor e Color Grading',
            description: 'Domine o Lumetri Color para fazer correção de cor profissional e criar looks cinematográficos.',
            url: 'https://www.youtube.com/embed/tQdKRKH7Tds',
            duration: 960,
            order: 4,
          },
          {
            title: 'Áudio: Mixagem e Tratamento de Som',
            description: 'Ajuste níveis de áudio, remova ruídos e crie uma trilha sonora equilibrada para o seu vídeo.',
            url: 'https://www.youtube.com/embed/K0AtV5WDeTY',
            duration: 660,
            order: 5,
          },
          {
            title: 'Exportação Profissional — Formatos e Configurações',
            description: 'Exporte seu projeto nos formatos corretos para YouTube, Instagram, TV e entrega final ao cliente.',
            url: 'https://www.youtube.com/embed/sj5LML-wxhA',
            duration: 600,
            order: 6,
          },
        ],
      },
    },
  });

  // ─── Módulo 2: Photoshop ──────────────────────────────────────────────────
  const module2 = await prisma.module.create({
    data: {
      title: 'Photoshop: Retoque e Manipulação de Imagens',
      description: 'Domine o Adobe Photoshop para criar composições, retocar fotografias e desenvolver artes profissionais.',
      order: 2,
      videos: {
        create: [
          {
            title: 'Interface do Photoshop e Ferramentas Essenciais',
            description: 'Conheça os painéis, ferramentas e atalhos indispensáveis para trabalhar com agilidade no Photoshop.',
            url: 'https://www.youtube.com/embed/VFrU3hZr4-c',
            duration: 840,
            order: 1,
          },
          {
            title: 'Seleções Avançadas — Laço, Caneta e Seleção Rápida',
            description: 'Aprenda a fazer seleções precisas com diferentes ferramentas para recortar e isolar objetos.',
            url: 'https://www.youtube.com/embed/ckIHgUYekZ0',
            duration: 780,
            order: 2,
          },
          {
            title: 'Camadas, Máscaras e Modos de Mesclagem',
            description: 'Entenda a estrutura de camadas, como usar máscaras de camada e os modos de mesclagem para composições.',
            url: 'https://www.youtube.com/embed/Mvx95hRM4r4',
            duration: 900,
            order: 3,
          },
          {
            title: 'Retoque de Pele e Técnicas de Dodge & Burn',
            description: 'Técnicas profissionais de retoque de pele preservando a naturalidade da fotografia.',
            url: 'https://www.youtube.com/embed/YWrF84Av8FI',
            duration: 1020,
            order: 4,
          },
          {
            title: 'Criação de Flyers e Artes para Redes Sociais',
            description: 'Crie artes e flyers profissionais do zero, trabalhando tipografia, hierarquia visual e composição.',
            url: 'https://www.youtube.com/embed/Mvx95hRM4r4',
            duration: 960,
            order: 5,
          },
        ],
      },
    },
  });

  // ─── Módulo 3: Lightroom e Fotografia ────────────────────────────────────
  const module3 = await prisma.module.create({
    data: {
      title: 'Lightroom: Fotografia e Edição Profissional',
      description: 'Desenvolva seu olhar fotográfico e edite fotos com maestria usando o Adobe Lightroom.',
      order: 3,
      videos: {
        create: [
          {
            title: 'Fundamentos da Fotografia — Exposição, ISO e Abertura',
            description: 'Entenda o triângulo de exposição e como controlar a câmera para obter fotos perfeitas.',
            url: 'https://www.youtube.com/embed/jupxAw4QwFY',
            duration: 900,
            order: 1,
          },
          {
            title: 'Importando e Organizando no Lightroom',
            description: 'Configure o Lightroom, importe suas fotos e organize seu catálogo de forma eficiente.',
            url: 'https://www.youtube.com/embed/qEPUDqSAQRU',
            duration: 720,
            order: 2,
          },
          {
            title: 'Edição Básica — Luz, Cor e Detalhe',
            description: 'Aprenda os controles fundamentais do painel Básico para transformar suas fotos.',
            url: 'https://www.youtube.com/embed/1zFZo3kkg14',
            duration: 840,
            order: 3,
          },
          {
            title: 'Criando Presets e Looks Cinematográficos',
            description: 'Crie seus próprios presets personalizados e aplique looks cinematográficos profissionais.',
            url: 'https://www.youtube.com/embed/6_b-iq9R0PE',
            duration: 780,
            order: 4,
          },
          {
            title: 'Correção Seletiva e Pincel de Ajuste',
            description: 'Use máscaras, filtro radial e pincel de ajuste para edições precisas em áreas específicas da foto.',
            url: 'https://www.youtube.com/embed/hHtM4PQ1KL0',
            duration: 660,
            order: 5,
          },
          {
            title: 'Exportação e Entrega para Clientes',
            description: 'Configure exportações para web, impressão e entrega profissional de trabalhos para clientes.',
            url: 'https://www.youtube.com/embed/ucf-_81oFrU',
            duration: 540,
            order: 6,
          },
        ],
      },
    },
  });

  // ─── Módulo 4: After Effects ──────────────────────────────────────────────
  const module4 = await prisma.module.create({
    data: {
      title: 'After Effects: Motion Graphics e Animação',
      description: 'Crie animações, motion graphics e efeitos visuais profissionais com o Adobe After Effects.',
      order: 4,
      videos: {
        create: [
          {
            title: 'Introdução ao After Effects — Composições e Keyframes',
            description: 'Conheça a interface do After Effects e aprenda o conceito fundamental de composições e keyframes.',
            url: 'https://www.youtube.com/embed/Mvx95hRM4r4',
            duration: 840,
            order: 1,
          },
          {
            title: 'Animando Texto e Tipografia em Movimento',
            description: 'Crie animações de texto profissionais usando animadores de texto e presets do After Effects.',
            url: 'https://www.youtube.com/embed/YWrF84Av8FI',
            duration: 780,
            order: 2,
          },
          {
            title: 'Efeitos Visuais: Máscaras e Rastreamento',
            description: 'Use máscaras, rastreamento de câmera e pontilhamento para criar efeitos visuais avançados.',
            url: 'https://www.youtube.com/embed/K0AtV5WDeTY',
            duration: 960,
            order: 3,
          },
          {
            title: 'Motion Graphics: Infográficos Animados',
            description: 'Crie infográficos, gráficos animados e visualizações de dados para vídeos profissionais.',
            url: 'https://www.youtube.com/embed/sj5LML-wxhA',
            duration: 900,
            order: 4,
          },
          {
            title: 'Integração Premiere + After Effects',
            description: 'Aprenda o fluxo de trabalho entre Premiere Pro e After Effects usando Dynamic Link.',
            url: 'https://www.youtube.com/embed/tQdKRKH7Tds',
            duration: 720,
            order: 5,
          },
        ],
      },
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log(`Trilhas criadas:`);
  console.log(`  1. ${module1.title}`);
  console.log(`  2. ${module2.title}`);
  console.log(`  3. ${module3.title}`);
  console.log(`  4. ${module4.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
