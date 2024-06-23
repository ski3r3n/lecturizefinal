// app/fonts.ts
import { Noto_Sans } from "next/font/google";

const NotoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const fonts = {
  NotoSans,
};
