// Dynamic route executing on Vercel Serverless Functions
export const prerender = false;

import fs from "fs";
import path from "path";

/**
 * Endpoint POST /api/telemetry
 * Recebe micro-interações do cliente e registra com segurança
 */
export async function POST({ request }) {
  try {
    const data = await request.json();

    // Adiciona metadados do servidor
    data.userAgent = request.headers.get("user-agent") || "Unknown";
    
    // Captura IP simplificado (removendo sensibilidade)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    data.ip = ip.split(",")[0].trim();

    // 1. Registra no console de execução (Disponível em tempo real na Vercel e terminal)
    console.log("[TELEMETRY]", JSON.stringify(data));

    // 2. Em ambiente Local (Desenvolvimento), salva no arquivo seguro telemetry-logs.json
    const isDev = import.meta.env.DEV || process.env.NODE_ENV === "development";
    if (isDev) {
      const logDir = path.join(process.cwd(), "mcp-google-ads");
      const logFile = path.join(logDir, "telemetry-logs.json");

      let logs = [];
      if (fs.existsSync(logFile)) {
        try {
          const raw = fs.readFileSync(logFile, "utf8");
          logs = JSON.parse(raw);
        } catch (e) {
          logs = [];
        }
      }

      logs.push(data);

      // Limita em 5000 eventos para não pesar o disco local
      if (logs.length > 5000) {
        logs = logs.slice(logs.length - 5000);
      }

      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), "utf8");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("[TELEMETRY_ERROR]", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
