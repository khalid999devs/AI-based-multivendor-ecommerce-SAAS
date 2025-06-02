import "./global.css";
import Providers from "./Providers";
import { Poppins } from "next/font/google";

export const metadata = {
  title: "Eshop Seller",
  description:
    "Eshop is an AI powered e-commerce platform that provides personalized shopping experiences.",
};

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
        className={`min-h-screen bg-zinc-900 font-sans antialiased ${poppins.variable}`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
