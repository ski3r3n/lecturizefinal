import type { Metadata } from "next";
// import "./globals.css";
import { Providers } from "./providers";
import { fonts } from './fonts'

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
    <html lang="en-GB" className={fonts.NotoSans.variable}>
      <body className="bg[#f3f5f8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
