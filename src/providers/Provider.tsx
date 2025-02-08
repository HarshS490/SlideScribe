"use client";

import { ThemeProvider } from "next-themes";
import AuthSessionProvider from "./AuthSession";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </AuthSessionProvider>
  );
}
