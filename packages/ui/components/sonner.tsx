import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

export const Toaster = ({
  theme,
  ...props
}: ToasterProps & { theme: "system" | "dark" | "light" }) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
