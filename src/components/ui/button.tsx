import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#7a1f2e] text-white hover:bg-[#5c1723] shadow-md shadow-[#7a1f2e]/20",
  secondary: "bg-[#c9a227] text-[#1a0f0f] hover:bg-[#b08e1f] font-semibold",
  outline:
    "border-2 border-[#7a1f2e] text-[#7a1f2e] hover:bg-[#7a1f2e]/5 bg-transparent",
  ghost: "text-[#7a1f2e] hover:bg-[#7a1f2e]/10 bg-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className, variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none",
      variants[variant],
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
