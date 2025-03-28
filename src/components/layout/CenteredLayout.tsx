import { ReactNode } from 'react'

interface CenteredLayoutProps {
  children: ReactNode
}

export function CenteredLayout({ children }: CenteredLayoutProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {children}
    </div>
  )
} 