// optimize-cro.js - Motor offline de Inteligência de Conversão (CRO)
// Lê telemetry-logs.json e gera um relatório estatístico de comportamento de tráfego pago.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.join(__dirname, "telemetry-logs.json");

console.log("\n========================================================");
console.log("📊 MOTOR DE INTELIGÊNCIA CRO — TECH BRIEFING");
console.log("========================================================\n");

if (!fs.existsSync(logFile)) {
  console.log("❌ NENHUM DADO DE TELEMETRIA COLHIDO AINDA!");
  console.log("--------------------------------------------------------");
  console.log("A telemetria local está pronta para escutar.");
  console.log("Para gerar os primeiros dados de teste:");
  console.log("1. Rode o site localmente com: npm run dev");
  console.log("2. Abra o navegador, faça scrolls, dê cliques rápidos (rage) e cliques mortos nas páginas.");
  console.log("3. Feche a aba para enviar o tempo de tela.");
  console.log("4. Execute: node optimize-cro.js novamente!\n");
  process.exit(0);
}

try {
  const raw = fs.readFileSync(logFile, "utf8");
  const logs = JSON.parse(raw);

  if (!Array.isArray(logs) || logs.length === 0) {
    console.log("⚠️ Arquivo telemetry-logs.json está vazio.");
    process.exit(0);
  }

  // Agregações de Métricas
  const pageViewsByUrl = {};
  const scrollMilestones = {};
  const deadClicks = {};
  const rageClicks = {};
  const timeSpentByUrl = {};
  const purchaseIntent = {};

  let totalEvents = logs.length;
  const uniqueUsers = new Set();

  logs.forEach(log => {
    const { eventType, pageUrl, details, ip, userAgent } = log;
    
    // Identificador único aproximado do visitante
    const userId = `${ip}_${userAgent.substring(0, 100)}`;
    uniqueUsers.add(userId);

    // Contagem por página
    if (!pageViewsByUrl[pageUrl]) {
      pageViewsByUrl[pageUrl] = new Set();
    }
    // Tratamos time_on_page como encerramento de sessão, e outros eventos como pageviews ativos
    pageViewsByUrl[pageUrl].add(userId);

    // 1. Scroll Depth
    if (eventType === "scroll_depth") {
      const milestone = details.milestone;
      if (!scrollMilestones[pageUrl]) scrollMilestones[pageUrl] = { 25: 0, 50: 0, 75: 0, 100: 0 };
      scrollMilestones[pageUrl][milestone]++;
    }

    // 2. Dead Clicks
    if (eventType === "dead_click") {
      const key = `[${details.tag}] ${details.selector} (Texto: "${details.text || 'Imagem'}")`;
      if (!deadClicks[pageUrl]) deadClicks[pageUrl] = {};
      deadClicks[pageUrl][key] = (deadClicks[pageUrl][key] || 0) + 1;
    }

    // 3. Rage Clicks
    if (eventType === "rage_click") {
      const key = `${details.selector} (Texto: "${details.text || 'Sem texto'}")`;
      if (!rageClicks[pageUrl]) rageClicks[pageUrl] = {};
      rageClicks[pageUrl][key] = (rageClicks[pageUrl][key] || 0) + 1;
    }

    // 4. Time spent
    if (eventType === "time_on_page") {
      if (!timeSpentByUrl[pageUrl]) timeSpentByUrl[pageUrl] = [];
      timeSpentByUrl[pageUrl].push(details.durationSeconds);
    }

    // 5. Purchase Intent (Cliques no botão Kiwify)
    if (eventType === "purchase_intent") {
      if (!purchaseIntent[pageUrl]) purchaseIntent[pageUrl] = 0;
      purchaseIntent[pageUrl]++;
    }
  });

  console.log(`📈 Eventos Processados: ${totalEvents}`);
  console.log(`👤 Visitantes Únicos Rastreados: ${uniqueUsers.size}`);
  console.log("--------------------------------------------------------\n");

  // Relatório por Página
  Object.keys(pageViewsByUrl).forEach(page => {
    const visits = pageViewsByUrl[page].size;
    const times = timeSpentByUrl[page] || [];
    const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    const purchases = purchaseIntent[page] || 0;
    const conversionRate = visits > 0 ? ((purchases / visits) * 100).toFixed(2) : "0.00";

    console.log(`📄 PÁGINA: ${page}`);
    console.log(`   └─ Visitas Únicas: ${visits}`);
    console.log(`   └─ Tempo Médio na Página: ${avgTime}s`);
    console.log(`   └─ Cliques de Checkout (Intenções de Compra): ${purchases}`);
    console.log(`   └─ Taxa de Conversão de Cliques: ${conversionRate}%`);
    console.log("");

    // Exibe Funil de Scroll
    const scrolls = scrollMilestones[page];
    if (scrolls) {
      console.log(`   📊 FUNIL DE ROLAGEM (SCROLL DEPTH):`);
      const getScrollPercent = (count) => visits > 0 ? Math.round((count / visits) * 100) : 0;
      console.log(`      [25%]  ████████████████████  ${getScrollPercent(scrolls[25])}% (${scrolls[25]} pessoas)`);
      console.log(`      [50%]  ██████████████        ${getScrollPercent(scrolls[50])}% (${scrolls[50]} pessoas)`);
      console.log(`      [75%]  ██████████            ${getScrollPercent(scrolls[75])}% (${scrolls[75]} pessoas)`);
      console.log(`      [100%] ████                  ${getScrollPercent(scrolls[100])}% (${scrolls[100]} pessoas)`);
      console.log("");
    }

    // Exibe Rage Clicks (se existirem)
    const pageRage = rageClicks[page];
    if (pageRage && Object.keys(pageRage).length > 0) {
      console.log(`   🔥 CLIQUES DE RAIVA (RAGE CLICKS) DETECTADOS:`);
      Object.entries(pageRage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([el, count]) => {
          console.log(`      ⚠️ ${count}x - Elemento: ${el}`);
        });
      console.log("");
    }

    // Exibe Dead Clicks (se existirem)
    const pageDead = deadClicks[page];
    if (pageDead && Object.keys(pageDead).length > 0) {
      console.log(`   💀 CLIQUES MORTOS (DEAD CLICKS) DETECTADOS:`);
      Object.entries(pageDead)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([el, count]) => {
          console.log(`      ⚠️ ${count}x - Elemento: ${el}`);
        });
      console.log("");
    }

    console.log("--------------------------------------------------------\n");
  });

  // Recomendações Automáticas de Conversão (CRO)
  console.log("🤖 RECOMENDAÇÕES DA IA DO GOOGLE ADS & CRO:");
  console.log("========================================================");

  let recommendationsCount = 0;
  Object.keys(pageViewsByUrl).forEach(page => {
    const visits = pageViewsByUrl[page].size;
    
    // Regra 1: Abandono de Scroll
    const scrolls = scrollMilestones[page];
    if (scrolls && visits >= 5) {
      const scroll50Percent = (scrolls[50] / visits) * 100;
      if (scroll50Percent < 45) {
        recommendationsCount++;
        console.log(`👉 [Página: ${page}] ABANDONO DE TELA PRECOCE:`);
        console.log(`   Menos de 45% dos usuários (${scroll50Percent.toFixed(0)}%) chegam na metade da página.`);
        console.log(`   💡 Ação recomendada: Suba o botão de checkout principal e resuma os benefícios logo na primeira dobra!`);
        console.log("");
      }
    }

    // Regra 2: Rage Clicks altos
    const pageRage = rageClicks[page];
    if (pageRage && Object.keys(pageRage).length > 0) {
      recommendationsCount++;
      const topRage = Object.entries(pageRage)[0];
      console.log(`👉 [Página: ${page}] ERRO DE INTERAÇÃO (RAGE CLICK):`);
      console.log(`   Usuários clicando repetidamente no elemento: ${topRage[0]}`);
      console.log(`   💡 Ação recomendada: Verifique se este elemento possui aparência de botão. Sugerimos transformá-lo em um link de checkout.`);
      console.log("");
    }

    // Regra 3: Cliques Mortos persistentes
    const pageDead = deadClicks[page];
    if (pageDead && Object.keys(pageDead).length > 0) {
      const topDead = Object.entries(pageDead)[0];
      if (topDead[1] >= 5) {
        recommendationsCount++;
        console.log(`👉 [Página: ${page}] CLIQUES SEM RESPOSTA (DEAD CLICKS):`);
        console.log(`   Muitos cliques (${topDead[1]}x) no elemento estático: ${topDead[0]}`);
        console.log(`   💡 Ação recomendada: Remova o efeito de hover, bordas com cara de link ou mude o estilo desse elemento para que ele pareça texto comum.`);
        console.log("");
      }
    }
  });

  if (recommendationsCount === 0) {
    console.log("✅ Excelente! Nenhum ponto de frição severo ou anomalia comportamental foi detectado ainda.");
    console.log("Continue acumulando cliques das campanhas do Google Ads!");
  }
  console.log("========================================================\n");

} catch (err) {
  console.error("❌ Erro ao analisar os logs de telemetria:", err.message);
}
