import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  return (
    <div className="theme-provider">
      <ThemeProviderInternal defaultTheme={defaultTheme}>
        {children}
      </ThemeProviderInternal>
    </div>
  );
}

function ThemeProviderInternal({
  children,
  defaultTheme,
}: ThemeProviderProps) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Set the default theme when the component mounts
    setTheme(defaultTheme);
  }, [defaultTheme, setTheme]);

  return <>{children}</>;
}