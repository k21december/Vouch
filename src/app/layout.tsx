import "@/styles/globals.css";
import "@/styles/candidate.css";
import "@/styles/referrer.css";
import { Outfit, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/lib/auth/ThemeProvider";
import DevToolbar from "@/components/debug/DevToolbar";
import AppShell from "@/components/layout/AppShell";
import AppBackground from "@/components/layout/AppBackground";
import PageTransition from "@/components/layout/PageTransition";
import SplashWrapper from "@/components/layout/SplashWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="navy">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AppBackground>
            <AppShell>
              <SplashWrapper />
              <PageTransition>
                {children}
              </PageTransition>
            </AppShell>
            <DevToolbar />
          </AppBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}
