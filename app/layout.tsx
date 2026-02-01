import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "HumanQL",
  description: "Apergu HumanQL - SQL Query Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}