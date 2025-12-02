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
            apiVersion: "2025-11-17.clover", // ✅ EXAKT was TypeScript will!
        });

        // ✅ UPDATED: Support für mehrere Sitze!
        const {seatId, seatIds, name, email, phone, price, totalPrice} = await req.json();

        // Kompatibilität: Einzelner Sitz ODER mehrere Sitze
        const seats = seatIds || [seatId]; // Array von Sitzen
        const finalPrice = totalPrice || price; // Gesamtpreis oder Einzelpreis
        const seatList = Array.isArray(seats) ? seats.join(",") : seats;
        const seatDisplay = Array.isArray(seats) 
            ? seats.map((id: string) => id.replace("seat_", "").replace("_", " ")).join(", ")
            : seats.replace("seat_", "").replace("_", " ");

        console.log("🎫 Erstelle Checkout Session für:", {
            seats: seatList,
            name,
            email,
            totalPrice: finalPrice,
            numberOfSeats: Array.isArray(seats) ? seats.length : 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: Array.isArray(seats) && seats.length > 1
                                ? `${seats.length} Tickets - Josefi Konzert`
                                : `Sitzplatz ${seatDisplay}`,
                            description: `LYRIONA Konzert - Reservierung für ${name} | Sitzplätze: ${seatDisplay}`,
                        },
                        unit_amount: Math.round(finalPrice * 100), // ✅ Gesamtpreis in Cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            // ✅ FIXED: Redirect zu KARTENVERKAUF Tab + seats (plural!)
            success_url: `${
                req.headers.get("origin") || "http://localhost:3000"
            }/dashboard?tab=kartenverkauf&role=admin&success=true&seats=${encodeURIComponent(
                seatList
            )}&name=${encodeURIComponent(
                name
            )}&email=${encodeURIComponent(email)}`,
            cancel_url: `${
                req.headers.get("origin") || "http://localhost:3000"
            }/dashboard?tab=kartenverkauf&role=admin`,
            customer_email: email,
            metadata: {
                seatIds: seatList,
                customerName: name,
                phone: phone || "",
                numberOfSeats: Array.isArray(seats) ? seats.length : 1,
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