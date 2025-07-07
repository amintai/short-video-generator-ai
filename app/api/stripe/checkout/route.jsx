import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, isYearly } = await req.json();

    // Define pricing plans
    const plans = {
      basic: {
        monthly: { price: "price_basic_monthly", amount: 25 },
        yearly: { price: "price_basic_yearly", amount: 250 },
        features: ["5 AI videos per month", "720p quality", "Basic templates"]
      },
      pro: {
        monthly: { price: "price_pro_monthly", amount: 49 },
        yearly: { price: "price_pro_yearly", amount: 490 },
        features: ["25 AI videos per month", "1080p quality", "Premium templates"]
      },
      enterprise: {
        monthly: { price: "price_enterprise_monthly", amount: 99 },
        yearly: { price: "price_enterprise_yearly", amount: 990 },
        features: ["Unlimited videos", "4K quality", "Custom templates"]
      }
    };

    const selectedPlan = plans[planId];
    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceData = isYearly ? selectedPlan.yearly : selectedPlan.monthly;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `AI Video Generator - ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
              description: `${isYearly ? "Yearly" : "Monthly"} subscription`,
            },
            unit_amount: priceData.amount * 100, // Convert to paise
            recurring: {
              interval: isYearly ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade`,
      metadata: {
        userId,
        planId,
        isYearly: isYearly.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
