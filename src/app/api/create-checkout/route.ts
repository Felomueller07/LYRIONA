import {NextRequest, NextResponse} from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.STRIPE_SECRET_KEY;

        if (!apiKey) {
            console.error("❌ Missing STRIPE_SECRET_KEY during runtime/build");
            return NextResponse.json(
                {error: "Stripe API key missing"},
                {status: 500}
            );
        }

        // Initialize Stripe INSIDE the route → avoids build-time execution
        const stripe = new Stripe(apiKey, {
            apiVersion: "2025-10-29.clover",
        });

        const {seatId, name, email, phone, price} = await req.json();

        console.log("🎫 Erstelle Checkout Session für:", {
            seatId,
            name,
            email,
            price,
        });

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
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${
                req.headers.get("origin") || "http://localhost:3000"
            }/dashboard?tab=tickets&success=true&seat=${seatId}&name=${encodeURIComponent(
                name
            )}&email=${encodeURIComponent(email)}`,
            cancel_url: `${
                req.headers.get("origin") || "http://localhost:3000"
            }/dashboard?tab=tickets`,
            customer_email: email,
            metadata: {
                seatId,
                customerName: name,
                phone: phone || "",
            },
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (err: any) {
        console.error("❌ Stripe Error:", err);
        return NextResponse.json(
            {error: err.message ?? "Unknown error"},
            {status: 500}
        );
    }
}
