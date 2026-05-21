import fs from "fs";
import path from "path";
import axios from "axios";

const credentialsPath = path.join(process.cwd(), "credentials.json");
const CREDENTIALS = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

async function getAccessToken() {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CREDENTIALS.clientId,
      client_secret: CREDENTIALS.clientSecret,
      refresh_token: CREDENTIALS.refreshToken,
      grant_type: "refresh_token"
    });
    return response.data.access_token;
  } catch (error) {
    throw new Error("Erro ao obter access token: " + (error.response?.data?.error_description || error.message));
  }
}

async function test() {
  console.log("Iniciando teste de conexão com Google Ads...");
  try {
    const token = await getAccessToken();
    console.log("✅ OAuth2 Access Token obtido com sucesso!");

    const customerId = CREDENTIALS.customerId.replace(/-/g, "");
    const headers = {
      "Authorization": `Bearer ${token}`,
      "developer-token": CREDENTIALS.developerToken,
      "Content-Type": "application/json"
    };

    if (CREDENTIALS.loginCustomerId) {
      headers["login-customer-id"] = CREDENTIALS.loginCustomerId.replace(/-/g, "");
    }

    const query = `
      SELECT 
        campaign.id, 
        campaign.name, 
        campaign.status, 
        campaign_budget.amount_micros 
      FROM campaign 
      WHERE campaign.status IN ('ENABLED', 'PAUSED')
      LIMIT 10
    `;

    console.log("Enviando consulta GAQL para listar campanhas...");
    const url = `https://googleads.googleapis.com/v20/customers/${customerId}/googleAds:search`;
    const response = await axios.post(url, { query }, { headers });

    console.log("\n==============================================");
    console.log("🎉 CONEXÃO ESTABELECIDA COM SUCESSO!");
    console.log("==============================================\n");
    console.log("Campanhas Encontradas:");
    const results = response.data.results || [];
    if (results.length === 0) {
      console.log("Nenhuma campanha ativa ou pausada encontrada na conta.");
    } else {
      results.forEach(r => {
        const budget = parseFloat((r.campaignBudget.amountMicros / 1000000).toFixed(2));
        console.log(`- 📋 [ID: ${r.campaign.id}] Nome: "${r.campaign.name}" | Status: ${r.campaign.status} | Orçamento: R$ ${budget}/dia`);
      });
    }
  } catch (err) {
    console.error("\n❌ ERRO NO TESTE DE CONEXÃO:");
    if (err.response?.data) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

test();
