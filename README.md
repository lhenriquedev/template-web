# Template Web - React + TypeScript + Vite

Um template moderno e completo para desenvolvimento de aplicações web com React, TypeScript, Vite e shadcn/ui, incluindo sistema de autenticação, roteamento e gerenciamento de estado.

## Stack Tecnológica

### Core
- **React 19** - Biblioteca UI com suporte aos novos hooks (`use()`)
- **TypeScript 5.9** - Tipagem estática
- **Vite 7** - Build tool e dev server ultrarrápido
- **pnpm** - Gerenciador de pacotes eficiente

### UI & Styling
- **shadcn/ui** - Componentes UI de alta qualidade (estilo `base-nova`)
- **Tailwind CSS 4** - Framework CSS utility-first
- **@base-ui/react** - Componentes base acessíveis
- **Hugeicons** - Biblioteca de ícones
- **Vaul** - Drawer component
- **Recharts** - Biblioteca de gráficos

### Roteamento & Estado
- **React Router 7** - Roteamento com suporte a lazy loading
- **TanStack Query** - Gerenciamento de estado servidor
- **TanStack Table** - Tabelas poderosas e flexíveis

### Formulários & Validação
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Schema validation
- **@hookform/resolvers** - Integração RHF + Zod

### HTTP & API
- **Axios** - Cliente HTTP com interceptors
- **Sistema de autenticação JWT** - Com refresh token automático

## Pré-requisitos

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

```bash
# Instalar pnpm globalmente (se necessário)
npm install -g pnpm
```

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd template-web
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

4. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

## Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento (geralmente na porta 5173)
pnpm dev

# Compila o TypeScript e cria o build de produção
pnpm build

# Executa o linting do código
pnpm lint

# Preview do build de produção localmente
pnpm preview
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   ├── AppSidebar.tsx  # Layout principal com sidebar
│   └── ErrorBoundary.tsx # Tratamento de erros
├── contexts/           # Context API (AuthContext)
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
│   ├── utils.ts        # Helpers (cn para classes)
│   └── queryClient.ts  # Configuração TanStack Query
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   ├── SignIn.tsx
│   └── Signup.tsx
├── router/             # Configuração de rotas
│   ├── index.tsx       # Definição das rotas
│   └── AuthGuard.tsx   # Proteção de rotas
├── services/           # Serviços de API
│   ├── httpClient.ts   # Cliente Axios configurado
│   └── AuthService.ts  # Serviço de autenticação
├── storage/            # Constantes de storage
│   └── keys.ts         # Chaves do localStorage
├── App.tsx             # Componente raiz
├── main.tsx            # Entry point
└── index.css           # Estilos globais Tailwind
```

## Arquitetura

### Hierarquia de Providers

O `App.tsx` organiza os providers na seguinte ordem (de fora para dentro):

```tsx
<ErrorBoundary>           // Captura erros globais
  <QueryClientProvider>   // Estado servidor (TanStack Query)
    <AuthProvider>        // Autenticação e tokens
      <BrowserRouter>     // Roteamento
        <SidebarComponent> // Layout
          <Router />       // Rotas da aplicação
```

### Sistema de Autenticação

#### Fluxo de Autenticação

1. **Login**: `AuthService.signIn()` retorna `accessToken` e `refreshToken`
2. **Storage**: Tokens salvos no localStorage com prefixo `template:`
3. **Request Interceptor**: Adiciona automaticamente o `accessToken` no header `Authorization`
4. **Response Interceptor**: Detecta erro 401 e renova o token automaticamente
5. **Logout**: Limpa o localStorage e redireciona para `/sign-in`

#### Arquivos Principais

- **`src/contexts/AuthContext.tsx`**: Provider e hooks de autenticação
  - `useAuth()` - Hook para acessar contexto de auth
  - Request interceptor (linha 30-42): Injeta token em requests
  - Response interceptor (linha 44-77): Refresh automático em 401
- **`src/router/AuthGuard.tsx`**: Proteção de rotas
  - ⚠️ **Importante**: Atualmente com `signedIn = true` hardcoded (linha 4)
  - Para produção, substituir por: `const { signedIn } = useAuth();`
- **`src/services/AuthService.ts`**: Métodos de API para auth
  - `signUp()` - Registro de usuário
  - `signIn()` - Login
  - `refreshToken()` - Renovação de token

### Roteamento

#### Estrutura de Rotas

```tsx
// src/router/index.tsx
<Routes>
  {/* Rotas Privadas - Requer autenticação */}
  <Route element={<AuthGuard isPrivate />}>
    <Route path="/" element={<Home />} />
  </Route>

  {/* Rotas Públicas - Apenas para não autenticados */}
  <Route element={<AuthGuard isPrivate={false} />}>
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />} />
  </Route>
</Routes>
```

#### Lazy Loading

Todas as páginas são carregadas via `lazy()` para code splitting:

```tsx
const Home = lazy(() => import("@/pages/Home"));
```

#### Títulos Dinâmicos

O header exibe o título da rota atual via `routeTitles` mapping em `AppSidebar.tsx`:

```tsx
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/settings": "Settings",
  "/data-library": "Data Library",
};
```

### HTTP Client

#### Configuração

```tsx
// src/services/httpClient.ts
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

#### Uso em Services

```tsx
// Padrão de Service Class
export class UserService {
  static async getUsers() {
    const { data } = await httpClient.get<User[]>('/users');
    return data;
  }
}
```

### UI Components

#### shadcn/ui

Componentes instalados em `src/components/ui/`:
- **Forms**: Input, Textarea, Select, Checkbox, Label
- **Feedback**: Alert Dialog, Tooltip, Skeleton
- **Layout**: Card, Separator, Tabs, Sheet, Sidebar
- **Navigation**: Dropdown Menu, Drawer
- **Data**: Table, Chart
- **Misc**: Avatar, Badge, Button, Toggle

#### Instalando Novos Componentes

```bash
npx shadcn@latest add <component-name>

# Exemplo
npx shadcn@latest add dialog
npx shadcn@latest add calendar
```

#### Utilitário cn()

Para merge de classes Tailwind:

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class")} />
```

## Guia de Desenvolvimento

### Adicionando Nova Página

1. **Criar o componente da página**:
```tsx
// src/pages/Products.tsx
export default function Products() {
  return <div>Products Page</div>;
}
```

2. **Adicionar lazy import no router**:
```tsx
// src/router/index.tsx
const Products = lazy(() => import("@/pages/Products"));
```

3. **Adicionar a rota**:
```tsx
<Route element={<AuthGuard isPrivate />}>
  <Route path="/products" element={<Products />} />
</Route>
```

4. **Adicionar título da rota**:
```tsx
// src/components/AppSidebar.tsx
const routeTitles: Record<string, string> = {
  // ...
  "/products": "Products",
};
```

5. **Adicionar no menu (opcional)**:
```tsx
// src/components/AppSidebar.tsx - AppSidebar function
const navMain = [
  { title: "Dashboard", url: "/" },
  { title: "Products", url: "/products" }, // novo
];
```

### Criando um Service de API

```tsx
// src/services/ProductService.ts
import { httpClient } from "./httpClient";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CreateProductDTO {
  name: string;
  price: number;
}

export class ProductService {
  static async getProducts() {
    const { data } = await httpClient.get<Product[]>('/products');
    return data;
  }

  static async getProduct(id: string) {
    const { data } = await httpClient.get<Product>(`/products/${id}`);
    return data;
  }

  static async createProduct(body: CreateProductDTO) {
    const { data } = await httpClient.post<Product>('/products', body);
    return data;
  }

  static async deleteProduct(id: string) {
    await httpClient.delete(`/products/${id}`);
  }
}
```

### Usando TanStack Query

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { ProductService } from '@/services/ProductService';
import { queryClient } from '@/lib/queryClient';

function ProductList() {
  // Fetch data
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: ProductService.getProducts,
  });

  // Mutation
  const { mutate: deleteProduct } = useMutation({
    mutationFn: ProductService.deleteProduct,
    onSuccess: () => {
      // Invalidar cache para refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          {product.name}
          <button onClick={() => deleteProduct(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Formulários com React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

## Path Aliases

O projeto está configurado com alias `@/` para a pasta `src/`:

```tsx
// ✅ Correto
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { ProductService } from "@/services/ProductService"

// ❌ Evite
import { Button } from "../../components/ui/button"
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL base da API
VITE_API_URL=http://localhost:3000/api
```

**Importante**:
- Prefixe variáveis com `VITE_` para exposição no client
- Acesse com `import.meta.env.VITE_VARIABLE_NAME`
- Nunca commite `.env` com dados sensíveis

## ESLint

Configuração flat config moderna em `eslint.config.js`:

```bash
# Executar linting
pnpm lint

# O ESLint verificará automaticamente:
# - Regras TypeScript
# - React Hooks
# - React Refresh (permite export de 'loader' para React Router)
```

## Boas Práticas

### TypeScript

- ✅ Use tipos explícitos para props e DTOs
- ✅ Defina interfaces para responses de API
- ✅ Aproveite type inference do TypeScript
- ❌ Evite `any` - use `unknown` quando necessário

### Componentes

- ✅ Use componentes funcionais com hooks
- ✅ Mantenha componentes pequenos e focados
- ✅ Extraia lógica complexa para custom hooks
- ✅ Use `memo()` apenas quando necessário (após profiling)

### Estado

- ✅ Use TanStack Query para estado servidor (API data)
- ✅ Use Context API para estado global de UI/Auth
- ✅ Use `useState` para estado local de componente
- ❌ Não coloque dados de API no Context (use TanStack Query)

### Imports

- ✅ Use path alias `@/` para imports
- ✅ Agrupe imports: externos → internos → tipos
- ✅ Use named exports para componentes

### Styling

- ✅ Use Tailwind classes diretamente
- ✅ Use `cn()` para merge condicional de classes
- ✅ Siga a convenção mobile-first do Tailwind
- ❌ Evite inline styles (`style={{}}`)

## Troubleshooting

### Erro de CORS

Configure CORS no backend ou use proxy do Vite:

```ts
// vite.config.ts
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Tokens não sendo enviados

Verifique se:
1. `AuthProvider` está acima do `BrowserRouter` em `App.tsx`
2. Tokens estão salvos no localStorage (inspecione no DevTools)
3. Request interceptor está configurado no `AuthContext.tsx`

### Rotas não funcionando

1. Verifique se a rota está definida em `src/router/index.tsx`
2. Confirme se o `AuthGuard` está configurado corretamente
3. Para produção, configure o servidor para SPA (todas rotas → index.html)

### Build falhando

```bash
# Limpe cache e reinstale dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Execute o TypeScript check
pnpm exec tsc --noEmit
```

## Licença

MIT

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ usando React, TypeScript e Vite
