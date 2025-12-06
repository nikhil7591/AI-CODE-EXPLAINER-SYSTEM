import type React from "react"
function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ${className || ""}`}
      {...props}
    />
  )
}

export { Spinner }
