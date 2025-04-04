import React from 'react';
import { ArrowRight } from 'lucide-react';
import FeatureItem from '../FeatureItem';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';


const PricingCards = ({
    title,
    monthlyPrice,
    yearlyPrice,
    description,
    features,
    popular = false,
    buttonText,
    isYearly,
}) => {
    const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
    const pricePeriod = isYearly ? "/year" : "/month";
    return (
        <Card className={cn(
            "flex flex-col h-full transition-all duration-200 border-2",
            popular
                ? "border-primary shadow-lg shadow-primary/10 scale-100 lg:scale-105"
                : "hover:border-primary/50 hover:shadow-md border-border"
        )}>
            {popular && (
                <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2 font-medium">
                    Most Popular
                </div>
            )}
            <CardHeader className={cn("pb-8", popular ? "pt-8" : "")}>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-muted-foreground mt-2.5">{description}</CardDescription>
                <div className="mt-5 flex items-baseline">
                    <span className="text-3xl font-bold">{currentPrice}</span>
                    <span className="text-sm text-muted-foreground ml-1.5">{pricePeriod}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-0.5">
                <div className="text-sm font-medium mb-4">Includes:</div>
                <div className="space-y-1">
                    {features.map((feature, index) => (
                        <FeatureItem
                            key={index}
                            feature={feature.name}
                            included={feature.included}
                            isPro={popular}
                        />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="mt-auto pt-6">
                <Button
                    variant={popular ? "default" : "outline"}
                    className={cn(
                        "w-full font-medium",
                        popular
                            ? "bg-primary hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:text-primary"
                    )}
                >
                    {buttonText}
                    <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PricingCards
