# Diário de Bordo - Frontend

> Aplicação frontend React.js para registro e acompanhamento da Postura de Saúde 5D do programa Modulando com Frequência.

---

## 📋 Sumário

- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Descrição das Camadas](#descrição-das-camadas)
- [Fluxo da Aplicação](#fluxo-da-aplicação)
- [Regras de Negócio](#regras-de-negócio)
- [Páginas e Responsabilidades](#páginas-e-responsabilidades)
- [Componentes Reutilizáveis](#componentes-reutilizáveis)
- [Integração com API](#integração-com-api)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Hooks Customizados](#hooks-customizados)
- [Estrutura de Dados](#estrutura-de-dados)
- [Tratamento de Erros](#tratamento-de-erros)
- [Boas Práticas](#boas-práticas)

---

## 🏗️ Arquitetura do Projeto

O projeto segue uma arquitetura **SPA (Single Page Application)** com estrutura modular organizada por responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │ Components  │  │     Services        │  │
│  │             │  │             │  │                     │  │
│  │ • Login     │  │ • HelpTooltip│  │ • api.ts (Axios)   │  │
│  │ • Dashboard │  │             │  │                     │  │
│  │ • Register  │  │             │  │                     │  │
│  │ • MyRecords │  │             │  │                     │  │
│  └──────┬──────┘  └─────────────┘  └─────────────────────┘  │
│         │                                                    │
│  ┌──────┴──────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Hooks    │  │    Router   │  │   ChakraProvider    │  │
│  │             │  │             │  │                     │  │
│  │ • useAuth   │  │   Routes    │  │   UI/Theme Config   │  │
│  │             │  │   Navigate  │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   └── HelpTooltip.tsx  # Tooltip de ajuda contextual
│   │
│   ├── hooks/               # Hooks customizados
│   │   └── useAuth.ts       # Gerenciamento de autenticação
│   │
│   ├── pages/               # Páginas da aplicação
│   │   ├── Login.tsx        # Tela de login e cadastro
│   │   ├── Dashboard.tsx    # Painel principal do usuário
│   │   ├── RegisterRecord.tsx # Formulário de registro diário
│   │   └── MyRecords.tsx    # Histórico de registros
│   │
│   ├── services/            # Serviços de comunicação
│   │   └── api.ts           # Configuração do Axios
│   │
│   ├── assets/              # Recursos estáticos
│   │   └── logo-*.png       # Logo da aplicação
│   │
│   ├── App.tsx              # Componente raiz com rotas
│   ├── main.tsx             # Ponto de entrada da aplicação
│   ├── App.css              # Estilos específicos do App
│   └── index.css            # Estilos globais
│
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração do Vite
└── index.html               # HTML base
```

---

## 🧱 Descrição das Camadas

### 1. Pages (Páginas)

Componentes de alto nível que representam telas completas da aplicação. Cada página é responsável por:

- **Orquestrar** a lógica da tela
- **Gerenciar** o estado local
- **Compor** componentes menores

### 2. Components (Componentes)

Componentes reutilizáveis e desacoplados de contexto:

- `HelpTooltip`: Tooltip de ajuda com ícone de interrogação

### 3. Services (Serviços)

Camada de comunicação com a API:

- `api.ts`: Instância configurada do Axios com interceptors para autenticação

### 4. Hooks (Hooks Customizados)

Lógica reutilizável extraída em hooks:

- `useAuth`: Gerenciamento de sessão via localStorage

### 5. Assets

Recursos estáticos como imagens e logos.

---

## 🔄 Fluxo da Aplicação

### Fluxo de Autenticação

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│  Check   │────▶│  First   │
│   Page   │     │  Email   │     │ Access?  │
└──────────┘     └────┬─────┘     └────┬─────┘
                      │                 │
              ┌───────┴───────┐         │
              │               │         │
              ▼               ▼         ▼
        ┌──────────┐   ┌──────────┐  ┌──────────┐
        │ Not Found│   │  Login   │  │ Complete │
        │  (error) │   │  Form    │  │ Profile  │
        └──────────┘   └────┬─────┘  └────┬─────┘
                            │             │
                            ▼             ▼
                      ┌─────────────────────────┐
                      │    Dashboard/Register   │
                      │      (authenticated)    │
                      └─────────────────────────┘
```

### Fluxo de Registro Diário

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │────▶│   Módulo    │────▶│   Form      │
│   (card)    │     │   Atual     │     │  Registro   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                          ┌────────────────────┼────────────────────┐
                          ▼                    ▼                    ▼
                   ┌─────────────┐      ┌─────────────┐     ┌─────────────┐
                   │  Avaliação  │      │ Observações │     │  Emoção/    │
                   │   Estrelas  │      │  Subcausas  │     │   Insight   │
                   │   (1-5)     │      │             │     │             │
                   └─────────────┘      └─────────────┘     └─────────────┘
                          │                    │                    │
                          └────────────────────┴────────────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Submit    │
                                        │    POST     │
                                        └─────────────┘
```

---

## ⚙️ Regras de Negócio

### Autenticação

| Regra             | Descrição                                                                      |
| ----------------- | ------------------------------------------------------------------------------ |
| Fluxo de Email    | Verifica se email existe no sistema antes de permitir login                    |
| Primeiro Acesso   | Usuários novos devem completar cadastro com nome, CPF, data nascimento e senha |
| Persistência      | Token JWT armazenado no localStorage                                           |
| Proteção de Rotas | Rotas protegidas redirecionam para `/login` se não autenticado                 |
| Logout            | Remove token do localStorage e redireciona para login                          |

### Registro de Postura 5D

| Regra            | Descrição                                                 |
| ---------------- | --------------------------------------------------------- |
| Módulo Ativo     | Registros são vinculados ao módulo atual do programa      |
| Avaliação        | Cada dimensão é avaliada de 1 a 5 estrelas                |
| Subcausas        | Múltiplas observações podem ser selecionadas por dimensão |
| Observação Livre | Campo de texto livre para detalhes adicionais             |
| Emoção           | Campo obrigatório para identificar emoção predominante    |
| Insight          | Campo opcional para insights do dia                       |

### Visualização de Histórico

| Regra     | Descrição                                                    |
| --------- | ------------------------------------------------------------ |
| Ordenação | Registros exibidos em ordem cronológica reversa              |
| Métricas  | Scores coloridos baseados em performance (verde/purple/pink) |
| Fallback  | Tratamento para registros antigos sem estrutura de causas    |

---

## 📱 Páginas e Responsabilidades

### 1. Login (`/login`)

**Responsabilidades:**

- Verificação de existência de email (`/auth/check-email`)
- Fluxo de primeiro acesso com cadastro completo
- Login com credenciais
- Armazenamento de dados do usuário no localStorage

**Estados:**

```typescript
type FlowState = "idle" | "not-found" | "first-access" | "login";
```

**Funcionalidades:**

- Validação de email
- Criação de senha (confirmação)
- Completar perfil (nome, CPF, data nascimento)

---

### 2. Dashboard (`/dashboard`)

**Responsabilidades:**

- Exibir módulo atual do programa
- Menu de navegação para funcionalidades
- Perfil do usuário com logout

**Dados Carregados:**

- `GET /modules/atual` - Informações do módulo atual

**Cards Disponíveis:**

- Registrar novo registro diário
- Visualizar histórico de registros

---

### 3. RegisterRecord (`/register`)

**Responsabilidades:**

- Formulário dinâmico baseado na configuração do módulo
- Avaliação por estrelas (1-5) para cada dimensão
- Seleção de subcausas/observações
- Registro de emoção e insight

**Componentes Internos:**

```typescript
// StarRatingField
interface StarRatingFieldProps {
  causa: Causa;
  value?: {
    nota: number;
    subcausas: string[];
    textoLivre?: string;
  };
  onChange: (data: RatingData) => void;
}
```

**Fluxo de Submissão:**

```typescript
POST /records
{
  emocao: string;
  insight: string;
  causas: [
    {
      causaId: string;
      nota: number;
      subcausas: string[];
      textoLivre?: string;
    }
  ];
}
```

---

### 4. MyRecords (`/records`)

**Responsabilidades:**

- Listar histórico de registros do usuário
- Exibir métricas de cada registro
- Colorir scores baseado em performance
- Fallback para registros antigos

**Funcionalidades:**

- Loading state com spinner
- Empty state com mensagem amigável
- Formatação de datas em português

---

## 🧩 Componentes Reutilizáveis

### HelpTooltip

Componente de tooltip de ajuda contextual com ícone de interrogação.

**Props:**

```typescript
interface HelpTooltipProps {
  text: string; // Texto explicativo do tooltip
}
```

**Uso:**

```tsx
<HelpTooltip text="Avalie como essa dimensão esteve presente no seu dia" />
```

**Features:**

- Ícone `FaQuestionCircle` do react-icons
- Estilização em roxo (purple)
- Posicionamento automático
- Animação hover

---

## 🔌 Integração com API

### Configuração Base

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

### Interceptor de Autenticação

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Consumidos

| Endpoint             | Método | Descrição                    |
| -------------------- | ------ | ---------------------------- |
| `/auth/check-email`  | GET    | Verifica existência de email |
| `/auth/login`        | POST   | Autentica usuário            |
| `/auth/first-access` | POST   | Completa cadastro inicial    |
| `/modules/atual`     | GET    | Retorna módulo atual         |
| `/records`           | GET    | Lista registros do usuário   |
| `/records`           | POST   | Cria novo registro           |

### Formatos de Request/Response

**Login Request:**

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Login Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "usuario@email.com",
    "nome": "Nome do Usuário"
  }
}
```

**First Access Request:**

```json
{
  "email": "usuario@email.com",
  "nome": "Nome Completo",
  "cpf": "123.456.789-00",
  "dataNascimento": "1990-01-01",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

**Módulo Atual Response:**

```json
{
  "id": "modulo-1",
  "nome": "Módulo 1: Fundamentos",
  "causas": [
    {
      "id": "causa-1",
      "nome": "Dimensão Física",
      "descricao": "Aspectos físicos do bem-estar",
      "maxSubcausas": 3,
      "subcausas": [
        { "id": "sub-1", "nome": "Sono" },
        { "id": "sub-2", "nome": "Alimentação" }
      ]
    }
  ]
}
```

**Create Record Request:**

```json
{
  "emocao": "Alegria",
  "insight": "Hoje percebi a importância do descanso",
  "causas": [
    {
      "causaId": "causa-1",
      "nota": 4,
      "subcausas": ["sub-1", "sub-2"],
      "textoLivre": "Dormi bem, alimentação equilibrada"
    }
  ]
}
```

**Records List Response:**

```json
[
  {
    "registroId": "reg-123",
    "moduloId": "modulo-1",
    "data": "2024-01-15T10:30:00Z",
    "emocao": "Alegria",
    "insight": "Insight do dia",
    "causas": [
      {
        "causaId": "causa-1",
        "nota": 4,
        "subcausas": ["sub-1"],
        "textoLivre": "Observação"
      }
    ]
  }
]
```

---

## 🗄️ Gerenciamento de Estado

### Estado Global

O projeto utiliza **React Context** implícito via ChakraProvider para tema e estados de UI.

### Estado Local (useState)

Cada página gerencia seu próprio estado:

| Página         | Estados                                                                          |
| -------------- | -------------------------------------------------------------------------------- |
| Login          | `email`, `password`, `flow`, `nome`, `cpf`, `dataNascimento`, `loading`, `error` |
| Dashboard      | `modulo`, `loading`                                                              |
| RegisterRecord | `moduloConfig`, `form`, `loading`                                                |
| MyRecords      | `records`, `loading`                                                             |

### Persistência de Estado

Dados persistidos no localStorage:

```typescript
// useAuth hook
localStorage.setItem("token", token);
localStorage.setItem("email", email);
localStorage.setItem("userName", userName);
```

---

## 🎣 Hooks Customizados

### useAuth

Hook responsável por todo o gerenciamento de autenticação.

**Retorno:**

```typescript
interface UseAuthReturn {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
```

**Implementação:**

```typescript
export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  function login(token: string) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
```

**Uso:**

```tsx
const auth = useAuth();

// Proteção de rota
{
  auth.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />;
}

// Login
auth.login(response.data.token);

// Logout
auth.logout();
```

---

## 📐 Estrutura de Dados

### Types e Interfaces

```typescript
// Tipos de autenticação
type FlowState = "idle" | "not-found" | "first-access" | "login";

// Tipos de módulo
type Subcausa = {
  id: string;
  nome: string;
};

type Causa = {
  id: string;
  nome: string;
  descricao?: string;
  maxSubcausas: number;
  subcausas: Subcausa[];
};

type ModuloConfig = {
  id: string;
  nome: string;
  causas: Causa[];
};

// Tipos de registro
type RegistroCausa = {
  causaId: string;
  nota: number;
  subcausas?: string[];
  textoLivre?: string;
};

type RegistroForm = {
  emocao: string;
  insight: string;
  causas: Record<
    string,
    {
      nota: number;
      subcausas: string[];
      textoLivre?: string;
    }
  >;
};
```

### Props dos Componentes

```typescript
// Login
interface LoginProps {
  onLogin: (token: string) => void;
}

// StarRatingField (componente interno)
interface StarRatingFieldProps {
  causa: Causa;
  value?: {
    nota: number;
    subcausas: string[];
    textoLivre?: string;
  };
  onChange: (data: {
    nota: number;
    subcausas: string[];
    textoLivre?: string;
  }) => void;
}

// HelpTooltip
interface HelpTooltipProps {
  text: string;
}
```

---

## ⚠️ Tratamento de Erros

### Estados de Erro

| Página         | Erro                    | Mensagem                           | Ação                                          |
| -------------- | ----------------------- | ---------------------------------- | --------------------------------------------- |
| Login          | Email não encontrado    | "Este email não foi encontrado..." | Exibe mensagem de erro com contato de suporte |
| Login          | Senha inválida          | "Email ou senha inválidos"         | Limpa senha, mantém email                     |
| Login          | Erro de rede            | "Erro ao verificar email"          | Toast/alert genérico                          |
| First Access   | Senhas não conferem     | "As senhas não conferem"           | Validação antes de submit                     |
| First Access   | Erro no cadastro        | Mensagem da API                    | Exibe erro retornado                          |
| RegisterRecord | Erro ao salvar          | "Erro ao salvar registro"          | Alert genérico                                |
| Dashboard      | Erro ao carregar módulo | Log no console                     | Silencioso, mostra "—"                        |

### Estados de Loading

Todos os componentes possuem estados de loading:

- **Botões**: Spinner substituindo texto durante submit
- **Páginas**: Spinner centralizado em área de conteúdo
- **Cards**: Estados visuais de hover com transições

### Estados Vazios

**MyRecords - Sem registros:**

```tsx
<Box textAlign="center">
  <Text fontSize="4xl">✨</Text>
  <Text color="gray.500">Nenhum registro encontrado</Text>
  <Text color="gray.400">Comece registrando seu primeiro dia!</Text>
</Box>
```

---

## ✅ Boas Práticas Utilizadas

### 1. TypeScript

- Tipagem completa de props e estados
- Interfaces bem definidas
- Evita uso de `any` (exceto em casos específicos com eslint-disable)

### 2. Componentização

- Componentes pequenos e focados (StarRatingField)
- Separação clara entre pages e components
- Props desacopladas para testabilidade

### 3. Gerenciamento de Estado

- Estado local preferencial ao global
- Persistência mínima necessária (apenas auth)
- Atualização imutável de objetos

### 4. UX/UI

- Feedback visual imediato (hover, loading)
- Tooltips explicativos em campos complexos
- Estados vazios amigáveis
- Color coding para métricas (green/purple/pink)

### 5. Acessibilidade

- Suporte a navegação por teclado (Enter no login)
- Contraste adequado de cores
- Semântica HTML via Chakra UI

### 6. Performance

- Lazy loading implícito via code splitting do Vite
- Memorização via React hooks quando necessário
- Requisições otimizadas (sem polling desnecessário)

### 7. Segurança

- Token JWT em localStorage (adequado para SPA)
- Interceptor automático de autorização
- Proteção de rotas no frontend

### 8. Estilização

- Design System consistente via Chakra UI
- Variáveis de tema (purple como cor primária)
- Responsividade mobile-first
- Animações sutis (transições CSS)

### 9. Código

- Eslint configurado
- Nomenclatura em português (negócio) + inglês (técnico)
- Comentários explicativos em blocos complexos
- Separação de concerns (UI vs Lógica)

---

## 🚀 Variáveis de Ambiente

```bash
# .env
VITE_API_URL=https://api.exemplo.com
```

---

## 📦 Dependências Principais

| Pacote           | Versão | Propósito      |
| ---------------- | ------ | -------------- |
| react            | ^18.x  | Framework UI   |
| react-router-dom | ^6.x   | Roteamento     |
| @chakra-ui/react | ^3.x   | Componentes UI |
| axios            | ^1.x   | HTTP Client    |
| react-icons      | ^5.x   | Ícones         |
| framer-motion    | ^11.x  | Animações      |
| typescript       | ^5.x   | Tipagem        |
| vite             | ^5.x   | Build tool     |

---

## 📝 Notas de Implementação

1. **Fluxo de Login Multi-etapa**: O login verifica primeiro a existência do email, depois determina se é primeiro acesso ou login normal.

2. **Formulário Dinâmico**: A página de registro carrega a configuração do módulo atual e renderiza campos dinamicamente baseado nas causas retornadas.

3. **Fallback de Dados**: A página de histórico possui tratamento para registros antigos que podem não ter a estrutura completa de causas.

4. **Estilização Temática**: Todo o projeto utiliza uma paleta de cores em tons de roxo/purple, remetendo à identidade visual do programa "Modulando com Frequência".

---

_Documentação gerada automaticamente baseada na análise do código-fonte._
