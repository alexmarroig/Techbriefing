import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Load credentials either from environment variables or from a credentials.json file
const credentialsPath = path.join(process.cwd(), "credentials.json");
let CREDENTIALS = {
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  clientId: process.env.GOOGLE_ADS_CLIENT_ID,
  clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  customerId: process.env.GOOGLE_ADS_CUSTOMER_ID, // Formato: 1234567890 (sem hifens)
  loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID // Opcional (para contas Admin MCC)
};

if (fs.existsSync(credentialsPath)) {
  try {
    const rawData = fs.readFileSync(credentialsPath, "utf8");
    const parsed = JSON.parse(rawData);
    CREDENTIALS = { ...CREDENTIALS, ...parsed };
  } catch (err) {
    console.error("Erro ao ler credentials.json:", err.message);
  }
}

// Token Cache
let cachedAccessToken = null;
let tokenExpirationTime = 0;

/**
 * Gets a fresh Google Ads Access Token using the OAuth2 Refresh Token
 */
async function getAccessToken() {
  const now = Date.now();
  // Return cached token if it has at least 5 minutes of validity remaining
  if (cachedAccessToken && tokenExpirationTime > now + 300 * 1000) {
    return cachedAccessToken;
  }

  const { clientId, clientSecret, refreshToken } = CREDENTIALS;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Credenciais OAuth2 ausentes (client_id, client_secret ou refresh_token). Verifique credentials.json");
  }

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    });

    cachedAccessToken = response.data.access_token;
    // Expires_in is in seconds, convert to absolute timestamp
    tokenExpirationTime = now + response.data.expires_in * 1000;
    return cachedAccessToken;
  } catch (error) {
    const errorMsg = error.response?.data?.error_description || error.message;
    throw new Error(`Falha ao obter Access Token do Google: ${errorMsg}`);
  }
}

/**
 * Executes a GAQL (Google Ads Query Language) Search query
 */
async function queryGoogleAds(query) {
  const token = await getAccessToken();
  const { customerId, developerToken, loginCustomerId } = CREDENTIALS;

  if (!customerId || !developerToken) {
    throw new Error("Customer ID ou Developer Token ausentes. Verifique credentials.json");
  }

  const cleanCustomerId = customerId.replace(/-/g, "");
  const headers = {
    "Authorization": `Bearer ${token}`,
    "developer-token": developerToken,
    "Content-Type": "application/json"
  };

  if (loginCustomerId) {
    headers["login-customer-id"] = loginCustomerId.replace(/-/g, "");
  }

  const url = `https://googleads.googleapis.com/v20/customers/${cleanCustomerId}/googleAds:search`;
  
  try {
    const response = await axios.post(url, { query }, { headers });
    return response.data;
  } catch (error) {
    const detailedError = JSON.stringify(error.response?.data || error.message);
    throw new Error(`Erro na API do Google Ads: ${detailedError}`);
  }
}

/**
 * Performs a mutation (update) on Google Ads resources
 */
async function mutateGoogleAds(endpoint, operations) {
  const token = await getAccessToken();
  const { customerId, developerToken, loginCustomerId } = CREDENTIALS;

  if (!customerId || !developerToken) {
    throw new Error("Customer ID ou Developer Token ausentes. Verifique credentials.json");
  }

  const cleanCustomerId = customerId.replace(/-/g, "");
  const headers = {
    "Authorization": `Bearer ${token}`,
    "developer-token": developerToken,
    "Content-Type": "application/json"
  };

  if (loginCustomerId) {
    headers["login-customer-id"] = loginCustomerId.replace(/-/g, "");
  }

  const url = `https://googleads.googleapis.com/v20/customers/${cleanCustomerId}/${endpoint}`;
  
  try {
    const response = await axios.post(url, operations, { headers });
    return response.data;
  } catch (error) {
    const detailedError = JSON.stringify(error.response?.data || error.message);
    throw new Error(`Erro de mutação na API do Google Ads: ${detailedError}`);
  }
}

// ==========================================
// DEFINIÇÃO DO SERVIDOR MCP
// ==========================================

const server = new Server(
  {
    name: "mcp-google-ads",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ads_list_campaigns",
        description: "Lista todas as campanhas ativas e pausadas com seus IDs, status e orçamentos diários.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "ads_get_campaign_performance",
        description: "Obtém métricas em tempo real (gastos, cliques, impressões, CTR, conversões e custo por conversão) de todas as campanhas dentro de um período.",
        inputSchema: {
          type: "object",
          properties: {
            startDate: {
              type: "string",
              description: "Data inicial no formato YYYY-MM-DD (ex: 2026-05-01)"
            },
            endDate: {
              type: "string",
              description: "Data final no formato YYYY-MM-DD (ex: 2026-05-17)"
            }
          },
          required: ["startDate", "endDate"]
        }
      },
      {
        name: "ads_toggle_campaign",
        description: "Pausa ou ativa uma campanha específica.",
        inputSchema: {
          type: "object",
          properties: {
            campaignId: {
              type: "string",
              description: "ID numérico da campanha"
            },
            status: {
              type: "string",
              enum: ["ENABLED", "PAUSED"],
              description: "Novo status da campanha"
            }
          },
          required: ["campaignId", "status"]
        }
      },
      {
        name: "ads_update_budget",
        description: "Altera o orçamento diário de uma campanha.",
        inputSchema: {
          type: "object",
          properties: {
            budgetId: {
              type: "string",
              description: "ID numérico do orçamento (CampaignBudget ID)"
            },
            newDailyAmount: {
              type: "number",
              description: "Novo valor em Reais (ex: 25.50)"
            }
          },
          required: ["budgetId", "newDailyAmount"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "ads_list_campaigns": {
        const query = `
          SELECT 
            campaign.id, 
            campaign.name, 
            campaign.status, 
            campaign_budget.id,
            campaign_budget.amount_micros 
          FROM campaign 
          WHERE campaign.status IN ('ENABLED', 'PAUSED')
        `;
        const result = await queryGoogleAds(query);
        
        const campaigns = (result.results || []).map(r => ({
          id: r.campaign.id,
          name: r.campaign.name,
          status: r.campaign.status,
          budgetId: r.campaignBudget.id,
          dailyBudgetBrl: parseFloat((r.campaignBudget.amountMicros / 1000000).toFixed(2))
        }));

        return {
          content: [{
            type: "text",
            text: JSON.stringify(campaigns, null, 2)
          }]
        };
      }

      case "ads_get_campaign_performance": {
        const { startDate, endDate } = args;
        const query = `
          SELECT 
            campaign.id, 
            campaign.name, 
            metrics.cost_micros, 
            metrics.clicks, 
            metrics.impressions, 
            metrics.ctr, 
            metrics.conversions, 
            metrics.cost_per_conversion 
          FROM campaign 
          WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        `;
        const result = await queryGoogleAds(query);
        
        const performance = (result.results || []).map(r => ({
          campaignId: r.campaign.id,
          campaignName: r.campaign.name,
          spendBrl: parseFloat((r.metrics.costMicros / 1000000).toFixed(2)),
          clicks: parseInt(r.metrics.clicks || 0),
          impressions: parseInt(r.metrics.impressions || 0),
          ctrPercentage: parseFloat((r.metrics.ctr * 100).toFixed(2)),
          conversions: parseFloat(r.metrics.conversions || 0),
          costPerConversionBrl: r.metrics.costPerConversion ? parseFloat((r.metrics.costPerConversion / 1000000).toFixed(2)) : 0
        }));

        return {
          content: [{
            type: "text",
            text: JSON.stringify(performance, null, 2)
          }]
        };
      }

      case "ads_toggle_campaign": {
        const { campaignId, status } = args;
        
        const operations = {
          operations: [{
            update: {
              resourceName: `customers/${CREDENTIALS.customerId.replace(/-/g, "")}/campaigns/${campaignId}`,
              status: status
            },
            updateMask: "status"
          }]
        };

        const result = await mutateGoogleAds("campaigns:mutate", operations);
        return {
          content: [{
            type: "text",
            text: `Sucesso! Campanha ${campaignId} alterada para ${status}. Resposta: ${JSON.stringify(result)}`
          }]
        };
      }

      case "ads_update_budget": {
        const { budgetId, newDailyAmount } = args;
        
        // Google Ads API uses micros (1 BRL = 1,000,000 micros)
        const amountMicros = Math.round(newDailyAmount * 1000000);
        
        const operations = {
          operations: [{
            update: {
              resourceName: `customers/${CREDENTIALS.customerId.replace(/-/g, "")}/campaignBudgets/${budgetId}`,
              amountMicros: amountMicros
            },
            updateMask: "amount_micros"
          }]
        };

        const result = await mutateGoogleAds("campaignBudgets:mutate", operations);
        return {
          content: [{
            type: "text",
            text: `Sucesso! Orçamento ${budgetId} alterado para R$ ${newDailyAmount}. Resposta: ${JSON.stringify(result)}`
          }]
        };
      }

      default:
        throw new Error(`Ferramenta desconhecida: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Erro ao executar ferramenta ${name}: ${error.message}`
      }],
      isError: true
    };
  }
});

// Run server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Servidor Google Ads MCP rodando com transporte stdio!");
