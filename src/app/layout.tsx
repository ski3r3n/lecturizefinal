import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ChakraProvider } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lecturize",
  description:
    "A platform that converts verbal teaching into concise, summarised revision notes by utilizing an Artificial Intelligence (AI) technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className="bg[#f3f5f8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
