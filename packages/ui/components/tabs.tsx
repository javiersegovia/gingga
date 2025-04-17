import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";

import { cn } from "@gingga/ui/lib/utils";
import { Card } from "./card";

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <Card
      design="grid"
      hover="reverse"
      className={cn(
        "relative mb-6 inline-flex w-auto space-x-1 rounded-lg border-2 px-1.5 py-1.5",
        className
      )}
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        className="contents"
        {...props}
      />
    </Card>
  );
}

function TabsTrigger({
  className,
  children,
  isActive,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  isActive?: boolean;
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative w-auto rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "text-muted-foreground dark:hover:text-primary hover:underline",
        "data-[state=active]:text-primary-foreground data-[state=active]:dark:text-primary",
        className
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="active-tab-bubble"
          className={cn(
            "bg-primary dark:bg-primary/20 dark:border-primary dark:text-primary border-shadow-border absolute inset-0 z-10 rounded-lg border-2"
          )}
          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        />
      )}
      <span className="relative z-20">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
