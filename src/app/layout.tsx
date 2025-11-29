import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
      <head>
        {/* Botpress Webchat Script */}
        <script
          src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
          defer
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("load", () => {
                window.botpress.init({
                  botId: "e73a6a8a-8397-47b4-a2c2-25149a3d1143",
                  clientId: "3bca6cc1-66b4-4e1b-8ef4-ae755c939c7c",
                  selector: "body",
                  themeMode: "dark",
                  theme: "solid",
                  themeConfig: {
                    primaryColor: "#8b5cf6",
                    backgroundColor: "#0a0a0f",
                    textColor: "#ffffff",
                    botMessageBackground: "#1a1a1f",
                    userMessageBackground: "#8b5cf6",
                    buttonColor: "#8b5cf6",
                    buttonTextColor: "#ffffff"
                  }
                });

                window.botpress.on('webchat:initialized', () => {
                  window.botpress.config({ 
                    configuration: { themeMode: "dark" } 
                  });
                });
              });
            `,
          }}
        />

        {/* Custom Botpress Button Size */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #bp-web-widget-container .bpw-floating-button {
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
              }
              
              #bp-web-widget-container .bpw-floating-button svg {
                width: 24px !important;
                height: 24px !important;
              }
              
              #bp-web-widget-container {
                bottom: 20px !important;
                right: 20px !important;
              }
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen 
        bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#8b5cf6",
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
