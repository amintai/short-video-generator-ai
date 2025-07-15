import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "../../../../configs/db";
import { Users } from "../../../../configs/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session) {
  const { userId, planId, isYearly } = session.metadata;
  
  // Get video limits based on plan
  const planLimits = {
    basic: 5,
    pro: 25,
    enterprise: -1 // unlimited
  };

  const videoLimit = planLimits[planId] || 5;
  const subscriptionEndDate = new Date();
  if (isYearly === "true") {
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
  } else {
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
  }

  // Update user subscription in database
  await db
    .update(Users)
    .set({
      subscription: true,
      subscriptionPlan: planId,
      subscriptionStatus: "active",
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      subscriptionStartDate: new Date(),
      subscriptionEndDate,
      videoLimit,
      videosUsed: 0
    })
    .where(eq(Users.email, userId)); // Assuming userId is email for Clerk
}

async function handleSubscriptionUpdated(subscription) {
  // Handle subscription changes (plan upgrades/downgrades)
  await db
    .update(Users)
    .set({
      subscriptionStatus: subscription.status
    })
    .where(eq(Users.stripeSubscriptionId, subscription.id));
}

async function handleSubscriptionDeleted(subscription) {
  // Handle subscription cancellation
  await db
    .update(Users)
    .set({
      subscription: false,
      subscriptionStatus: "cancelled",
      subscriptionPlan: "free",
      videoLimit: 5
    })
    .where(eq(Users.stripeSubscriptionId, subscription.id));
}

async function handlePaymentSucceeded(invoice) {
  // Handle successful payment renewal
  if (invoice.subscription) {
    await db
      .update(Users)
      .set({
        subscriptionStatus: "active"
      })
      .where(eq(Users.stripeSubscriptionId, invoice.subscription));
  }
}

async function handlePaymentFailed(invoice) {
  // Handle failed payment
  if (invoice.subscription) {
    await db
      .update(Users)
      .set({
        subscriptionStatus: "past_due"
      })
      .where(eq(Users.stripeSubscriptionId, invoice.subscription));
  }
}
