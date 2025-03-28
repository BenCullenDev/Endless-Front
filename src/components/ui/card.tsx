import * as React from "react"

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        className={`terminal-card ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card } 