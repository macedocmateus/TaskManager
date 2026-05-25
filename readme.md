# TaskManager API

API REST de gerenciamento de tarefas em equipe, desenvolvida com **Node.js**, **Express** e **PostgreSQL** via **Prisma ORM**. Permite criar usuários, organizar equipes, atribuir tarefas com prioridades e acompanhar o histórico de alterações de status.

## Tecnologias

- Node.js + TypeScript
- Express 5
- Prisma ORM + PostgreSQL
- JWT para autenticação
- Zod para validação
- Jest + Supertest para testes
- Docker para banco de dados local
- Swagger para documentação da API

## Funcionalidades

- Autenticação com JWT (roles: `admin` e `member`)
- CRUD de usuários, equipes e tarefas
- Gerenciamento de membros por equipe
- Histórico de mudanças de status das tarefas
- Documentação interativa via Swagger (`/docs`)

## Pré-requisitos

- Node.js >= 24
- Docker e Docker Compose

## Configuração

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/TaskManager.git
cd TaskManager
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Preencha o `.env` com seus valores:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tasks-manager
JWT_SECRET=sua_chave_secreta
PORT=3333
```

**4. Suba o banco de dados com Docker**

```bash
docker compose up -d
```

**5. Execute as migrations**

```bash
npx prisma migrate deploy
```

## Rodando a aplicação

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

A API estará disponível em `http://localhost:3333`.  
A documentação Swagger em `http://localhost:3333/docs`.

## Testes

```bash
# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:dev
```

## Rotas principais

| Método | Rota | Descrição | Roles |
|--------|------|-----------|-------|
| POST | `/sessions` | Login | — |
| POST | `/users` | Criar usuário | — |
| GET | `/users` | Listar usuários | admin |
| POST | `/teams` | Criar equipe | admin |
| GET | `/teams` | Listar equipes | admin |
| POST | `/teams/:id/members` | Adicionar membro | admin |
| GET | `/teams/:id/members` | Listar membros | admin, member |
| POST | `/tasks` | Criar tarefa | admin |
| GET | `/tasks` | Listar tarefas | admin, member |
| PUT | `/tasks/:id` | Atualizar tarefa | admin, member |
| DELETE | `/tasks/:id` | Remover tarefa | admin |
| GET | `/tasks/:id/history` | Histórico da tarefa | admin, member |
| GET | `/health` | Health check | — |
