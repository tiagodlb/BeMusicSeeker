# 🎵 BeMusicSeeker (BeMusicShare)
Plataforma backend para compartilhamento e descoberta de músicas.

---

## 👤 Identificação do Grupo
* **Denilson Alves**
* **Daniel Duarte**
* **Tiago Batista**

---

## 📝 Descrição Detalhada do Projeto
O BeMusicSeeker é uma API de alta performance desenvolvida para gerenciar o compartilhamento de metadados musicais. O sistema oferece uma infraestrutura completa de autenticação de usuários, gerenciamento de dados persistentes e documentação integrada. Foi construído seguindo os princípios de APIs REST modernas, garantindo escalabilidade através do uso de containers e ferramentas de ponta como o ecossistema Bun.

---

## 🛠 Tecnologias Utilizadas (com versões)
* **Runtime:** Bun (v1.3.2) [cite: 13, 14]
* **Framework Web:** ElysiaJS (v1.4.15) [cite: 1, 16]
* **Linguagem:** TypeScript (v5.9.3) [cite: 24]
* **Banco de Dados:** PostgreSQL (v18-alpine) [cite: 27]
* **ORM:** Prisma (v6.19.0) [cite: 1, 22]
* **Query Builder:** Kysely (v0.28.8) [cite: 1, 13]
* **Autenticação:** Better-Auth (v1.3.34) [cite: 1, 13]
* **Documentação:** OpenAPI/Swagger (via @elysiajs/openapi v1.4.11) [cite: 1, 4]

---

## 🚀 Pré-requisitos Detalhados
* **Bun Runtime:** Necessário para executar o projeto e gerenciar pacotes.
***Docker & Docker Compose:** Necessário para rodar o banco de dados PostgreSQL e o pgAdmin. [cite: 27]

---

## 📦 Instruções de Instalação e Execução
1. **Clonar o Repositório:**
   git clone https://github.com/tiagodlb/BeMusicSeeker.git

2. **Instalar Dependências:**
  bun install [cite: 30]

3. **Configuração de Ambiente:**
   Crie um arquivo .env na raiz com:
  BETTER_AUTH_SECRET=sua_chave_secreta [cite: 27, 29]
  DATABASE_URL="postgresql://postgres:postgres@localhost:5433/be_music_share" [cite: 27, 34]

4. **Subir Banco de Dados:**
  docker-compose up -d [cite: 27]

5. **Executar Migrations:**
   bun prisma migrate dev

6. **Iniciar o Sistema:**
  bun dev [cite: 26]

---

## 📂 Estrutura do Projeto Detalhada
src/
 └── index.ts          # Ponto de entrada e configuração do servidor [cite: 26]
prisma/
 ├── schema.prisma     # Definição do modelo de dados
  └── migrations/       # Histórico de versões do banco de dados
   docker-compose.yml      # Configuração do Postgres e pgAdmin
   package.json            # Scripts e dependências  
   tsconfig.json           # Configurações do compilador TypeScript

---

## ✅ Funcionalidades Implementadas
* Autenticação completa (Sign-up, Sign-in, Sign-out) via Better-Auth. [cite: 1, 13]
* Documentação automática da API via Swagger/OpenAPI. [cite: 1, 4]
* Persistência de dados em banco relacional PostgreSQL. [cite: 2, 27]
* Gerenciamento de sessões e segurança via JWT/Bearer Token. [cite: 1, 4]
* Interface de gerenciamento de banco via pgAdmin. [cite: 27]

---

## ⚙️ Rotas/Endpoints da API
Acesse a documentação completa em: http://localhost:3333/swagger

* POST /api/auth/sign-up: Cadastro de usuários.
* POST /api/auth/sign-in: Autenticação.
* GET /api/music: Listagem de músicas.
* POST /api/music: Cadastro de música.

---

## 🧠 Decisões Técnicas e Justificativas
* **Bun:** Escolhido pela velocidade de execução e ferramentas integradas (test runner e bundler). [cite: 26]
* **ElysiaJS:** Framework otimizado para Bun com validação de tipos em tempo real. [cite: 1, 16]
* **Kysely + Prisma:** Prisma para gerenciar migrações e Kysely para consultas SQL performáticas e tipadas. [cite: 1, 22]

---

## Vídeo
youtube.com/watch?v=mxkmVmHT7pE&feature=youtu.be
