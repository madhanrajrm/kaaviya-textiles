import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-[#e8d5c4] bg-white px-3 py-2.5 text-sm text-[#1a0f0f] placeholder:text-[#9a8a7a] focus:border-[#7a1f2e] focus:outline-none focus:ring-2 focus:ring-[#7a1f2e]/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Label = ({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) => (
  <label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-medium text-[#4a3535]", className)}>
    {children}
  </label>
);

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-[#e8d5c4] bg-white px-3 py-2.5 text-sm text-[#1a0f0f] focus:border-[#7a1f2e] focus:outline-none focus:ring-2 focus:ring-[#7a1f2e]/20",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-[#e8d5c4] bg-white px-3 py-2.5 text-sm text-[#1a0f0f] placeholder:text-[#9a8a7a] focus:border-[#7a1f2e] focus:outline-none focus:ring-2 focus:ring-[#7a1f2e]/20 min-h-[80px]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
