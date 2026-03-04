# 🎓 Sistema de Hospedagem de Vídeos - Arquitetura

## 📋 Visão Geral

Este documento descreve a arquitetura e funcionamento do sistema de hospedagem de vídeos educacionais.

## 🏗️ Arquitetura do Sistema

### Backend (API REST)

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.ts                # Dados iniciais
├── src/
│   ├── controllers/           # Lógica de negócio
│   │   ├── auth.controller.ts
│   │   ├── module.controller.ts
│   │   ├── video.controller.ts
│   │   └── progress.controller.ts
│   ├── middlewares/           # Middlewares
│   │   └── auth.middleware.ts
│   ├── routes/                # Rotas da API
│   │   ├── auth.routes.ts
│   │   ├── module.routes.ts
│   │   ├── video.routes.ts
│   │   └── progress.routes.ts
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma
│   └── server.ts              # Servidor Express
├── package.json
└── tsconfig.json
```

### Frontend (React)

```
frontend/
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   └── Header.tsx
│   ├── contexts/              # Contextos React
│   │   └── AuthContext.tsx
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ModuleDetail.tsx
│   │   └── VideoPlayer.tsx
│   ├── services/              # Serviços de API
│   │   └── api.ts
│   ├── types/                 # Tipos TypeScript
│   │   └── index.ts
│   ├── App.tsx                # Componente principal
│   ├── main.tsx               # Entry point
│   └── index.css              # Estilos globais
├── index.html
├── package.json
└── vite.config.ts
```

## 🔐 Fluxo de Autenticação

1. **Registro/Login**
   - Usuário envia credenciais
   - Backend valida e gera JWT
   - Token é armazenado no localStorage
   - Token é enviado em todas as requisições via header `Authorization: Bearer <token>`

2. **Rotas Protegidas**
   - Middleware `authMiddleware` valida o token
   - Extrai o ID do usuário do token
   - Anexa `userId` ao objeto `request`

## 📹 Fluxo de Progresso de Vídeos

### Regras de Negócio

1. **Primeiro vídeo de cada módulo**: Sempre liberado
2. **Demais vídeos**: Bloqueados até completar o anterior
3. **Marcação de conclusão**: Manual pelo usuário

### Implementação

```typescript
// Verificar se pode assistir
canWatchVideo(userId, videoId, videoOrder, moduleId) {
  if (videoOrder === 1) return true;
  
  const previousVideo = findPreviousVideo(moduleId, videoOrder - 1);
  const progress = getProgress(userId, previousVideo.id);
  
  return progress?.completed || false;
}
```

## 🗃️ Modelo de Dados

### User (Usuário)
- `id`: UUID único
- `email`: Email único
- `name`: Nome completo
- `password`: Senha hash (bcrypt)
- Relação: 1:N com VideoProgress

### Module (Módulo)
- `id`: UUID único
- `title`: Título do módulo
- `description`: Descrição
- `order`: Ordem de exibição
- Relação: 1:N com Video

### Video (Vídeo)
- `id`: UUID único
- `title`: Título do vídeo
- `description`: Descrição
- `url`: URL do vídeo (YouTube embed)
- `duration`: Duração em segundos
- `order`: Ordem dentro do módulo
- `moduleId`: FK para Module
- Relação: N:1 com Module, 1:N com VideoProgress

### VideoProgress (Progresso)
- `id`: UUID único
- `userId`: FK para User
- `videoId`: FK para Video
- `completed`: Boolean (concluído?)
- `watchedTime`: Tempo assistido em segundos
- Constraint: Unique (userId, videoId)

## 🔌 Endpoints da API

### Autenticação
```
POST /api/auth/register
Body: { name, email, password }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

### Módulos
```
GET /api/modules
Headers: Authorization: Bearer <token>
Response: [{ id, title, description, order, videos: [...] }]

GET /api/modules/:id
Headers: Authorization: Bearer <token>
Response: { id, title, description, videos: [{ ...video, completed, watchedTime }] }
```

### Vídeos
```
GET /api/videos/:id
Headers: Authorization: Bearer <token>
Response: { id, title, url, duration, completed, canWatch, module: {...} }

POST /api/videos/:id/complete
Headers: Authorization: Bearer <token>
Body: { watchedTime }
Response: { id, completed, watchedTime }

POST /api/videos/:id/progress
Headers: Authorization: Bearer <token>
Body: { watchedTime }
Response: { id, watchedTime }
```

### Progresso
```
GET /api/progress
Headers: Authorization: Bearer <token>
Response: {
  overallProgress,
  totalVideos,
  totalCompleted,
  modules: [{ moduleId, progressPercentage, ... }]
}

GET /api/progress/module/:moduleId
Headers: Authorization: Bearer <token>
Response: {
  moduleId,
  progressPercentage,
  videos: [{ id, completed, watchedTime }]
}
```

## 🎨 Frontend - Componentes Principais

### AuthContext
- Gerencia estado de autenticação
- Funções: login, register, logout
- Persiste token no localStorage

### Rotas Privadas
- Verifica se usuário está autenticado
- Redireciona para /login se não estiver

### Dashboard
- Lista todos os módulos
- Mostra progresso geral
- Card de cada módulo com progresso individual

### ModuleDetail
- Lista vídeos do módulo
- Mostra vídeos bloqueados/desbloqueados
- Botão "Continuar Assistindo"

### VideoPlayer
- Exibe iframe do vídeo
- Botão "Marcar como Concluído"
- Valida se pode assistir (canWatch)

## 🔒 Segurança

### Backend
- Senhas com hash bcrypt (salt rounds: 10)
- JWT com expiração de 7 dias
- Validação de dados com Zod
- Middleware de autenticação em rotas protegidas

### Frontend
- Token armazenado apenas no localStorage
- Validação de formulários
- Rotas privadas protegidas
- Axios interceptor para adicionar token

## ⚡ Performance

### Backend
- Prisma ORM com queries otimizadas
- Uso de `select` para retornar apenas campos necessários
- Índices no banco (unique constraints)

### Frontend
- Lazy loading de rotas (pode ser implementado)
- Cache de dados no AuthContext
- React hooks para gerenciamento de estado

## 🚀 Deploy

### Backend
1. Build TypeScript: `npm run build`
2. Configurar variáveis de ambiente
3. Rodar migrations: `npx prisma migrate deploy`
4. Iniciar: `npm start`

### Frontend
1. Build: `npm run build`
2. Servir pasta `dist/` com servidor estático

### Sugestões de Hospedagem
- **Backend**: Railway, Render, Heroku, Fly.io
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Banco**: **Supabase** (Recomendado!), Railway, Neon, ElephantSQL

### Usando Supabase

O projeto está pronto para usar Supabase! Vantagens:

✅ **Gratuito** até 500MB  
✅ **Sem configuração de servidor**  
✅ **Backups automáticos**  
✅ **Interface visual para dados**  

Consulte [SUPABASE.md](./SUPABASE.md) para instruções completas.

## 📈 Melhorias Futuras

### Performance
- [ ] Implementar cache Redis
- [ ] CDN para vídeos
- [ ] Lazy loading de módulos

### Funcionalidades
- [ ] Sistema de busca
- [ ] Favoritos
- [ ] Histórico de visualização
- [ ] Download offline
- [ ] Velocidade de reprodução

### Segurança
- [ ] Rate limiting
- [ ] Refresh tokens
- [ ] 2FA
- [ ] Logs de auditoria

### UX
- [ ] Dark mode
- [ ] Responsividade mobile
- [ ] Acessibilidade (ARIA)
- [ ] Internacionalização (i18n)
