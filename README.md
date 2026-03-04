# Sistema de Hospedagem de Vídeos

Plataforma UNI - plataforma de vídeos educacionais com controle de progresso e sistema de módulos.

## 🚀 Funcionalidades

- ✅ Sistema de autenticação (Login/Registro)
- ✅ Organização de vídeos em módulos
- ✅ Controle de progresso (só pode avançar se completar o vídeo anterior)
- ✅ Marcação de vídeos como concluídos
- ✅ Dashboard do usuário com progresso

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- bcrypt para hash de senhas

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## 📁 Estrutura do Projeto

```
├── backend/          # API REST
├── frontend/         # Interface React
└── README.md
```

## 🔧 Instalação

### Pré-requisitos
- Node.js (v18+)
- **Banco de Dados:**
  - **✨ Recomendado:** [Supabase](https://supabase.com) - Gratuito, sem instalação!
  - **Alternativa:** PostgreSQL local
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env

# IMPORTANTE: Edite o arquivo .env e configure:
# - Para Supabase: Cole a Connection String do seu projeto
# - Para PostgreSQL local: Use postgresql://postgres:senha@localhost:5432/video_platform

npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts  # Dados de exemplo
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Módulos
- `GET /api/modules` - Listar todos os módulos
- `GET /api/modules/:id` - Detalhes de um módulo

### Vídeos
- `GET /api/videos/:id` - Detalhes de um vídeo
- `POST /api/videos/:id/complete` - Marcar vídeo como concluído

### Progresso
- `GET /api/progress` - Progresso do usuário
- `GET /api/progress/module/:moduleId` - Progresso em um módulo específico

## � Guias e Documentação

- **[🚀 SUPABASE.md](./SUPABASE.md)** - Guia passo a passo para usar Supabase (Recomendado!)
- **[📖 INSTALACAO.md](./INSTALACAO.md)** - Guia completo de instalação
- **[🏗️ ARQUITETURA.md](./ARQUITETURA.md)** - Documentação técnica detalhada

## �👤 Autor

Sistema criado para gerenciamento de cursos em vídeo.

## 📝 Licença

MIT
