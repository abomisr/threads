import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

import "../globals.css"
import { dark } from "@clerk/themes"

export const metadata = {
    title: "Threads",
    description: "Awesome Threads Application Clone with Next.js 13"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
            }}
        >
            <html
                lang="html"
            >
                <body className={inter.className + " bg-gradient-to-b from-slate-950 to-slate-800 via-slate-900"}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}