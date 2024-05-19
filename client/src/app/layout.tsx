import Navbar from "@/components/layout/Navbar";
import AuthProvider from "@/components/providers/auth/AuthProvider";
import QueryProvider from "@/components/providers/auth/reactQuery/QueryProvider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import 'react-day-picker/dist/style.css';
import { Toaster } from "react-hot-toast";
import "./globals.css";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "The True Faces",
  description: "The True Faces Organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextTopLoader/>
        <QueryProvider>
          
          <AuthProvider>
            <Toaster
              toastOptions={{
                style: {
                  padding: "10px",
                  width: "300px",
                  fontSize: "19px",
                  fontWeight: "normal",
                },
                position: "bottom-right",
                iconTheme: {
                  primary: "rgb(116, 110, 110)",
                  secondary: "#fff",
                },
              }}
              containerStyle={{
                bottom: 50,
                stopColor: "ActiveCaption",
                animationFillMode: "revert-layer",
              }}
            />
            <Navbar />
                
            <div className="mx-3 md:mx-20  mt-5 md:mt-20">
            
              {children}</div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
