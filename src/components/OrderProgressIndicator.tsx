import React from 'react';
import { cn } from '@/lib/utils'; // For conditional class names
import { CheckCircle, Loader2, Circle } from 'lucide-react'; // Example icons

interface OrderProgressIndicatorProps {
  steps: string[];
  currentStepIndex: number; // 0-based index of the current active step
  className?: string;
}

const OrderProgressIndicator: React.FC<OrderProgressIndicatorProps> = ({
  steps,
  currentStepIndex,
  className,
}) => {
  console.log(`Rendering OrderProgressIndicator. Current step index: ${currentStepIndex}, Total steps: ${steps.length}`);

  if (!steps || steps.length === 0) {
    console.warn("OrderProgressIndicator: No steps provided.");
    return null;
  }

  return (
    <div className={cn("flex items-center w-full space-x-2 sm:space-x-4", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        let IconComponent = Circle;
        if (isCompleted) IconComponent = CheckCircle;
        if (isActive) IconComponent = Loader2; // Or a different icon for active

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2",
                  isCompleted ? "bg-green-500 border-green-500 text-white" : "",
                  isActive ? "border-blue-500 text-blue-500 animate-pulse" : "",
                  isUpcoming ? "border-gray-300 text-gray-400" : ""
                )}
              >
                <IconComponent className={cn("h-4 w-4 sm:h-5 sm:w-5", isActive && "animate-spin")} />
              </div>
              <p
                className={cn(
                  "mt-1 text-xs sm:text-sm font-medium",
                  isCompleted ? "text-green-600" : "",
                  isActive ? "text-blue-600" : "",
                  isUpcoming ? "text-gray-500" : ""
                )}
              >
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 rounded",
                  isCompleted || isActive ? "bg-blue-500" : "bg-gray-300"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderProgressIndicator;