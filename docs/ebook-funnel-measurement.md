# Medição do funil do ebook

## O que os dados atuais mostram

- GA4 registrou `41` eventos `begin_checkout` de `14` usuários.
- A Kiwify exportou `2` carrinhos abandonados em `12/05/2026`, por volta de `22:39` e `22:40`.
- O problema mais provável está depois do clique no checkout: confiança, método de pagamento, fricção no checkout ou oferta.

## Eventos do site

A landing `/ebook-agentes-ia/` dispara:

- `ebook_page_view`: visita qualificada na landing do ebook.
- `ebook_cta_click`: clique em um botão de compra.
- `begin_checkout`: saída para o checkout da Kiwify.

Todos os eventos incluem:

- `site_name: tech_briefing`
- `funnel_name: ebook_agentes_ia`
- `page_type: ebook_landing`
- `page_path`
- `page_location`
- `page_title`

O link da Kiwify preserva automaticamente:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `gbraid`
- `wbraid`

## Microsoft Clarity via GTM

1. Acesse `https://clarity.microsoft.com/`.
2. Crie um projeto para `www.techbriefing.com.br`.
3. Copie o script de instalação do Clarity.
4. No Google Tag Manager `GTM-KJHRR82Q`, vá em `Tags > Nova`.
5. Tipo da tag: `HTML personalizado`.
6. Cole o script do Clarity.
7. Acionador: `All Pages`.
8. Salve, clique em `Visualizar` e teste `https://www.techbriefing.com.br/ebook-agentes-ia/`.
9. Se o Clarity aparecer no Tag Assistant, clique em `Enviar` para publicar.

## GTM recomendado

Criar acionadores de evento personalizado:

- `ebook_page_view`
- `ebook_cta_click`
- `begin_checkout`

Usar esses acionadores para tags GA4 Event. A conversão de compra do Google Ads deve disparar na Kiwify ou página de obrigado, não no clique da landing.

## GA4 recomendado

Separar Tech Briefing e Ethos em propriedades ou fluxos diferentes. No Tech Briefing, marcar como eventos importantes:

- `ebook_cta_click`
- `begin_checkout`
- `purchase`

Criar dimensões personalizadas:

- `site_name`
- `funnel_name`
- `page_type`
- `cta_id`
- `checkout_provider`

## Kiwify

Monitorar:

- visitas ao checkout;
- carrinhos abandonados;
- método de pagamento iniciado;
- compra aprovada;
- recuperação por e-mail ou WhatsApp.

Se houver muitos `begin_checkout` e poucos carrinhos abandonados, o problema pode estar antes do formulário da Kiwify. Se houver muitos carrinhos abandonados, o problema está mais no checkout, preço, confiança ou pagamento.
