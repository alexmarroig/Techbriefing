import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import axios from "axios";

// Read existing credentials
const credsPath = path.join(process.cwd(), "credentials.json");
if (!fs.existsSync(credsPath)) {
  console.error("Erro: credentials.json não encontrado. Rode o servidor MCP primeiro para gerar o template.");
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));

if (creds.clientId.includes("COLE_SEU") || creds.clientSecret.includes("COLE_SEU")) {
  console.log("\n❌ ERRO: Você precisa preencher o 'clientId' e 'clientSecret' no arquivo credentials.json antes de rodar este script!\n");
  process.exit(1);
}

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}`;

// Construct Authorization URL
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
  `client_id=${creds.clientId}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=https://www.googleapis.com/auth/adwords` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n========================================================");
console.log("🔗 GERADOR AUTOMÁTICO DE REFRESH TOKEN");
console.log("========================================================\n");
console.log("1. Abra o link abaixo no seu navegador para fazer login e autorizar:");
console.log(`\n👉 ${authUrl}\n`);
console.log("Aguardando autorização no seu navegador (localhost:3000)...");

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === "/") {
    const code = reqUrl.query.code;
    if (code) {
      try {
        // Exchange code for tokens
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
          code: code,
          client_id: creds.clientId,
          client_secret: creds.clientSecret,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code"
        });

        const { refresh_token } = tokenResponse.data;

        if (refresh_token) {
          creds.refreshToken = refresh_token;
          fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2), "utf8");
          
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end('<h1>🎉 Sucesso!</h1><p>Seu Refresh Token foi gerado e salvo automaticamente no seu arquivo <strong>credentials.json</strong>!</p><p>Você já pode fechar esta aba e voltar para o chat.</p>');
          
          console.log("\n✅ SUCESSO! O 'refreshToken' foi obtido e salvo no seu credentials.json com segurança!");
          console.log("Agora você tem a autenticação Google 100% configurada!\n");
        } else {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end('<h1>⚠️ Atenção</h1><p>O Google não enviou o refresh_token. Remova o acesso do aplicativo na sua conta Google e tente novamente para forçar o consentimento.</p>');
          console.log("\n⚠️ Aviso: O Google não enviou o refresh_token. Tente revogar o app em sua conta Google e tente novamente.");
        }
      } catch (err) {
        const errDesc = err.response?.data?.error_description || err.message;
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>❌ Erro</h1><p>Falha ao trocar o código pelo token: ${errDesc}</p>`);
        console.error("\n❌ Erro ao obter tokens:", errDesc);
      } finally {
        server.close();
        setTimeout(() => process.exit(0), 1000);
      }
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Nenhum codigo de autorizacao encontrado.");
    }
  }
});

server.listen(PORT);
