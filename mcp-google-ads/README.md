# Servidor MCP Google Ads — Guia de Configuração e Uso 🚀

Este é um servidor completo que implementa o padrão **MCP (Model Context Protocol)** para gerenciar e otimizar suas campanhas de Google Ads diretamente através de assistentes de IA (Cursor, VS Code, Claude Desktop, etc.).

---

## 🛠️ Passo a Passo para Obter suas Credenciais da API do Google

Para conectar a IA com sua conta de anúncios, você precisará de 5 chaves. Siga o roteiro abaixo para obtê-las em menos de 10 minutos:

### 1. Developer Token (Token de Desenvolvedor)
O Google Ads exige um Token de Desenvolvedor para autorizar chamadas de API.
1. Acesse sua conta de **Administrador do Google Ads (MCC)**. *(Se não tiver uma conta Admin/MCC, crie uma gratuitamente em [ads.google.com/home/tools/manager-accounts](https://ads.google.com/home/tools/manager-accounts)).*
2. Vá em **Ferramentas e Configurações ➡️ Central de APIs** (API Center).
3. Preencha as informações básicas do seu negócio e solicite um token. 
4. O Google gerará um token imediatamente. Ele começará no nível **Test** (perfeito para testes) ou você pode usá-lo após a aprovação básica em produção. Copy-paste na chave `developerToken`.

### 2. Client ID e Client Secret (Credenciais OAuth2)
1. Acesse o **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com)).
2. Crie um novo projeto chamado `MCP Google Ads`.
3. No menu lateral, acesse **APIs e Serviços ➡️ Biblioteca** (API Library). Procure por **Google Ads API** e clique em **Ativar** (Enable).
4. Vá em **Tela de Consentimento OAuth** (OAuth Consent Screen):
   *   Escolha **Externo** (External).
   *   Preencha os e-mails de suporte básicos e salve.
   *   Em **Escopos** (Scopes), adicione o escopo `.../auth/adwords` (Google Ads API).
5. Vá em **Credenciais** (Credentials) ➡️ **Criar Credenciais** ➡️ **ID do cliente OAuth** (OAuth Client ID):
   *   Selecione o Tipo de Aplicativo: **Aplicativo da Web** (Web Application).
   *   Adicione o nome `OAuth Playground`.
   *   No campo **URIs de redirecionamento autorizados**, adicione exatamente este link: 
       👉 `https://developers.google.com/oauthplayground`
   *   Clique em **Criar** e copie seu **Client ID** e **Client Secret**.

### 3. Refresh Token (Token de Longa Duração)
1. Acesse o **Google OAuth Playground** ([developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)).
2. No canto superior direito, clique no **ícone de engrenagem** (OAuth 2.0 Configuration):
   *   Marque a caixinha **Use your own OAuth credentials** (Usar minhas próprias credenciais).
   *   Cole seu **Client ID** e **Client Secret** obtidos no passo anterior.
   *   Clique em **Close**.
3. No **Passo 1 (Select & authorize APIs)**, role até a lista ou cole o seguinte link no campo de busca:
   👉 `https://www.googleapis.com/auth/adwords`
   *   Clique no botão **Authorize APIs** (Autorizar APIs).
4. Faça login com a conta do Google do seu Google Ads e clique em **Permitir** (Allow).
5. No **Passo 2**, clique no botão azul **Exchange authorization code for tokens** (Trocar código de autorização por tokens).
6. O campo **Refresh Token** será preenchido na lateral esquerda. Copie e cole na chave `refreshToken`.

### 4. Customer ID (ID da Conta de Anúncios)
1. Abra o painel do seu Google Ads.
2. No canto superior direito, você verá o ID numérico da sua conta de 10 dígitos (ex: `123-456-7890`).
3. Remova os hifens e cole na chave `customerId` (ex: `1234567890`).

---

## 💾 Onde Salvar as Credenciais
Abra o arquivo [credentials.json](file:///c:/Users/gaming/tech-briefing/mcp-google-ads/credentials.json) e substitua as chaves pelos seus valores reais:

```json
{
  "developerToken": "SEU_TOKEN_AQUI",
  "clientId": "SEU_CLIENT_ID_AQUI.apps.googleusercontent.com",
  "clientSecret": "SEU_CLIENT_SECRET_AQUI",
  "refreshToken": "SEU_REFRESH_TOKEN_AQUI",
  "customerId": "SEU_CUSTOMER_ID_SEM_HIFENS"
}
```

---

## 🔌 Como Integrar a IA ao Servidor MCP

### Opção A: Cursor
Se você utiliza o **Cursor** para programar, siga estes passos para ativar as ferramentas de IA:
1. Abra as **Configurações do Cursor** (ícone de engrenagem no topo direito do app).
2. Vá na aba **Features** ➡️ **MCP**.
3. Clique em **+ Add New MCP Server**:
   *   **Name:** `google-ads`
   *   **Type:** `command`
   *   **Command:** `node c:/Users/gaming/tech-briefing/mcp-google-ads/index.js`
4. Clique em **Save**. O indicador deve ficar verde (Active). 
5. Agora eu tenho superpoderes de Google Ads no seu chat do Cursor!

### Opção B: Claude Desktop
Se você usa o aplicativo oficial do Claude Desktop no Windows:
1. Abra o arquivo de configuração do Claude em `%APPDATA%/Claude/claude_desktop_config.json`.
2. Adicione o servidor em `mcpServers`:

```json
{
  "mcpServers": {
    "google-ads": {
      "command": "node",
      "args": ["c:/Users/gaming/tech-briefing/mcp-google-ads/index.js"]
    }
  }
}
```
3. Reinicie o Claude Desktop.

---

## ⚡ Comandos Disponíveis para a IA
Assim que estiver ativo, eu poderei usar ferramentas como:
*   `ads_list_campaigns`: Lista suas campanhas e orçamentos ativos.
*   `ads_get_campaign_performance`: Traz gastos, cliques, CTR, conversões e custo por venda em tempo real.
*   `ads_toggle_campaign`: Pausa ou ativa campanhas inteiras instantaneamente.
*   `ads_update_budget`: Ajusta o orçamento diário das campanhas direto pelo chat.
