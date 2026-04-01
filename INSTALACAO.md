# 🚀 Guia de Instalação e Uso

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn**
- **Banco de Dados** - Escolha uma das opções:
  - **Opção 1 (Recomendado):** [Supabase](https://supabase.com) - Gratuito, sem instalação
  - **Opção 2:** PostgreSQL Local - [Download](https://www.postgresql.org/download/)

## 📦 Instalação

### 1. Configurar o Banco de Dados

#### Opção 1: Supabase (Recomendado) ✨

**Vantagens:** Não precisa instalar nada, gratuito, fácil de usar!

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Clique em "New Project"
3. Preencha:
   - **Name:** video-platform
   - **Database Password:** Crie uma senha forte (anote!)
   - **Region:** Escolha a mais próxima de você
4. Aguarde alguns minutos até o projeto ser criado
5. Vá em **Settings** → **Database**
6. Na seção **Connection String**, copie a **URI** (modo Session)
7. Ela será algo como:
   ```
   postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres
   ```

**⚠️ IMPORTANTE:** Adicione `?pgbouncer=true&connection_limit=1` no final da URL para evitar problemas de conexão:
```
postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

Pronto! Seu banco de dados está configurado. Pule para o passo 2.

#### Opção 2: PostgreSQL Local

```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE video_platform;

# Saia do PostgreSQL
\q
```

### 2. Configurar o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` e configure suas variáveis:

**Se estiver usando Supabase:**
```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
JWT_SECRET="sua-chave-secreta-jwt-aqui-mude-isso"
PORT=3333
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Reset de senha via Supabase Auth
SUPABASE_URL="https://SEU-PROJETO.supabase.co"
SUPABASE_SERVICE_KEY="sua_service_role_key"
```

**Se estiver usando PostgreSQL Local:**
```env
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/video_platform?schema=public"
JWT_SECRET="sua-chave-secreta-jwt-aqui-mude-isso"
PORT=3333
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Reset de senha via Supabase Auth
SUPABASE_URL="https://SEU-PROJETO.supabase.co"
SUPABASE_SERVICE_KEY="sua_service_role_key"
```

**⚠️ IMPORTANTE:** 
- Cole a URL exata que você copiou do Supabase (ou suas credenciais locais)
- Troque `JWT_SECRET` por uma string aleatória e segura
- Configure no Supabase Dashboard o redirect de recuperação para `/reset-password`

```bash
# Gere o Prisma Client
npx prisma generate

# Execute as migrations para criar as tabelas
npx prisma migrate dev --name init

# (Opcional) Popule o banco com dados de exemplo
npx tsx prisma/seed.ts

# Inicie o servidor backend
npm run dev
```

O backend estará rodando em: `http://localhost:3333`

### 3. Configurar o Frontend

Abra um **novo terminal** e execute:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

## 🎯 Como Usar

### 1. Criar uma Conta

1. Acesse `http://localhost:5173`
2. Clique em "Cadastre-se aqui"
3. Preencha seus dados (nome, email, senha)
4. Você será automaticamente redirecionado para o Dashboard

### 2. Navegar pelos Módulos

No Dashboard você verá:
- Seu progresso geral
- Lista de todos os módulos disponíveis
- Progresso de cada módulo

Clique em um módulo para ver todos os vídeos.

### 3. Assistir Vídeos

#### Regras Importantes:
- ✅ Você pode assistir o **primeiro vídeo** de cada módulo imediatamente
- 🔒 Os próximos vídeos ficam **bloqueados** até você completar o anterior
- ✔️ Para desbloquear um vídeo, você precisa **marcar o anterior como concluído**

#### Como assistir:
1. Clique em um vídeo disponível
2. Assista o conteúdo
3. Clique em "Marcar como Concluído"
4. O próximo vídeo será automaticamente desbloqueado

### 4. Acompanhar Progresso

- O Dashboard mostra seu progresso geral
- Cada módulo mostra quantos vídeos você completou
- Vídeos concluídos aparecem com uma marca verde ✓

## 🔧 Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Ver banco de dados visual
npx prisma studio

# Reset do banco (CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Criar nova migration
npx prisma migrate dev --name nome_da_migration
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

## 📊 Estrutura do Banco de Dados

### Tabelas:

- **users** - Informações dos usuários
- **modules** - Módulos de curso
- **videos** - Vídeos dentro de cada módulo
- **video_progress** - Progresso de cada usuário nos vídeos

## 🎨 Customização

### Alterar Cores da Interface

Edite o arquivo `frontend/tailwind.config.js` na seção `colors.primary` para mudar a cor principal da aplicação.

### Adicionar Novos Módulos e Vídeos

Você pode adicionar dados diretamente pelo Prisma Studio:

```bash
cd backend
npx prisma studio
```

Ou criar um script seed personalizado em `backend/prisma/seed.ts`.

## 🐛 Solução de Problemas

### Erro de conexão com o banco de dados

**Se estiver usando Supabase:**
1. Verifique se a URL está completa e correta
2. Confirme que adicionou `?pgbouncer=true&connection_limit=1` no final
3. Verifique se o projeto Supabase está ativo (não pausado)
4. Teste a conexão no Prisma Studio: `npx prisma studio`

**Se estiver usando PostgreSQL Local:**
1. Verifique se o PostgreSQL está rodando
2. As credenciais no `.env` estão corretas
3. O banco de dados `video_platform` foi criado

### Erro de CORS

Se tiver problemas de CORS, verifique se o backend está rodando na porta 3333 e o frontend na porta 5173.

### Erro ao fazer login

Certifique-se de que:
1. O backend está rodando
2. O usuário foi criado corretamente
3. A senha tem no mínimo 6 caracteres

## 📱 Funcionalidades Futuras (Sugestões)

- [ ] Upload de vídeos
- [ ] Comentários nos vídeos
- [ ] Sistema de notas/avaliações
- [ ] Certificados de conclusão
- [ ] Modo offline
- [ ] Notificações por email
- [ ] Sistema de quiz/exercícios
- [ ] Suporte a legendas

## 📞 Suporte

Se encontrar algum problema, verifique:
1. Se todas as dependências foram instaladas
2. Se o PostgreSQL está rodando
3. Se as variáveis de ambiente estão corretas
4. Os logs do backend e frontend para mensagens de erro

---

**Boa aprendizagem! 🎓**
