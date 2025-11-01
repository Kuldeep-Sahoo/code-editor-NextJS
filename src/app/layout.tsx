import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // ✅ Import dark theme properly
import ConvexClientProvider from "@/components/provider/ConvexClientProvider";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Code-Editor-By-Kuldeep",
  description: "Made by Dev Kuldeep",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen 
        bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark, // ✅ proper dark mode
            variables: {
              colorPrimary: "#8b5cf6", // purple accent
              colorBackground: "#0a0a0f",
              colorText: "#f5f5f5",
              colorInputBackground: "#111122",
              colorInputText: "#f5f5f5",
              colorTextSecondary: "#c0c0c0",
              borderRadius: "0.75rem",
            },
            elements: {
              card: "bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl text-gray-100",
              headerTitle: "text-white text-lg font-semibold",
              headerSubtitle: "text-gray-400",
              formFieldLabel: "text-gray-300",
              formFieldInput:
                "bg-[#111122] text-white border border-gray-700 focus:border-purple-500/50 focus:ring-0 rounded-lg",
              formButtonPrimary:
                "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 rounded-lg",
              socialButtonsBlockButton:
                "bg-[#1a1a2e] border border-gray-700 hover:border-purple-500/40 text-gray-200",
              footerActionText: "text-gray-400",
            },
          }}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>

        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
