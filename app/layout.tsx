import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* ---------- FONTS ---------- */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ---------- METADATA ---------- */
export const metadata: Metadata = {
  title: "BOXFITX | Gym Management System",
  description: "BOXFITX – Complete Gym Management Platform",
};

/* ---------- ROOT LAYOUT ---------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-[#050505] text-white min-h-screen
        `}
      >
        {children}

        {/* 🔔 GLOBAL TOASTER */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#050505",
              color: "#00FF6A",
              border: "1px solid #00FF6A",
              boxShadow: "0 0 25px #00FF6A55",
              fontWeight: "600",
            },
            success: {
              iconTheme: {
                primary: "#00FF6A",
                secondary: "#050505",
              },
            },
            error: {
              style: {
                color: "#ff6b6b",
                border: "1px solid #ff6b6b",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
