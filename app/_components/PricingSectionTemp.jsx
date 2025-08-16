"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Button } from "../../components/ui/button";

export default function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">
          🚀 Become a Founding Member
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          We’re still in early days. Instead of polished pricing tables, we’re
          inviting early adopters to join us as{" "}
          <span className="text-indigo-600 font-medium">Founding Members</span>.
          You’ll get lifetime discounts, direct input into new features, and
          recognition as an early supporter.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                ✨ Early Supporter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">Pay what you want</p>
              <p className="text-gray-600 mb-6">
                Great if you want to test the platform and support us while we
                grow. Keep your early rate for life.
              </p>
              <Button className="w-full">Join as Supporter</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                🚀 Founding Partner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">Custom deal</p>
              <p className="text-gray-600 mb-6">
                Perfect for small teams or agencies who want to scale with us.
                Let’s chat and set up a custom partnership.
              </p>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
