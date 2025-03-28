import { Nav } from "@/components/ui/nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="terminal-main">
        {children}
      </main>
    </div>
  )
} 