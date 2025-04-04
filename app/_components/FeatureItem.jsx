import React from 'react'
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

const FeatureItem = ({ feature, included, isPro = false }) => {
    return (
        <div className="flex items-center py-2.5">
            {included ? (
                <div className={cn(
                    "rounded-full p-1",
                    isPro
                        ? "bg-primary/10 text-primary"
                        : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                )}>
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
            ) : (
                <div className="rounded-full p-1 bg-gray-100 text-gray-400 dark:bg-gray-800">
                    <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
            )}
            <p className={cn(
                "text-sm ml-3",
                included ? "text-foreground" : "text-muted-foreground"
            )}>
                {feature}
            </p>
        </div>
    )
}

export default FeatureItem
