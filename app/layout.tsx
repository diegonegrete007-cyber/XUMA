import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "XUMA - Aprende Matemáticas",
    description: "La forma divertida de aprender matemáticas.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl overflow-hidden border-x border-slate-100">
                    {children}
                </div>
            </body>
        </html>
    );
}
