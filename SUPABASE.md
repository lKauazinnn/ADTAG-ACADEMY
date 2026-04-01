# 🚀 Guia Rápido: Usando Supabase

## Por que Supabase?

✅ **Grátis** - Até 500MB de banco de dados  
✅ **Sem instalação** - Tudo na nuvem  
✅ **Fácil de usar** - Interface visual intuitiva  
✅ **Rápido** - Configuração em 5 minutos  

## Passo a Passo

### 1. Criar Conta e Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Crie sua conta (pode usar GitHub, Google, etc.)
4. Após login, clique em **"New Project"**

### 2. Configurar o Projeto

Preencha os dados do projeto:

- **Name:** `video-platform` (ou o nome que preferir)
- **Database Password:** Crie uma senha forte
  - ⚠️ **MUITO IMPORTANTE:** Anote essa senha! Você vai precisar dela!
  - Exemplo: `MinhaSenh@Super$egura2024`
- **Region:** Escolha a região mais próxima
  - Brasil: `South America (São Paulo)`
  - Portugal: `Europe (West)`
- **Pricing Plan:** Free (gratuito)

Clique em **"Create new project"**

### 3. Aguardar Criação

O Supabase levará cerca de 2-3 minutos para criar seu banco de dados.  
Aguarde até aparecer "Project is ready" ✅

### 4. Copiar Connection String

1. No menu lateral, clique em **⚙️ Settings**
2. Clique em **Database**
3. Role até a seção **"Connection String"**
4. Certifique-se que está selecionado **"URI"** (não "Session pooling")
5. Copie a string que aparece

Ela será algo assim:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### 5. Configurar no Projeto

1. Abra a pasta `backend` do projeto
2. Abra o arquivo `.env`
3. Cole sua Connection String substituindo `[YOUR-PASSWORD]` pela senha que você criou:

```env
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:MinhaSenh@Super$egura2024@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

⚠️ **IMPORTANTE:** Adicione `?pgbouncer=true&connection_limit=1` no final da URL!

4. Configure o JWT_SECRET (pode ser qualquer string aleatória):

```env
JWT_SECRET="minha-chave-jwt-secreta-12345"
```

### 6. Executar as Migrations

No terminal, dentro da pasta `backend`:

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as tabelas no banco
npx prisma migrate dev --name init

# Popular com dados de exemplo
npx tsx prisma/seed.ts

# Iniciar o servidor
npm run dev
```

### 7. Verificar no Supabase (Opcional)

Para ver suas tabelas criadas:

1. No Supabase, clique em **📊 Table Editor**
2. Você verá as tabelas:
   - `users`
   - `modules`
   - `videos`
   - `video_progress`

## 🎉 Pronto!

Seu backend está configurado e funcionando com Supabase!

## 🔐 Habilitar "Esqueci minha senha" (sem SMTP próprio)

O projeto está configurado para usar o envio de recuperação nativo do Supabase Auth.

No Dashboard do Supabase:

1. Vá em **Authentication** → **URL Configuration**
2. Configure:
  - **Site URL**: `http://localhost:5173` (ou sua URL de produção)
  - **Redirect URLs**: inclua `http://localhost:5173/reset-password`

No `.env` do backend, mantenha:

```env
FRONTEND_URL="http://localhost:5173"
SUPABASE_URL="https://SEU-PROJETO.supabase.co"
SUPABASE_SERVICE_KEY="sua_service_role_key"
```

Sem SMTP próprio: o Supabase Auth envia o e-mail de recuperação.

## 🔍 Prisma Studio

Para visualizar e editar dados graficamente:

```bash
cd backend
npx prisma studio
```

Isso abrirá uma interface web em `http://localhost:5555`

## 🐛 Solução de Problemas

### Erro: "Can't reach database server"

**Solução:**
1. Verifique se copiou a URL completa
2. Certifique-se que substituiu `[YOUR-PASSWORD]` pela senha real
3. Adicione `?pgbouncer=true&connection_limit=1` no final

### Erro: "Authentication failed"

**Solução:**
1. A senha está incorreta
2. Resete a senha do banco:
   - Settings → Database → "Reset Database Password"

### Projeto pausado

**Solução:**
- Projetos gratuitos do Supabase podem pausar após inatividade
- Acesse o dashboard e clique em "Resume project"

## 💡 Dicas

### Ver Connection String novamente

Settings → Database → Connection String → URI

### Resetar o banco de dados

```bash
npx prisma migrate reset
```

⚠️ Isso apaga todos os dados!

### Criar backup

No Supabase: Database → Backups

### Monitorar uso

Dashboard → Settings → Billing

Você pode ver:
- Espaço usado
- Número de requisições
- Limite do plano gratuito

## 📊 Limites do Plano Gratuito

- **Database:** 500 MB
- **Storage:** 1 GB
- **Bandwidth:** 5 GB/mês
- **API Requests:** Ilimitado

Para este projeto, o plano gratuito é mais que suficiente! 🎉

## 🚀 Próximos Passos

Depois de configurar o Supabase:

1. Inicie o frontend: `cd frontend && npm run dev`
2. Acesse: `http://localhost:5173`
3. Crie sua conta no sistema
4. Comece a usar!

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Prisma com Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Dashboard Supabase](https://app.supabase.com)

---

**Dúvidas?** Consulte o arquivo [INSTALACAO.md](./INSTALACAO.md) para mais detalhes!
