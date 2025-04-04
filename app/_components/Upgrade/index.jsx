import React, { useState } from 'react'
import UpgradeHead from './UpgradeHead'
import PricingCards from './PricingCards';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';


const Upgrade = () => {
    const [isYearly, setIsYearly] = useState(false);

    const handleSetYearlyPlan = (currentPlan) => {
        setIsYearly(!currentPlan)
    }
    const basicFeatures = [
        { name: "5 AI videos per month", included: true },
        { name: "720p video quality", included: true },
        { name: "Basic video templates", included: true },
        { name: "Text-to-video generation", included: true },
        { name: "Up to 30 seconds length", included: true },
        { name: "Standard rendering speed", included: true },
        { name: "Email support", included: true },
        { name: "Advanced editing tools", included: false },
        { name: "Custom branding", included: false },
        { name: "Stock footage library", included: false },
        { name: "Priority rendering", included: false },
        { name: "API access", included: false },
    ];

    const proFeatures = [
        { name: "25 AI videos per month", included: true },
        { name: "1080p video quality", included: true },
        { name: "Premium video templates", included: true },
        { name: "Text-to-video generation", included: true },
        { name: "Up to 2 minutes length", included: true },
        { name: "Fast rendering speed", included: true },
        { name: "Priority email support", included: true },
        { name: "Advanced editing tools", included: true },
        { name: "Custom branding", included: true },
        { name: "Stock footage library", included: true },
        { name: "Priority rendering", included: true },
        { name: "API access", included: false },
    ];

    const enterpriseFeatures = [
        { name: "Unlimited AI videos", included: true },
        { name: "4K video quality", included: true },
        { name: "Custom video templates", included: true },
        { name: "Text-to-video generation", included: true },
        { name: "Unlimited video length", included: true },
        { name: "Ultra-fast rendering speed", included: true },
        { name: "Dedicated support team", included: true },
        { name: "Advanced editing tools", included: true },
        { name: "Custom branding", included: true },
        { name: "Stock footage library", included: true },
        { name: "Priority rendering", included: true },
        { name: "API access", included: true },
    ];

    return (

        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
            <div className="container px-4 py-24 mx-auto">
                <UpgradeHead isYearly={isYearly} handleSetYearlyPlan={handleSetYearlyPlan} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
                    {/* Basic Plan */}
                    <div className="relative mt-6 md:mt-0">
                        <PricingCards
                            title="Basic"
                            monthlyPrice="₹25"
                            yearlyPrice="₹150"
                            description="Perfect for beginners and casual creators"
                            features={basicFeatures}
                            buttonText="Get Started"
                            popular={false}
                            isYearly={isYearly}
                        />
                    </div>

                    {/* Pro Plan */}
                    <div className="relative z-10">
                        <PricingCards
                            title="Pro"
                            monthlyPrice="₹49"
                            yearlyPrice="₹450"
                            description="For serious content creators and marketers"
                            features={proFeatures}
                            buttonText="Get Pro"
                            popular={true}
                            isYearly={isYearly}
                        />
                    </div>

                    {/* Enterprise Plan */}
                    <div className="relative mt-6 md:mt-0">
                        <PricingCards
                            title="Enterprise"
                            monthlyPrice="₹99"
                            yearlyPrice="₹950"
                            description="Ultimate solution for agencies and businesses"
                            features={enterpriseFeatures}
                            buttonText="Contact Sales"
                            popular={false}
                            isYearly={isYearly}
                        />
                    </div>
                </div>

                {/* Call to action section */}
                <div className="mt-24 text-center max-w-3xl mx-auto rounded-2xl bg-gray-50 dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800">
                    <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Need a custom solution?</h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Get in touch with our sales team for a tailored package that meets your specific video production needs.
                    </p>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
                        Contact us <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Upgrade
