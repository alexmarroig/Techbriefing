import Stripe from 'stripe';
import { EBOOK_OFFER } from '../../../data/ebookOffer.js';

export const prerender = false;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export async function POST({ request, url }) {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY?.trim();
  const priceId = (import.meta.env.STRIPE_PRICE_EBOOK_AGENTES_IA || 'price_1TVyIoLtNj5NTcPOI4D0WJdo').trim();

  if (!secretKey) {
    return json({ error: 'STRIPE_SECRET_KEY não configurada no Vercel.' }, 500);
  }

  if (!priceId.startsWith('price_')) {
    return json({ error: 'STRIPE_PRICE_EBOOK_AGENTES_IA precisa ser um ID de preço começando com price_.' }, 500);
  }

  const stripe = new Stripe(secretKey);

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const origin = url.origin;
  const successUrl = new URL(EBOOK_OFFER.successUrl, origin);
  successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

  const cancelUrl = new URL('/checkout/ebook-agentes-ia/', origin);
  cancelUrl.searchParams.set('cancelled', '1');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      client_reference_id: payload?.clientReferenceId || undefined,
      metadata: {
        product_id: EBOOK_OFFER.id,
        funnel: 'ebook_agentes_ia',
        source_path: payload?.sourcePath || '',
      },
      payment_intent_data: {
        metadata: {
          product_id: EBOOK_OFFER.id,
          funnel: 'ebook_agentes_ia',
        },
      },
    });

    return json({ url: session.url });
  } catch (error) {
    console.error('[stripe-checkout]', {
      type: error?.type,
      code: error?.code,
      message: error?.message,
    });

    return json({
      error: error?.message
        ? `Erro do Stripe: ${error.message}`
        : 'Erro ao criar checkout no Stripe.',
    }, 500);
  }
}
