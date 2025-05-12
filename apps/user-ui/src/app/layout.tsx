import Header from "@/shared/widgets/header";
import "./global.css";

import { Poppins, Roboto } from "next/font/google";
import Providers from "./providers";

export const metadata = {
  title: "Eshop",
  description:
    "Eshop is an AI powered e-commerce platform that provides personalized shopping experiences.",
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${poppins.variable}`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <main className="w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
