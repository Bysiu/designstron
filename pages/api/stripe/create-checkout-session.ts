import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
} as any);

function getBaseUrl(req: NextApiRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;
  const protoHeader = req.headers['x-forwarded-proto'];
  const protoFromHeader = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader)?.split(',')[0]?.trim();
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

  const isProd = process.env.NODE_ENV === 'production';
  const isLocalEnvUrl = !!envUrl && /(^|\/\/)(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(envUrl);
  const preferredEnvUrl = envUrl && (!isProd || !isLocalEnvUrl) ? envUrl : undefined;

  const proto = protoFromHeader || (isProd ? 'https' : 'http');
  const base = preferredEnvUrl || (host ? `${proto}://${host}` : '');
  return base.replace(/\/$/, '');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { orderItems, totalAmount, customerEmail, metadata, hostingData, formularz, userEmail } = req.body;

    console.log('Stripe API - Otrzymane dane:', { 
      orderItems, 
      totalAmount, 
      customerEmail, 
      metadata,
      hostingData,
      formularz
    });

    // Jeśli formularz zawiera dane hostingu, przekształć je na metadata
    let finalMetadata = metadata;
    if (formularz?.hostingExtend) {
      finalMetadata = {
        orderId: hostingData?.orderId || '', // To powinno być przekazane z frontendu
        type: 'hosting_extend',
        plan: formularz.hostingPlan,
        period: formularz.hostingPeriod.toString(),
        hostingExtend: 'true'
      };
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Brak elementów zamówienia" });
    }

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Nieprawidłowa kwota" });
    }

    // Sprawdź czy to płatność hostingu
    if (finalMetadata?.type === 'hosting') {
      // Dla hostingu - nie tworzymy nowego zamówienia, tylko płatność
      const baseUrl = getBaseUrl(req);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"],
        line_items: orderItems.map((item: any) => ({
          price_data: {
            currency: "pln",
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: Math.round(item.unitPrice * 100), // Zamień złotówki na grosze
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${baseUrl}/panel/hosting/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/panel/hosting/${metadata.orderId}?cancelled=true`,
        customer_email: userEmail || customerEmail,
        metadata: {
          orderId: metadata.orderId,
          type: 'hosting',
          plan: metadata.plan,
          domain: metadata.domain,
          ssl: metadata.ssl,
          period: metadata.period
        },
      });

      return res.status(200).json({ sessionId: session.id });
    }

    // Sprawdź czy to przedłużenie hostingu
    if (finalMetadata?.type === 'hosting_extend') {
      const baseUrl = getBaseUrl(req);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"],
        line_items: orderItems.map((item: any) => ({
          price_data: {
            currency: "pln",
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: Math.round(item.unitPrice * 100), // Zamień złotówki na grosze
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${baseUrl}/panel/hosting/${finalMetadata.orderId}/extend/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/panel/hosting/extend/cancel?cancelled=true`,
        customer_email: userEmail || customerEmail,
        metadata: {
          orderId: finalMetadata.orderId,
          originalOrderId: finalMetadata.orderId, // Dodaj oryginalne ID zamówienia
          type: 'hosting_extend',
          plan: finalMetadata.plan,
          period: finalMetadata.period,
          hostingExtend: 'true' // Dodaj flagę przedłużania
        },
      });

      return res.status(200).json({ sessionId: session.id });
    }

    // Sprawdź czy to zmiana planu hostingu
    if (finalMetadata?.type === 'hosting_change') {
      const baseUrl = getBaseUrl(req);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "blik", "p24"],
        line_items: orderItems.map((item: any) => ({
          price_data: {
            currency: "pln",
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: Math.round(item.unitPrice * 100), // Zamień złotówki na grosze
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${baseUrl}/panel/hosting/change/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/panel/hosting/change/cancel?cancelled=true`,
        customer_email: userEmail || customerEmail,
        metadata: {
          orderId: metadata.orderId,
          originalOrderId: metadata.orderId, // Dodaj oryginalne ID zamówienia
          type: 'hosting_change',
          fromPlan: metadata.fromPlan,
          toPlan: metadata.toPlan
        },
      });

      return res.status(200).json({ sessionId: session.id });
    }

    // Standardowe tworzenie zamówienia (dla stron)
    const { customerPhone } = req.body;

    console.log('Received data:', { orderItems, userEmail, totalAmount, customerPhone, formularz });

    if (!orderItems || !userEmail || !totalAmount) {
      console.log('Missing data validation failed:', { orderItems: !!orderItems, userEmail: !!userEmail, totalAmount: !!totalAmount, totalAmountValue: totalAmount });
      return res.status(400).json({ message: "Brakujące dane" });
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.log('Invalid totalAmount:', totalAmount);
      return res.status(400).json({ message: "Nieprawidłowa kwota" });
    }

    // Znajdź użytkownika po email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    const orderCreateData: any = {
      userId: user.id, // Używamy ID użytkownika
      totalAmount: totalAmount,
      customerPhone: customerPhone || null,
      status: "PENDING",
      // Pola formularza zamówienia
      nazwaFirmy: formularz?.nazwaFirmy || null,
      branża: formularz?.branża || null,
      opisProjektu: formularz?.opisProjektu || null,
      kolorystyka: formularz?.kolorystyka || null,
      stronyPrzykładowe: formularz?.stronyPrzykładowe || [],
      logo: formularz?.logo || false,
      teksty: formularz?.teksty || false,
      zdjecia: formularz?.zdjecia || false,
      terminRealizacji: formularz?.terminRealizacji || null,
      budzet: formularz?.budzet || null,
      uwagi: formularz?.uwagi || null,
      // Pola hostingu
      hostingPlan: hostingData?.plan || null,
      domain: hostingData?.domena || null,
      ssl: hostingData?.ssl || false,
      hostingExpiresAt: null, // Będzie ustawione po aktywacji
      orderItems: {
        create: orderItems.map((item: any) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      },
      statusHistory: {
        create: {
          status: "PENDING",
          comment: formularz?.hostingExtend ? "Przedłużenie hostingu - oczekuje na płatność" : 
                  formularz?.hostingChange ? "Zmiana planu hostingu - oczekuje na płatność" :
                  "Zamówienie utworzone, oczekuje na płatność",
        },
      },
    };

    // Tworzenie zamówienia w bazie danych
    const order = await prisma.order.create({
      data: orderCreateData,
    });

    // Tworzenie sesji checkout Stripe
    const baseUrl = getBaseUrl(req);
    // Przygotuj line_items dla Stripe
    let lineItems = orderItems.map((item: any) => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.name,
          description: item.description || '',
        },
        unit_amount: Math.round(item.unitPrice * 100), // Stripe wymaga kwoty w groszach
      },
      quantity: item.quantity || 1,
    }));

    // Dodaj hosting do line_items jeśli wybrano
    if (hostingData && hostingData.plan && !hostingData.zdecydujePozniej) {
      const hostingPrice = hostingData.plan === 'basic' ? 200 : 400;
      lineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: `Hosting ${hostingData.plan === 'basic' ? 'Basic' : 'Premium'}`,
            description: `Hosting na ${hostingData.period} miesięcy`,
          },
          unit_amount: Math.round(hostingPrice * 100),
        },
        quantity: hostingData.period,
      });

      // Dodaj SSL jeśli wybrano
      if (hostingData.ssl) {
        lineItems.push({
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Certyfikat SSL',
              description: 'Certyfikat SSL na 1 rok',
            },
            unit_amount: Math.round(100 * 100),
          },
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/zamowienie/anulowane`,
      metadata: {
        orderId: order.id,
      },
      customer_email: userEmail,
    });

    // Aktualizacja zamówienia z ID płatności Stripe
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: session.id },
    });

    res.status(200).json({ sessionId: session.id, orderId: order.id });
  } catch (error) {
    console.error("Błąd tworzenia sesji Stripe:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
