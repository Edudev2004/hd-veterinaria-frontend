import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <div
            key={step.number}
            className="flex items-center flex-1 last:flex-none"
          >
            {/* Step Circle + Label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-[#0d9488] text-white"
                    : isCurrent
                      ? "bg-[#f59e0b] text-white ring-4 ring-amber-100"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isCurrent ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4">
                <div
                  className={`h-1 rounded-full transition-all ${
                    isCompleted ? "bg-[#0d9488]" : "bg-slate-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
