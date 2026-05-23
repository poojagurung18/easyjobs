import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import ToastProvider from "@/components/provider/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "EasyJobs",
  description:
    "Connect with top employers and find the perfect job opportunity",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ToastProvider />
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
