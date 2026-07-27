import type { Metadata } from "next";

import "./globals.css";
import Header from "./layout/Header";
import { Suspense } from "react";
import FiltersHydrator from "./components/FiltersHydrator";
import Providers from "./providers";
import AuthContextProvider from "@/context/AuthModalContext";
import AuthProvider from "./components/common/AuthProvider";
export const metadata: Metadata = {
  title: "Mini Ecommerce App",
  description: "Welcome to Ecommerece App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {" "}
        <Providers>
          <AuthProvider>
            <AuthContextProvider>
              <Suspense fallback={null}>
                <FiltersHydrator />
              </Suspense>

              <Suspense fallback={null}>
                <Header />
              </Suspense>

              <main className="pt-16">{children}</main>
            </AuthContextProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
