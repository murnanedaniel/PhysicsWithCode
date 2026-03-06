import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "PhysicsWithCode",
  description: "Track state-of-the-art results and benchmarks for physics machine learning",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
          <p>
            PhysicsWithCode — open source physics ML platform.{" "}
            <a
              href="https://github.com/murnanedaniel/PhysicsWithCode"
              className="hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
