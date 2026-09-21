import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "toulc — What is your Instagram actually worth?",
  description:
    "Upload a screenshot. Get your number. See where you rank among creators.",
  openGraph: {
    title: "toulc — What is your Instagram actually worth?",
    description: "Find out how much brands would pay to work with you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
