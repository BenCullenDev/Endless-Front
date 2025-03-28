import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSignOut } from "@/lib/auth"

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
]

export function Nav() {
  const pathname = usePathname()
  const signOut = useSignOut()

  return (
    <nav className="terminal-nav">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-mono">ENDLESS</h1>
      </div>
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`terminal-nav-link block px-4 py-2 w-full ${
                  pathname === item.href ? "terminal-nav-link-active" : ""
                }`}
              >
                {item.label.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto px-4">
          <Button variant="red" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
} 