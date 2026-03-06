import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline text-white hover:text-brand-100 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-6 h-6"
              aria-hidden
            >
              {/* Atom icon */}
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
              <ellipse cx="12" cy="12" rx="10" ry="4" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
            </svg>
            <span className="font-bold text-lg tracking-tight">PhysicsWithCode</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1 flex-1">
            {[
              { href: "/papers", label: "Papers" },
              { href: "/tasks", label: "Tasks" },
              { href: "/datasets", label: "Datasets" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded text-sm text-brand-100 hover:text-white hover:bg-brand-700 no-underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/murnanedaniel/PhysicsWithCode"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-brand-200 hover:text-white no-underline"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
