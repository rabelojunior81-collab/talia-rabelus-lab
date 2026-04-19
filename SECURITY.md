# Política de Segurança / Security Policy

**[PT-BR](#português) · [EN](#english)**

---

# Português

## Versões Suportadas

Por se tratar de um projeto open source em desenvolvimento ativo, a segurança é mantida na branch `main`.

| Versão | Suportada |
|--------|-----------|
| `main` | ✅ Sim |

## Reportando uma Vulnerabilidade

### ⚠️ IMPORTANTE: Nunca abra uma Issue pública para vulnerabilidades de segurança.

Se você descobriu uma vulnerabilidade de segurança em talia.ai, por favor siga o processo de **responsible disclosure** (divulgação responsável):

1. **Envie um e-mail privado** diretamente ao mantenedor do projeto descrevendo:
   - Tipo de vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (opcional)

2. **Aguarde confirmação** — você receberá uma resposta em até **72 horas**

3. **Não divulgue publicamente** até que a correção seja publicada e um período razoável para atualização tenha se passado

### Vulnerabilidades Conhecidas e Mitigações

#### Armazenamento de API Key em localStorage

**Risco:** A Gemini API Key do usuário é armazenada em `localStorage`, o que a torna acessível a scripts JavaScript em execução na mesma origem.

**Mitigações em vigor:**
- O app é servido localmente (não há servidor central comprometível)
- Não há transmissão da chave para nenhum servidor que não seja `generativelanguage.googleapis.com`
- O usuário tem controle total sobre onde o app é executado

**Recomendação ao usuário:** Execute o app apenas em ambientes de desenvolvimento local confiáveis. Não use em redes públicas sem HTTPS.

#### Injeção de Conteúdo no Contexto da IA

**Risco:** Conteúdo de arquivos carregados no Stage é injetado diretamente no `systemInstruction` e nos `contents` da API. Um arquivo malicioso poderia tentar manipular o comportamento da IA (prompt injection).

**Mitigações em vigor:**
- O conteúdo é truncado a 3.000 caracteres por arquivo no contexto de voz
- A persona da Talia inclui diretivas explícitas de resistência a comportamentos não autorizados

---

# English

## Supported Versions

As an actively developed open source project, security is maintained on the `main` branch.

| Version | Supported |
|---------|-----------|
| `main`  | ✅ Yes |

## Reporting a Vulnerability

### ⚠️ IMPORTANT: Never open a public Issue for security vulnerabilities.

If you have discovered a security vulnerability in talia.ai, please follow the **responsible disclosure** process:

1. **Send a private email** directly to the project maintainer describing:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

2. **Wait for acknowledgment** — you will receive a response within **72 hours**

3. **Do not disclose publicly** until a fix has been released and a reasonable update period has passed

### Known Vulnerabilities and Mitigations

#### API Key Storage in localStorage

**Risk:** The user's Gemini API Key is stored in `localStorage`, making it accessible to JavaScript running in the same origin.

**Mitigations in place:**
- The app runs locally (there is no central compromisable server)
- The key is never transmitted to any server other than `generativelanguage.googleapis.com`
- The user has full control over where the app is executed

**User recommendation:** Run the app only in trusted local development environments. Do not use on public networks without HTTPS.

#### Content Injection into AI Context

**Risk:** Content from files uploaded to the Stage is injected directly into the API's `systemInstruction` and `contents`. A malicious file could attempt to manipulate AI behavior (prompt injection).

**Mitigations in place:**
- Content is truncated to 3,000 characters per file in the voice context
- Talia's persona includes explicit directives against unauthorized behaviors

---

*Última atualização / Last updated: 2026-04-19*
