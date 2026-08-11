import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ChatBot from "@/components/ChatBot";
import CloseButton from "@/components/CloseButton";
import MobileScrollUnlock from "@/components/MobileScrollUnlock";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Constantia | Creative Agency",
  description: "Photography, Videography, Motion Graphics, Graphic Design, Web Development, and Strategy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} scroll-locked`}
    >
      <body>
        <MobileScrollUnlock />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CloseButton />
        <ChatBot />
      </body>
    </html>
  );
}
