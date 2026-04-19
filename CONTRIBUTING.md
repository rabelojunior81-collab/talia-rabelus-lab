# Contribuindo com talia.ai / Contributing to talia.ai

**[PT-BR](#português) · [EN](#english)**

---

# Português

Obrigado pelo interesse em contribuir com o **talia.ai**! Este documento define os padrões e o processo para colaborar com o projeto de forma organizada e respeitosa.

## Código de Conduta

Este projeto adota o [Contributor Covenant](./CODE_OF_CONDUCT.md). Ao participar, você concorda em seguir seus termos.

## Como Posso Contribuir?

### 🐛 Reportando Bugs

Antes de abrir uma issue de bug, por favor verifique se ela já não foi reportada nas [Issues existentes](https://github.com/rabelojunior81-collab/talia-rabelus-lab/issues).

Ao criar uma issue de bug, inclua:

- **Título claro e descritivo**
- **Passos para reproduzir** o problema
- **Comportamento esperado** vs. **comportamento observado**
- **Browser e versão** (ex: Chrome 124, Safari 17)
- **Logs de console** relevantes (sem incluir sua API Key!)
- **Screenshots** se aplicável

> ⚠️ **NUNCA** inclua sua API Key Gemini em issues, PRs ou comentários.

### 💡 Sugerindo Melhorias

Abra uma issue com o label `enhancement` e descreva:

- O problema que a melhoria resolve
- A solução proposta
- Alternativas consideradas

### 🛠️ Pull Requests

1. **Fork** o repositório
2. Crie uma **branch descritiva**: `feature/meu-novo-recurso` ou `fix/bug-descritivo`
3. Faça seus commits seguindo o padrão abaixo
4. Abra um **Pull Request** para a branch `main`

#### Padrão de Commits (Conventional Commits)

```
feat: adiciona indicador de volume do microfone
fix: corrige query Dexie para buscar últimas mensagens
docs: atualiza README com instruções de instalação
refactor: normaliza AssetCategory removendo duplicatas
chore: atualiza dependência @google/genai para ^1.47.0
```

## Padrões de Código

### Linguagem e Nomenclatura

- **TypeScript obrigatório** — sem `any` em novos tipos críticos
- **Componentes React** em PascalCase: `MeuComponente.tsx`
- **Hooks** com prefixo `use`: `useMinhaLogica.ts`
- **Serviços** em camelCase: `meuServico.ts`
- Nomes de **variáveis e funções** em inglês no código, **português** na UI e nos comentários

### Arquitetura

- Lógica de negócio pertence a **`hooks/`** ou **`services/`**, nunca diretamente em componentes
- Toda integração com a Gemini API deve passar por **`services/geminiService.ts`**
- Novos tipos de dados devem ser adicionados em **`types.ts`**
- Persistência de dados deve usar o **`db.ts`** (Dexie/IndexedDB)

### Segurança

- **Nunca** hardcode ou logue API Keys
- Todo acesso à API Key deve passar por **`services/apiKeyManager.ts`**
- Verifique [SECURITY.md](./SECURITY.md) para o processo de reporte de vulnerabilidades

## Desenvolvimento Local

```bash
git clone https://github.com/rabelojunior81-collab/talia-rabelus-lab.git
cd talia-rabelus-lab
npm install
npm run dev
```

Verifique o arquivo `docs/journal.md` para entender as decisões arquiteturais antes de fazer alterações estruturais.

---

# English

Thank you for your interest in contributing to **talia.ai**! This document defines the standards and process for collaborating on the project in an organized and respectful way.

## Code of Conduct

This project adopts the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before opening a bug issue, please check if it has already been reported in the [existing Issues](https://github.com/rabelojunior81-collab/talia-rabelus-lab/issues).

When creating a bug issue, include:

- **Clear and descriptive title**
- **Steps to reproduce** the problem
- **Expected behavior** vs. **observed behavior**
- **Browser and version** (e.g., Chrome 124, Safari 17)
- **Relevant console logs** (without your API Key!)
- **Screenshots** if applicable

> ⚠️ **NEVER** include your Gemini API Key in issues, PRs, or comments.

### 💡 Suggesting Enhancements

Open an issue with the `enhancement` label and describe:

- The problem the enhancement solves
- The proposed solution
- Alternatives considered

### 🛠️ Pull Requests

1. **Fork** the repository
2. Create a **descriptive branch**: `feature/my-new-feature` or `fix/descriptive-bug`
3. Make your commits following the pattern below
4. Open a **Pull Request** to the `main` branch

#### Commit Pattern (Conventional Commits)

```
feat: add microphone volume indicator
fix: correct Dexie query to fetch latest messages
docs: update README with installation instructions
refactor: normalize AssetCategory removing duplicates
chore: update @google/genai dependency to ^1.47.0
```

## Code Standards

### Language and Naming

- **TypeScript required** — no `any` on new critical types
- **React components** in PascalCase: `MyComponent.tsx`
- **Hooks** with `use` prefix: `useMyLogic.ts`
- **Services** in camelCase: `myService.ts`
- Variable and function **names** in English in code; **Portuguese** in UI and comments

### Architecture

- Business logic belongs in **`hooks/`** or **`services/`**, never directly in components
- All Gemini API integration must go through **`services/geminiService.ts`**
- New data types must be added to **`types.ts`**
- Data persistence must use **`db.ts`** (Dexie/IndexedDB)

### Security

- **Never** hardcode or log API Keys
- All API Key access must go through **`services/apiKeyManager.ts`**
- Check [SECURITY.md](./SECURITY.md) for vulnerability reporting

## Local Development

```bash
git clone https://github.com/rabelojunior81-collab/talia-rabelus-lab.git
cd talia-rabelus-lab
npm install
npm run dev
```

Review `docs/journal.md` to understand architectural decisions before making structural changes.
