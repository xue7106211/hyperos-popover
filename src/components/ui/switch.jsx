import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        ref={ref}
        {...props}
      />
      <div className={cn(
        "relative w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary",
        className
      )} />
    </label>
  )
})
Switch.displayName = "Switch"

export { Switch }

