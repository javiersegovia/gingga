import { motion } from "motion/react";
import { cn } from "@gingga/ui/lib/utils";
import type { ReactNode, ElementType } from "react";
import { Button } from "./button";

type Tab = {
  to: string;
  label: string;
  icon?: ReactNode; // Optional icon
};

interface AnimatedLinkTabsProps {
  tabs: Tab[];
  className?: string;
  pathname: string;
  Link: ElementType<{
    to: string;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }>;
}

function AnimatedLinkTabs({
  tabs,
  className,
  pathname,
  Link: LinkComponent,
}: AnimatedLinkTabsProps) {
  return (
    <div
      className={cn(
        "bg-card border-shadow-border shadow-shadow relative mb-6 flex w-auto space-x-1 rounded-sm border-2 px-1.5 py-1.5",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.to;

        return (
          <Button
            asChild
            key={tab.to}
            size="sm"
            variant="ghost"
            hover="noShadow"
          >
            <LinkComponent
              to={tab.to}
              className={cn(
                "relative w-auto",
                isActive
                  ? "text-primary-foreground dark:text-primary"
                  : "text-muted-foreground dark:hover:text-primary hover:underline"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-bubble"
                  className={cn(
                    "bg-primary dark:bg-primary/20 dark:border-primary dark:text-primary border-shadow-border absolute inset-0 z-10 rounded-sm border-2"
                  )}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                />
              )}
              {tab.icon && <span className="relative z-20">{tab.icon}</span>}
              <span className="relative z-20">{tab.label}</span>
            </LinkComponent>
          </Button>
        );
      })}
    </div>
  );
}

export { AnimatedLinkTabs };
