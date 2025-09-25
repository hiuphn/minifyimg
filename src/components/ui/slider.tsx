import * as React from "react"

/**
 * Slider component sử dụng Bootstrap
 */
export interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  style?: React.CSSProperties
  disabled?: boolean // Add disabled prop
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, min = 1, max = 100, step = 1, className = "", style, disabled, ...props }, ref) => (
    <input
      type="range"
      className={`form-range ${className}`}
      min={min}
      max={max}
      step={step}
      value={value[0]}
      ref={ref}
      onChange={e => onValueChange([Number(e.target.value)])}
      style={style}
      disabled={disabled} // Pass disabled prop to input
      {...props}
    />
  )
)
Slider.displayName = "Slider"
