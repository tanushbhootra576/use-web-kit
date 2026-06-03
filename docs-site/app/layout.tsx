import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "use-web-kit | Engineering-Grade React Hooks",
  description: "Zero-cost abstractions and frame-perfect performance toolkit for React 19.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <LoadingScreen exitDelay={1400} />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 flex flex-col w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
