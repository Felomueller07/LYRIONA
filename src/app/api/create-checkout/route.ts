import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { seatId, name, email, phone, price } = await req.json();

    console.log("🎫 Erstelle Checkout Session für:", { seatId, name, email, price });

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Sitzplatz ${seatId}`,
              description: `LYRIONA Konzert - Reservierung für ${name}`,
            },
            unit_amount: Math.round(price * 100), // Stripe benutzt Cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get('origin') || 'http://localhost:3000'}/dashboard?tab=tickets&success=true&seat=${seatId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:3000'}/dashboard?tab=tickets`,
      customer_email: email,
      metadata: {
        seatId,
        customerName: name,
        phone: phone || "",
      },
    });

    console.log("✅ Session erstellt:", session.id);
    console.log("🔗 Checkout URL:", session.url);

    // Die komplette Checkout URL zurückgeben
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (err: any) {
    console.error("❌ Stripe Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
