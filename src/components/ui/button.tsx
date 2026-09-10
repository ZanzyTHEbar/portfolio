import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium tracking-tight transition-[background-color,color,box-shadow,opacity,transform] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-fg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:bg-fg/90",
        outline:
          "bg-transparent text-fg shadow-[0_0_0_1px_rgb(232_230_223_/_0.16)] hover:shadow-[0_0_0_1px_rgb(232_230_223_/_0.34)] hover:bg-elevated",
        ghost: "bg-transparent text-fg hover:bg-elevated",
        signal: "bg-signal text-fg hover:bg-signal/90",
      },
      size: {
        default: "h-11 rounded-sm px-4 pr-3.5",
        sm: "h-9 rounded-sm px-3 pr-2.5 text-xs",
        lg: "h-12 rounded-sm px-5 pr-4",
        icon: "size-11 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";
