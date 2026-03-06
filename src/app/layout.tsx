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
        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
        <footer className="border-t border-gray-100 mt-20 py-6">
          <div className="max-w-6xl mx-auto px-4 text-sm text-gray-400">
            PhysicsWithCode — open source physics ML benchmark platform.{" "}
            <a
              href="https://github.com/murnanedaniel/PhysicsWithCode"
              className="hover:text-gray-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
