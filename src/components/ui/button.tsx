import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-[15px] tracking-normal font-medium whitespace-nowrap transition-all outline-none select-none  focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#0c0a09] text-[#ffffff] hover:bg-[#292524] shadow-md shadow-black/5 hover:shadow-black/10",
        outline:
          "border border-[#e7e5e4] bg-transparent text-[#0c0a09] hover:bg-white/10 focus:bg-white/10",
        secondary:
          "bg-white/10 text-[#0c0a09] hover:bg-white/20 border border-[#e7e5e4] backdrop-blur-md",
        ghost:
          "hover:bg-white/10 hover:text-[#0c0a09] text-[#4e4e4e]",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-[#0c0a09] underline-offset-4 hover:underline hover:text-[#0c0a09]",
        neutral: "bg-[#ffffff] shadow-sm text-[#0c0a09] hover:bg-[#303030]",
      },
      size: {
        default:
          "h-10 px-6 py-2",
        ghost:
          "p-3",
        xs: "h-7 px-3 text-[10px]",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-12 px-8 text-[13px]",
        icon: "size-10",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
