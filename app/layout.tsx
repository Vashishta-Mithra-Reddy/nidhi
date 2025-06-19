import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import BottomNav from "@/components/bottom-nav";

// Configure Poppins with multiple weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nidhi",
  description: "A blockchain based crowdfunding system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Header />
          <main className="flex-grow pt-20">{children}</main>
          <BottomNav/>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}