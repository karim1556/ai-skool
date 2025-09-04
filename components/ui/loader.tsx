"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      variant: {
        default: "text-blue-500",
        destructive: "text-red-500",
        success: "text-green-500",
      },
      size: {
        default: "h-8 w-8 border-4",
        sm: "h-4 w-4 border-2",
        lg: "h-12 w-12 border-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LoaderProps extends VariantProps<typeof loaderVariants> {}

export const Loader = ({ variant, size }: LoaderProps) => {
  return (
    <div className={cn(loaderVariants({ variant, size }))} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};
