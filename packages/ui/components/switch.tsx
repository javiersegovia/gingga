import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@gingga/ui/lib/utils";

const switchVariants = cva(
  "peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center relative rounded-full border-2 border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:bg-secondary data-[state=unchecked]:bg-transparent",
        primary:
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary",
        accent:
          "data-[state=checked]:bg-accent data-[state=unchecked]:bg-secondary",
        theme: "data-[state=checked]:bg-blank data-[state=unchecked]:bg-blank",
        status:
          "data-[state=checked]:bg-brand-green data-[state=unchecked]:bg-destructive/80 border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none flex items-center justify-center h-6 w-6 rounded-full border-2 border-border bg-white ring-0 transition-transform",
  {
    variants: {
      variant: {
        default:
          "data-[state=checked]:translate-x-5.5 data-[state=unchecked]:-translate-x-[2px]",
        primary:
          "data-[state=checked]:translate-x-5.5 data-[state=unchecked]:-translate-x-[2px]",
        accent:
          "data-[state=checked]:translate-x-5.5 data-[state=unchecked]:-translate-x-[2px]",
        theme:
          "data-[state=checked]:translate-x-5.5 bg-primary data-[state=unchecked]:-translate-x-[2px] dark:bg-primary-accent",
        status:
          "data-[state=checked]:translate-x-5.5 data-[state=unchecked]:-translate-x-[2px] data-[state=checked]:border-border data-[state=unchecked]:border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  thumbIcon?: "theme" | React.ReactNode;
}

function Switch({ className, variant, thumbIcon, ...props }: SwitchProps) {
  return (
    <SwitchPrimitives.Root
      data-slot="switch"
      className={cn(switchVariants({ variant, className }))}
      {...props}
    >
      {thumbIcon === "theme" && (
        <div className="absolute z-10 flex w-full items-center justify-between px-[2px]">
          <SunIcon className="text-secondary-foreground dark:text-muted-foreground h-4 w-4" />
          <MoonIcon className="text-primary-foreground dark:text-primary-accent-foreground fill-accent h-4 w-4" />
        </div>
      )}
      <SwitchPrimitives.Thumb className={cn(thumbVariants({ variant }))}>
        {thumbIcon !== "theme" && thumbIcon}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
}

export { Switch, switchVariants };
export type { SwitchProps };
