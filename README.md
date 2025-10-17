# 🚗 LavaCar - Sistema de Gerenciamento de Lava-Car

> **Sistema moderno e completo para gerenciamento de lava-car**, desenvolvido em **Angular 19** com **IndexedDB**. Gerencie clientes, funcionários, agendamentos, produtos, fornecedores e serviços com uma interface intuitiva e responsiva.

---

## 📊 Índice

1. [Visão Geral](#visão-geral)
2. [Recursos Principais](#recursos-principais)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação](#instalação)
6. [Como Usar](#como-usar)
7. [Estrutura do Projeto](#estrutura-do-projeto)
8. [Arquitetura](#arquitetura)
9. [Modelos de Dados](#modelos-de-dados)
10. [Serviços](#serviços)
11. [Contribuindo](#contribuindo)
12. [Licença](#licença)

---

## 🎯 Visão Geral

O **LavaCar** é uma aplicação web progressiva (PWA) desenvolvida para simplificar o gerenciamento completo de um lava-car. Com foco em usabilidade e eficiência, permite:

- ✅ **Gerenciar Clientes**: Cadastro, edição e acompanhamento de clientes
- ✅ **Controlar Agendamentos**: Sistema completo com validação de conflitos
- ✅ **Administrar Funcionários**: Gestão de equipe e atribuição de serviços
- ✅ **Gerenciar Serviços**: Criar e associar produtos aos serviços
- ✅ **Controlar Produtos**: Estoque e fornecedores integrados
- ✅ **Offline-First**: Funciona sem internet com sincronização automática

---

## ✨ Recursos Principais

| Recurso | Descrição |
|---------|-----------|
| 🗓️ **Agendamentos** | Sistema completo com calendário, validação de horários e status em tempo real |
| 👥 **Clientes** | Cadastro com foto, telefone, email e histórico de agendamentos |
| 👨‍💼 **Funcionários** | Gerenciamento de equipe com função e data de admissão |
| 🔧 **Serviços** | Criação de serviços com preço e produtos associados |
| 📦 **Produtos** | Controle de estoque com fornecedores e preços |
| 🤝 **Fornecedores** | Gestão de parceiros e seus produtos |
| 📱 **Responsive** | Funciona perfeitamente em desktop, tablet e mobile |
| 🌙 **Temas** | Suporte a tema claro e escuro |
| 📴 **Offline** | Funciona completamente offline com IndexedDB |

---

## 📚 Stack Tecnológico

### Frontend
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| **Angular** | 19.1.0 | Framework principal |
| **TypeScript** | 5.7.2 | Linguagem de desenvolvimento |
| **Bootstrap** | 5.3.8 | Styling e componentes UI |
| **Bootstrap Icons** | 1.13.1 | Ícones da interface |

### Bibliotecas
| Biblioteca | Versão | Função |
|-----------|--------|--------|
| **Dexie** | 4.2.0 | Wrapper do IndexedDB |
| **SweetAlert2** | 11.23.0 | Alertas e confirmações |
| **Angular CDK** | 19.1.0 | Drag & Drop e utilities |
| **RxJS** | 7.8.0 | Programação reativa |

### Ferramentas
| Ferramenta | Função |
|-----------|--------|
| **Angular CLI** | 19.1.7 | Ferramentas de build |
| **Karma** | Testes unitários |
| **Jasmine** | Framework de testes |

---

## 📋 Pré-requisitos

Antes de começar, verifique se você tem instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (instalado com Node.js)
- **Git** ([Download](https://git-scm.com/))

### Verificar Instalação

```bash
node --version    # v18.0.0 ou superior
npm --version     # 9.0.0 ou superior
git --version     # git version 2.x.x
```

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/ericdalaporta/lavacar-project.git
cd lavacar-project
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

A aplicação estará disponível em: **http://localhost:4200**

### 4. (Opcional) Build para Produção

```bash
npm run build
```

Os arquivos compilados serão gerados em `dist/lavacar-project/`

---

## 💻 Como Usar

### Primeira Execução

1. Abra http://localhost:4200
2. Você verá a **página inicial (Home)** com um painel de navegação
3. Clique no menu para acessar as diferentes seções

### Fluxo Principal

#### 1️⃣ Cadastrar Cliente
- Vá para: **Clientes → Novo Cliente**
- Preencha: Nome, Telefone, Email, Endereço
- Faça upload de uma foto (opcional)
- Clique em **Salvar**

#### 2️⃣ Cadastrar Funcionário
- Vá para: **Funcionários → Novo Funcionário**
- Preencha: Nome, Telefone, Email, Função
- Clique em **Salvar**

#### 3️⃣ Criar Serviço
- Vá para: **Serviços → Novo Serviço**
- Preencha: Nome, Descrição, Preço
- Associe produtos necessários (drag & drop)
- Clique em **Salvar**

#### 4️⃣ Criar Agendamento
- Vá para: **Agendamentos → Novo Agendamento**
- Selecione: Cliente, Funcionário, Serviço, Data e Hora
- Adicione observações (opcional)
- Clique em **Salvar**

#### 5️⃣ Gerenciar Agendamentos
- Vá para: **Agendamentos → Listar**
- Use **drag & drop** para reordenar agendamentos
- Altere status (Pendente → Confirmado → Concluído)
- Filtre por data ou cliente

---

## 📁 Estrutura do Projeto

```
lavacar-project/
├── src/
│   ├── app/
│   │   ├── features/                    # 🎯 Módulos principais
│   │   │   ├── clientes/
│   │   │   │   ├── cadastro-cliente/
│   │   │   │   ├── listar-clientes/
│   │   │   │   └── services/
│   │   │   │       └── cliente.service.ts
│   │   │   │
│   │   │   ├── funcionarios/
│   │   │   │   ├── cadastro-funcionario/
│   │   │   │   ├── listar-funcionarios/
│   │   │   │   └── services/
│   │   │   │       └── funcionario.service.ts
│   │   │   │
│   │   │   ├── agendamentos/
│   │   │   │   ├── cadastro-agendamento/
│   │   │   │   ├── listar-agendamentos/
│   │   │   │   └── services/
│   │   │   │       └── agendamento.service.ts
│   │   │   │
│   │   │   └── servicos/
│   │   │       ├── listar-servicos/
│   │   │       └── servicos.module.ts
│   │   │
│   │   ├── components/                  # 🎨 Componentes secundários
│   │   │   ├── fornecedores/
│   │   │   │   ├── cadastro-fornecedor/
│   │   │   │   ├── listar-fornecedor/
│   │   │   │   └── listar-produtos-fornecedor/
│   │   │   │
│   │   │   ├── produtos/
│   │   │   │   ├── cadastro-produto/
│   │   │   │   └── listar-produtos/
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── cadastro-servico/
│   │   │   │   └── listar-servico/
│   │   │   │
│   │   │   ├── header/
│   │   │   ├── home/
│   │   │   └── servicos/
│   │   │       └── associacao-produtos-servico/
│   │   │
│   │   ├── models/                      # 📦 Modelos de dados
│   │   │   ├── pessoa.model.ts
│   │   │   ├── cliente.model.ts
│   │   │   ├── funcionario.model.ts
│   │   │   ├── fornecedor.model.ts
│   │   │   ├── produto.model.ts
│   │   │   ├── servico.model.ts
│   │   │   ├── agendamento.model.ts
│   │   │   └── produto-servico.model.ts
│   │   │
│   │   ├── services/                    # 🔧 Serviços compartilhados
│   │   │   ├── db.service.ts            # IndexedDB
│   │   │   ├── produto.service.ts
│   │   │   ├── fornecedor.service.ts
│   │   │   ├── servico.service.ts
│   │   │   └── produto-servico.service.ts
│   │   │
│   │   ├── shared/                      # 🌐 Recursos compartilhados
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── header/
│   │   │   │   │   └── footer/
│   │   │   │   └── list-header/
│   │   │   └── services/
│   │   │       ├── mensagens.service.ts # Alertas SweetAlert2
│   │   │       └── theme.service.ts     # Gerenciador de temas
│   │   │
│   │   ├── core/
│   │   │   └── services/
│   │   │       └── indexed-db.service.ts
│   │   │
│   │   ├── app.routes.ts                # Rotas da aplicação
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.config.ts
│   │   └── app.component.css
│   │
│   ├── assets/                          # 📸 Imagens e recursos
│   │   └── img/
│   │       ├── demo-readme.gif
│   │       ├── avatar-cliente.svg
│   │       └── ...
│   │
│   ├── index.html
│   ├── main.ts
│   ├── styles.css                       # Estilos globais
│   └── ...
│
├── public/
├── angular.json                         # Configuração Angular
├── tsconfig.json                        # Configuração TypeScript
├── package.json
├── package-lock.json
└── README.md
```

---

## 🏗️ Arquitetura

### Padrão de Desenvolvimento

O projeto segue a **arquitetura em camadas** com **componentes standalone**:

```
┌─────────────────────────────────────┐
│     INTERFACE (Components)          │
├─────────────────────────────────────┤
│     LÓGICA (Services)               │
├─────────────────────────────────────┤
│     DADOS (Models + IndexedDB)      │
└─────────────────────────────────────┘
```

### Fluxo de Dados

```
Componente (Template)
         ↓
   Formulário Reativo
         ↓
   Service (Validação)
         ↓
   Model (Construção)
         ↓
   IndexedDB (Persistência)
         ↓
   ✅ Sucesso / ❌ Erro
```

### Tecnologias-Chave

| Conceito | Implementação |
|----------|---------------|
| **Gerenciamento de Estado** | RxJS Subjects e Observables |
| **Validação** | Reactive Forms com Validators |
| **Armazenamento** | IndexedDB via Dexie |
| **Alertas** | SweetAlert2 |
| **UI Interactions** | Angular CDK Drag & Drop |

---

## 📦 Modelos de Dados

### Pessoa (Base)
```typescript
class Pessoa {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  dataRegistro?: Date;
}
```

### Cliente
```typescript
class Cliente extends Pessoa {
  cpf: string;
  endereco: string;
  cidade: string;
  foto?: string;
}
```

### Funcionário
```typescript
class Funcionario extends Pessoa {
  matricula: string;
  funcao: string;
  dataAdmissao: Date;
}
```

### Fornecedor
```typescript
class Fornecedor {
  id?: number;
  cnpj: string;
  nomeEmpresa: string;
  contato: string;
}
```

### Produto
```typescript
class Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  fornecedorId: number;
}
```

### Serviço
```typescript
class Servico {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
}
```

### Agendamento
```typescript
class Agendamento {
  id?: number;
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  data: string;           // YYYY-MM-DD
  hora: string;          // HH:mm
  status: StatusAgendamento;
  observacoes: string;
}

type StatusAgendamento = 'Pendente' | 'Confirmado' | 'Concluído' | 'Cancelado';
```

### ProdutoServico
```typescript
class ProdutoServico {
  id?: number;
  servicoId: number;
  produtoId: number;
  quantidade: number;
}
```

---

## 🔧 Serviços

### DbService (IndexedDB)
Gerencia todas as operações do banco de dados.

```typescript
@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  fornecedores: Table<Fornecedor, number>;
  produtos: Table<Produto, number>;
  servicos: Table<Servico, number>;
  produtosServico: Table<ProdutoServico>;
  clientes: Table<Cliente, number>;
  funcionarios: Table<Funcionario, number>;
  agendamentos: Table<Agendamento, number>;
}
```

### ClienteService
```typescript
async add(cliente: Cliente): Promise<number>;
async getAll(): Promise<Cliente[]>;
async getById(id: number): Promise<Cliente | undefined>;
async update(cliente: Cliente): Promise<void>;
async delete(id: number): Promise<void>;
```

### AgendamentoService
```typescript
async adicionar(agendamento: Agendamento): Promise<number>;
async obterTodos(): Promise<Agendamento[]>;
async obterPorId(id: number): Promise<Agendamento | undefined>;
async atualizar(agendamento: Agendamento): Promise<void>;
async deletar(id: number): Promise<void>;
async verificarConflito(data: string, hora: string): Promise<boolean>;
```

### MensagensService
Gerencia alertas e notificações via SweetAlert2.

```typescript
async exibirSucesso(titulo: string, mensagem: string): Promise<void>;
async exibirErro(titulo: string, mensagem: string): Promise<void>;
async confirmarExclusao(mensagem: string): Promise<boolean>;
```

---

## 📝 Scripts NPM

```bash
npm start              # Inicia servidor de desenvolvimento (http://localhost:4200)
npm run build          # Build para produção
npm run watch          # Build em modo watch
npm test               # Executa testes unitários
npm run lint           # Verifica código (se ESLint configurado)
```

---

## 🌍 Banco de Dados (IndexedDB)

### Estrutura

O banco de dados "LavaCarDb" contém as seguintes lojas:

| Loja | Chave Primária | Índices |
|------|---|---|
| **fornecedores** | ++id | nome, cnpj, ordem |
| **produtos** | ++id | nome, fornecedorId, ordem |
| **servicos** | ++id | nome, ordem |
| **produtosServico** | [servicoId+produtoId] | servicoId, produtoId |
| **clientes** | ++id | nome, cpf |
| **funcionarios** | ++id | nome, email |
| **agendamentos** | ++id | data, clienteId, ordem |

### Inicialização

O banco é criado automaticamente na primeira execução. Os dados são persistidos no navegador do usuário.

---

## 🎨 Estilos e Tema

### CSS Global (`styles.css`)
Define as variáveis CSS principais:

```css
:root {
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  --light: #f8f9fa;
  --dark: #343a40;
  --interactive-hover: #0d6efd;
}
```

### Temas Dinâmicos
O `ThemeService` permite alternar entre temas claro e escuro:

```typescript
toggleTheme(): void {
  this.tema = this.tema === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', this.tema);
}
```

---

## 🧪 Testes

### Executar Testes Unitários

```bash
npm test
```

### Estrutura de Testes

```typescript
describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

---

## 📦 Build e Deploy

### Build para Produção

```bash
npm run build
```

### Estrutura de Saída

```
dist/lavacar-project/
├── index.html
├── main.js
├── styles.css
└── assets/
```

### Deploy no GitHub Pages

1. Faça build: `npm run build`
2. Renomeie `dist` para `docs`
3. Commit e push
4. Em Settings → Pages → Source: `/docs`

---

## 🔒 Segurança

### Dados Sensíveis
- ✅ Senhas não são armazenadas
- ✅ Dados ficam locais no navegador (IndexedDB)
- ✅ Nenhum dado é enviado para servidor
- ✅ Validação em tempo real

### Boas Práticas
- Use HTTPS em produção
- Configure CSP (Content Security Policy)
- Implemente autenticação se necessário
- Valide entrada de usuário

---

## 🐛 Troubleshooting

### A aplicação não carrega
```bash
# Limpe o cache
npm cache clean --force

# Reinstale dependências
rm -rf node_modules
npm install

# Restart o servidor
npm start
```

### IndexedDB não está funcionando
- Certifique-se que o navegador suporta IndexedDB
- Limpe dados do site (DevTools → Application → Clear storage)
- Verifique console para erros

### Agendamentos não aparecem
- Verifique se cliente, funcionário e serviço foram criados primeiro
- Confirme datas válidas
- Limpe cache do navegador

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📧 Contato

**Desenvolvedor:** Eric Dala Porta  
**Email:** ericdasilvadalaporta@gmail.com  
**GitHub:** [@ericdalaporta](https://github.com/ericdalaporta)

---

## 🙏 Agradecimentos

- [Angular](https://angular.io/) - Framework web
- [Bootstrap](https://getbootstrap.com/) - Styling
- [Dexie](https://dexie.org/) - IndexedDB wrapper
- [SweetAlert2](https://sweetalert2.github.io/) - Alertas bonitos

---

**Desenvolvido com ❤️ por Eric Dala Porta**

> "Um bom gerenciamento começa com as ferramentas certas."

**Última atualização:** Outubro 16, 2025  
**Versão:** 1.0.0
