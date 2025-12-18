# Arquitetura do Sistema BeMusicSeeker

## 1. Diagrama de Contexto (C4 - Nível 1)

```mermaid
graph TB
    User[👤 Usuário Final<br/>Ouvinte/Artista]
    Admin[👤 Moderador]
    
    System[🎵 BeMusicSeeker<br/>Plataforma de Compartilhamento<br/>de Músicas]
    
    Email[📧 Serviço de Email<br/>Notificações]
    Storage[☁️ Cloud Storage<br/>Amazon S3 / Cloudflare R2<br/>Arquivos de Áudio e Imagens]
    
    User -->|Descobre músicas, cria posts,<br/>comenta, segue artistas| System
    Admin -->|Modera conteúdo,<br/>analisa reports| System
    
    System -->|Envia notificações| Email
    System -->|Armazena/recupera<br/>áudios e imagens| Storage
    
    style System fill:#667eea,stroke:#333,stroke-width:4px,color:#fff
    style User fill:#48bb78,stroke:#333,stroke-width:2px,color:#fff
    style Admin fill:#ed8936,stroke:#333,stroke-width:2px,color:#fff
```

## 2. Arquitetura de Containers (C4 - Nível 2)

```mermaid
graph TB
    subgraph "🌐 Cliente (Browser)"
        WebApp[Next.js Application<br/>React 19 + TypeScript<br/>Port: 3000]
    end
    
    subgraph "🖥️ Servidor Backend"
        API[Elysia API Server<br/>Bun Runtime<br/>Port: 4000]
        Auth[Better Auth Service<br/>Autenticação e Sessões]
    end
    
    subgraph "💾 Camada de Dados"
        DB[(PostgreSQL Database<br/>be_music_share<br/>Port: 5433)]
        PGAdmin[pgAdmin<br/>Gerenciamento DB<br/>Port: 5050]
    end
    
    subgraph "📦 Cache & Storage"
        Redis[(Redis Cache<br/>Sessões e Cache)]
        FileStorage[File Storage<br/>Arquivos Estáticos]
    end
    
    WebApp -->|HTTP/HTTPS<br/>REST API<br/>JSON| API
    WebApp -->|Rewrite Proxy<br/>/v1/*| API
    
    API -->|Better Auth<br/>JWT/Session| Auth
    API -->|Prisma + Kysely<br/>SQL Queries| DB
    API -->|Cache de sessão| Redis
    API -->|Upload/Download| FileStorage
    
    PGAdmin -.->|Administração| DB
    
    style WebApp fill:#61dafb,stroke:#333,stroke-width:2px
    style API fill:#667eea,stroke:#333,stroke-width:3px,color:#fff
    style Auth fill:#f6ad55,stroke:#333,stroke-width:2px
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
```

## 3. Arquitetura de Componentes - Backend

```mermaid
graph TB
    subgraph "🎯 API Layer - Elysia"
        Server[server.ts<br/>Main Server Instance]
        Router[Routes Handler]
        Middleware[Middlewares<br/>CORS, OpenAPI, Auth]
    end
    
    subgraph "🔐 Security & Auth"
        AuthCore[core/auth/auth.ts<br/>Better Auth Config]
        AuthMacro[core/auth/macro.ts<br/>Auth Decorators]
        Guards[security/auth_guards.ts<br/>Route Protection]
    end
    
    subgraph "📋 Business Modules"
        UserModule[modules/perfil/<br/>User Management]
        RecoModule[nova-recomendacao/<br/>Recommendations]
        
        subgraph "User Module Structure"
            UserController[controller.ts<br/>HTTP Endpoints]
            UserService[service.ts<br/>Business Logic]
            UserRepo[repository.ts<br/>Data Access]
            UserModel[model.ts<br/>Validation Schemas]
        end
        
        subgraph "Recommendation Module"
            RecoController[controller.ts<br/>HTTP Endpoints]
            RecoService[service.ts<br/>Business Logic]
        end
    end
    
    subgraph "🗄️ Data Layer"
        PrismaClient[db/client.ts<br/>Prisma Client]
        DBTypes[db/types.ts<br/>Kysely Types]
        DBEnums[db/enums.ts<br/>Database Enums]
    end
    
    Server --> Router
    Server --> Middleware
    
    Middleware --> AuthCore
    AuthCore --> AuthMacro
    AuthMacro --> Guards
    
    Router --> UserModule
    Router --> RecoModule
    
    UserController --> UserService
    UserService --> UserRepo
    
    RecoController --> RecoService
    
    UserRepo --> PrismaClient
    RecoService --> PrismaClient
    
    PrismaClient --> DBTypes
    PrismaClient --> DBEnums
    
    style Server fill:#667eea,stroke:#333,stroke-width:3px,color:#fff
    style AuthCore fill:#f6ad55,stroke:#333,stroke-width:2px
    style PrismaClient fill:#2d3748,stroke:#333,stroke-width:2px,color:#fff
```

## 4. Arquitetura de Componentes - Frontend

```mermaid
graph TB
    subgraph "🎨 Next.js Application"
        Layout[app/layout.tsx<br/>Root Layout]
        
        subgraph "📄 Pages (App Router)"
            Home[page.tsx<br/>Landing Page]
            Login[entrar/page.tsx<br/>Login]
            Register[cadastro/page.tsx<br/>Register]
            Dashboard[dashboard/page.tsx<br/>User Dashboard]
            Profile[perfil/[username]/page.tsx<br/>User Profile]
            Explore[explorar/page.tsx<br/>Discover Music]
            Favorites[favoritos/page.tsx<br/>Saved Songs]
            NewReco[nova-recomendacao/page.tsx<br/>Create Recommendation]
            Rankings[rankings/page.tsx<br/>Top Charts]
            Following[seguindo/page.tsx<br/>Feed]
            Trending[trending/page.tsx<br/>Trending]
            Config[configuracoes/page.tsx<br/>Settings]
        end
        
        subgraph "🧩 Components"
            UI[components/ui/<br/>Radix UI Components]
            Custom[Custom Components<br/>Cards, Players, etc]
        end
        
        subgraph "📡 API Layer"
            APILib[lib/api.ts<br/>API Client]
            APIReco[lib/api/recommendations.ts<br/>Recommendations API]
            Utils[lib/utils.ts<br/>Utilities]
        end
    end
    
    Layout --> Home
    Layout --> Login
    Layout --> Register
    Layout --> Dashboard
    Layout --> Profile
    Layout --> Explore
    Layout --> Favorites
    Layout --> NewReco
    Layout --> Rankings
    Layout --> Following
    Layout --> Trending
    Layout --> Config
    
    Dashboard --> UI
    Profile --> UI
    Explore --> Custom
    NewReco --> Custom
    
    Login --> APILib
    Register --> APILib
    Dashboard --> APILib
    NewReco --> APIReco
    
    APILib --> Utils
    APIReco --> APILib
    
    APILib -->|HTTP Requests| Backend[Backend API<br/>localhost:4000]
    
    style Layout fill:#61dafb,stroke:#333,stroke-width:3px
    style APILib fill:#667eea,stroke:#333,stroke-width:2px,color:#fff
    style Backend fill:#2d3748,stroke:#333,stroke-width:2px,color:#fff
```

## 5. Modelo de Dados (ER Diagram)

```mermaid
erDiagram
    User ||--o{ Song : "creates"
    User ||--o{ Post : "writes"
    User ||--o{ Vote : "votes"
    User ||--o{ Comment : "comments"
    User ||--o{ Follow : "follows/followed_by"
    User ||--o{ SavedSong : "saves"
    User ||--o{ Notification : "receives"
    User ||--o{ Report : "reports"
    
    Song ||--o{ Post : "featured_in"
    Song ||--o{ SavedSong : "saved_by"
    
    Post ||--o{ Vote : "has"
    Post ||--o{ Comment : "has"
    Post ||--o{ PostTag : "tagged_with"
    
    User {
        int id PK
        string email UK
        string password_hash
        string name
        text bio
        string profile_picture_url
        boolean is_artist
        string social_links
        timestamp created_at
        timestamp updated_at
    }
    
    Song {
        int id PK
        string title
        text description
        int artist_id FK
        string genre
        int duration_seconds
        string file_url
        string cover_image_url
        int play_count
        enum moderation_status
        int report_count
        timestamp created_at
        timestamp updated_at
    }
    
    Post {
        int id PK
        int user_id FK
        int song_id FK
        text content
        int upvotes_count
        int downvotes_count
        int comments_count
        timestamp created_at
        timestamp updated_at
    }
    
    Vote {
        int id PK
        int user_id FK
        int post_id FK
        enum vote_type
        timestamp created_at
    }
    
    Comment {
        int id PK
        int user_id FK
        int post_id FK
        text content
        timestamp created_at
        timestamp updated_at
    }
    
    Follow {
        int id PK
        int follower_id FK
        int following_id FK
        timestamp created_at
    }
    
    SavedSong {
        int id PK
        int user_id FK
        int song_id FK
        timestamp created_at
    }
    
    PostTag {
        int id PK
        int post_id FK
        string tag
        timestamp created_at
    }
    
    Notification {
        int id PK
        int user_id FK
        enum type
        text content
        int related_id
        enum related_type
        boolean is_read
        timestamp created_at
    }
    
    Report {
        int id PK
        int reporter_id FK
        enum reported_type
        int reported_id
        enum status
        text reason
        timestamp created_at
        timestamp reviewed_at
    }
```

## 6. Fluxo de Autenticação

```mermaid
sequenceDiagram
    actor User as 👤 Usuário
    participant FE as Next.js Frontend
    participant Proxy as Next.js Rewrite<br/>/v1/*
    participant API as Elysia API
    participant Auth as Better Auth
    participant DB as PostgreSQL
    
    User->>FE: Acessa /entrar
    FE->>User: Renderiza formulário
    
    User->>FE: Submete credenciais<br/>(email, password)
    FE->>FE: Valida formulário
    
    FE->>Proxy: POST /v1/api/sign-in/email<br/>{email, password}
    Proxy->>API: Proxy request<br/>localhost:4000/v1/api/sign-in/email
    
    API->>Auth: betterAuth.handler
    Auth->>DB: Busca usuário por email
    DB-->>Auth: Dados do usuário
    
    Auth->>Auth: Verifica password_hash<br/>(bcrypt compare)
    
    alt Credenciais válidas
        Auth->>DB: Cria sessão
        DB-->>Auth: Session token
        Auth-->>API: {user, session}
        API-->>Proxy: 200 OK + Set-Cookie
        Proxy-->>FE: {user, session}
        FE->>FE: Salva sessão
        FE->>User: Redireciona /dashboard
    else Credenciais inválidas
        Auth-->>API: 401 Unauthorized
        API-->>Proxy: {error: "Invalid credentials"}
        Proxy-->>FE: Erro de autenticação
        FE->>User: Exibe mensagem de erro
    end
    
    Note over FE,DB: Sessão armazenada via cookies HttpOnly<br/>com BETTER_AUTH_SECRET
```

## 7. Fluxo de Criação de Recomendação

```mermaid
sequenceDiagram
    actor User as 👤 Artista
    participant FE as Frontend<br/>nova-recomendacao
    participant API as API<br/>/recommendations
    participant Auth as Auth Middleware
    participant Service as RecommendationService
    participant DB as PostgreSQL
    participant Storage as File Storage
    
    User->>FE: Acessa /nova-recomendacao
    FE->>API: GET /v1/api/get-session
    API->>Auth: Valida sessão
    Auth-->>API: {user, session}
    API-->>FE: Usuário autenticado
    
    User->>FE: Preenche formulário<br/>(título, artista, gênero, etc)
    
    opt Upload de arquivo
        User->>FE: Seleciona arquivo MP3
        FE->>Storage: Upload arquivo
        Storage-->>FE: file_url
    end
    
    User->>FE: Submete recomendação
    FE->>FE: Valida dados localmente
    
    FE->>API: POST /v1/recommendations<br/>{title, artist, genre, description, tags, mediaUrl}
    API->>Auth: Verifica auth: true
    Auth-->>API: user.id
    
    API->>Service: createRecommendation(data, userId)
    
    Service->>DB: BEGIN TRANSACTION
    Service->>DB: INSERT INTO songs<br/>(title, artist_id, genre, file_url, etc)
    DB-->>Service: song.id
    
    Service->>DB: INSERT INTO posts<br/>(user_id, song_id, content)
    DB-->>Service: post.id
    
    Service->>DB: INSERT INTO post_tags<br/>(post_id, tag) x N
    DB-->>Service: tags criadas
    
    Service->>DB: COMMIT TRANSACTION
    
    Service-->>API: {recommendation, song, post}
    API-->>FE: 201 Created<br/>{success: true, data}
    
    FE->>User: Exibe confirmação<br/>Redireciona para feed
    
    Note over Service,DB: moderation_status = 'pending'<br/>até aprovação do moderador
```

## 8. Fluxo de Descoberta e Interação

```mermaid
sequenceDiagram
    actor User as 👤 Usuário
    participant FE as Frontend
    participant API as API Server
    participant DB as PostgreSQL
    
    User->>FE: Acessa /explorar
    FE->>API: GET /v1/recommendations?limit=20&offset=0
    API->>DB: SELECT posts JOIN songs<br/>WHERE moderation_status = 'approved'<br/>ORDER BY created_at DESC
    DB-->>API: Lista de recomendações
    API-->>FE: {data: [...], pagination}
    FE->>User: Renderiza grid de músicas
    
    User->>FE: Clica em música
    FE->>API: GET /v1/songs/:id
    API->>DB: SELECT song + artist info
    DB-->>API: Detalhes da música
    API-->>FE: Song data
    FE->>User: Reproduz música + exibe detalhes
    
    User->>FE: Upvote no post
    FE->>API: POST /v1/votes<br/>{post_id, vote_type: 'upvote'}
    API->>DB: INSERT INTO votes<br/>ON CONFLICT UPDATE
    API->>DB: UPDATE posts<br/>SET upvotes_count = upvotes_count + 1
    DB-->>API: Vote registrado
    API-->>FE: {success: true}
    FE->>User: UI atualizada (contador +1)
    
    User->>FE: Adiciona comentário
    FE->>API: POST /v1/comments<br/>{post_id, content}
    API->>DB: INSERT INTO comments
    API->>DB: UPDATE posts<br/>SET comments_count = comments_count + 1
    API->>DB: INSERT INTO notifications<br/>(para autor do post)
    DB-->>API: Comment criado
    API-->>FE: {success: true, comment}
    FE->>User: Comentário exibido
    
    User->>FE: Salva música
    FE->>API: POST /v1/saved-songs<br/>{song_id}
    API->>DB: INSERT INTO saved_songs
    DB-->>API: Música salva
    API-->>FE: {success: true}
    FE->>User: Ícone muda para "Salvo"
```

## 9. Arquitetura de Deploy (Infraestrutura)

```mermaid
graph TB
    subgraph "🌍 Internet"
        Client[👤 Browsers/<br/>Mobile Apps]
    end
    
    subgraph "☁️ Cloud Provider (Vercel / Railway / AWS)"
        subgraph "Frontend Tier"
            NextJS[Next.js App<br/>Edge Functions<br/>SSR + Static]
            CDN[CDN<br/>Static Assets<br/>Images, Fonts]
        end
        
        subgraph "Backend Tier"
            LB[Load Balancer<br/>NGINX / Cloud LB]
            API1[Elysia API<br/>Instance 1]
            API2[Elysia API<br/>Instance 2]
            APIn[Elysia API<br/>Instance N]
        end
        
        subgraph "Data Tier"
            PG[(PostgreSQL<br/>Primary)]
            PGReplica[(PostgreSQL<br/>Read Replica)]
            RedisCluster[(Redis Cluster<br/>Sessions + Cache)]
        end
        
        subgraph "Storage Tier"
            S3[S3 / R2<br/>Media Files<br/>Audio + Images]
        end
        
        subgraph "Monitoring & Logs"
            Monitor[Prometheus<br/>Grafana]
            Logs[CloudWatch<br/>Logs]
        end
    end
    
    Client -->|HTTPS| NextJS
    Client -->|HTTPS| CDN
    
    NextJS -->|API Calls| LB
    
    LB --> API1
    LB --> API2
    LB --> APIn
    
    API1 --> PG
    API2 --> PG
    APIn --> PG
    
    API1 --> PGReplica
    API2 --> PGReplica
    
    API1 --> RedisCluster
    API2 --> RedisCluster
    APIn --> RedisCluster
    
    API1 --> S3
    API2 --> S3
    
    API1 -.->|Metrics| Monitor
    API2 -.->|Metrics| Monitor
    NextJS -.->|Logs| Logs
    
    PG -->|Replication| PGReplica
    
    style NextJS fill:#61dafb,stroke:#333,stroke-width:2px
    style LB fill:#667eea,stroke:#333,stroke-width:2px,color:#fff
    style PG fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style S3 fill:#ff9900,stroke:#333,stroke-width:2px
```

## 10. Fluxo de Dados Completo (Data Flow)

```mermaid
flowchart TD
    Start([👤 Usuário]) --> Action{Ação}
    
    Action -->|Cadastro/Login| Auth[Autenticação]
    Action -->|Navegar| Browse[Exploração]
    Action -->|Upload| Upload[Upload Música]
    Action -->|Interação| Interact[Votação/Comentário]
    
    Auth --> ValidateAuth{Validar<br/>Credenciais}
    ValidateAuth -->|Válido| CreateSession[Criar Sessão<br/>Better Auth]
    ValidateAuth -->|Inválido| ErrorAuth[Erro 401]
    CreateSession --> StoreSession[(Salvar Cookie<br/>+ DB Session)]
    StoreSession --> Dashboard[Dashboard]
    
    Browse --> CheckAuth{Usuário<br/>Autenticado?}
    CheckAuth -->|Sim| LoadFeed[Carregar Feed<br/>Personalizado]
    CheckAuth -->|Não| LoadPublic[Carregar Feed<br/>Público]
    LoadFeed --> QueryDB[(Query DB<br/>Posts + Songs)]
    LoadPublic --> QueryDB
    QueryDB --> RenderUI[Renderizar UI]
    
    Upload --> ValidateFile{Validar<br/>Arquivo}
    ValidateFile -->|Válido| UploadStorage[Upload S3/R2]
    ValidateFile -->|Inválido| ErrorFile[Erro Validação]
    UploadStorage --> CreateRecord[Criar Registro<br/>Song + Post]
    CreateRecord --> QueueModeration[Fila de<br/>Moderação]
    QueueModeration --> NotifyMods[Notificar<br/>Moderadores]
    
    Interact --> ValidateAction{Validar<br/>Permissão}
    ValidateAction -->|OK| UpdateDB[(Atualizar<br/>Votes/Comments)]
    ValidateAction -->|Negado| ErrorPerm[Erro 403]
    UpdateDB --> UpdateCounters[Atualizar<br/>Contadores]
    UpdateCounters --> CreateNotif[Criar<br/>Notificação]
    CreateNotif --> SendNotif[Enviar<br/>Notificação]
    
    Dashboard --> End([Fim])
    RenderUI --> End
    ErrorAuth --> End
    ErrorFile --> End
    ErrorPerm --> End
    SendNotif --> End
    
    style Start fill:#48bb78,stroke:#333,stroke-width:2px,color:#fff
    style Auth fill:#667eea,stroke:#333,stroke-width:2px,color:#fff
    style Upload fill:#ed8936,stroke:#333,stroke-width:2px,color:#fff
    style QueryDB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style End fill:#48bb78,stroke:#333,stroke-width:2px,color:#fff
```

## 11. Stack Tecnológico Detalhado

```mermaid
graph LR
    subgraph "Frontend Stack"
        A1[Next.js 16<br/>App Router]
        A2[React 19]
        A3[TypeScript]
        A4[Tailwind CSS 4]
        A5[Radix UI]
        A6[Lucide Icons]
    end
    
    subgraph "Backend Stack"
        B1[Elysia 1.4<br/>Web Framework]
        B2[Bun Runtime]
        B3[TypeScript]
        B4[Better Auth 1.4<br/>Authentication]
        B5[@elysiajs/openapi<br/>Swagger]
        B6[@elysiajs/cors<br/>CORS]
    end
    
    subgraph "Database Stack"
        C1[(PostgreSQL 18)]
        C2[Prisma ORM]
        C3[Kysely<br/>Type-safe SQL]
        C4[pgAdmin<br/>Management]
    end
    
    subgraph "DevOps Stack"
        D1[Docker<br/>Compose]
        D2[Git<br/>Version Control]
        D3[ESLint<br/>Linting]
        D4[Oxlint<br/>Fast Linter]
    end
    
    A1 --> A2
    A2 --> A3
    A1 --> A4
    A2 --> A5
    A5 --> A6
    
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B6
    
    C2 --> C1
    C3 --> C1
    C4 --> C1
    
    style A1 fill:#61dafb,stroke:#333,stroke-width:2px
    style B1 fill:#667eea,stroke:#333,stroke-width:2px,color:#fff
    style C1 fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style D1 fill:#2496ed,stroke:#333,stroke-width:2px,color:#fff
```

## 12. Arquitetura de Segurança

```mermaid
graph TB
    subgraph "🔒 Security Layers"
        L1[Network Layer<br/>HTTPS/TLS]
        L2[Application Layer<br/>CORS + Rate Limiting]
        L3[Authentication Layer<br/>Better Auth + JWT]
        L4[Authorization Layer<br/>Auth Guards + Permissions]
        L5[Data Layer<br/>SQL Injection Prevention]
        L6[Storage Layer<br/>Encrypted at Rest]
    end
    
    subgraph "🛡️ Security Mechanisms"
        M1[Password Hashing<br/>bcrypt]
        M2[Session Management<br/>HttpOnly Cookies]
        M3[CSRF Protection<br/>SameSite Cookies]
        M4[XSS Prevention<br/>Content Security Policy]
        M5[Input Validation<br/>Elysia TypeBox]
        M6[SQL Parameterization<br/>Prisma/Kysely]
        M7[File Upload Validation<br/>Type + Size Checks]
        M8[Report System<br/>Content Moderation]
    end
    
    Request[📨 HTTP Request] --> L1
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> L6
    
    L3 --> M1
    L3 --> M2
    L2 --> M3
    L2 --> M4
    L4 --> M5
    L5 --> M6
    L6 --> M7
    L4 --> M8
    
    style Request fill:#fc8181,stroke:#333,stroke-width:2px,color:#fff
    style L1 fill:#48bb78,stroke:#333,stroke-width:2px,color:#fff
    style L6 fill:#48bb78,stroke:#333,stroke-width:2px,color:#fff
```

---

## Convenções dos Diagramas

### Cores:
- 🔵 **Azul (#667eea)**: Backend/API Services
- 🟢 **Verde (#48bb78)**: User/Success/Security OK
- 🟠 **Laranja (#ed8936)**: Auth/Admin/Warning
- 🔴 **Vermelho (#fc8181)**: Errors/Threats
- ⚫ **Cinza (#2d3748)**: Database/Storage
- 🟦 **Azul Claro (#61dafb)**: Frontend/React

### Símbolos:
- 👤 Usuário/Actor
- 🎵 Aplicação Principal
- 📧 Email/Notificações
- ☁️ Cloud Services
- 💾 Banco de Dados
- 🔒 Segurança
- 📦 Cache/Storage
- 🌐 Cliente/Browser

---

## Como Visualizar

1. **GitHub/GitLab**: Os diagramas Mermaid são renderizados automaticamente
2. **VS Code**: Instale a extensão "Markdown Preview Mermaid Support"
3. **Online**: Cole em https://mermaid.live/
4. **Obsidian**: Renderização nativa de Mermaid
5. **Notion**: Use blocos de código com syntax `mermaid`

---

## Atualizações

- **Versão**: 1.0
- **Data**: 18/12/2025
- **Autor**: Equipe BeMusicSeeker
- **Próximas Atualizações**: 
  - Adicionar diagramas de sequência para fluxos de moderação
  - Incluir diagramas de capacidade e escalabilidade
  - Documentar estratégias de cache
