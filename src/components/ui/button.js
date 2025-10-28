"use client";

import React from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles = {
  default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  outline: "border border-zinc-200 bg-transparent text-zinc-900 hover:bg-zinc-100",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100",
};

export const Button = React.forwardRef(function Button(
  { className, variant = "default", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variantStyles[variant] ?? variantStyles.default, className)}
      {...props}
    />
  );
});

export function buttonVariants(variant = "default") {
  return cn(baseStyles, variantStyles[variant] ?? variantStyles.default);
}
