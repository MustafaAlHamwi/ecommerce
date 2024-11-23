"use client"

import * as React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import "./SimpleTooltip.css"
import { useIsRtl } from "~/hooks"

type Side = "top" | "right" | "bottom" | "left";

type Props = {
  className?: string;
  sideOffset?: number;
  children: React.ReactNode;
  side?: Side | "side" | "side-reversed";
  message: string;
}

const SimpleTooltip = (({ sideOffset = 4, children, message, side = "top" }: Props) => {

  let direction: Side;

  if (side === "side") {
    direction = useIsRtl() ? "left" : "right";
  } else if (side === "side-reversed") {
    direction = useIsRtl() ? "right" : "left";
  } else {
    direction = side;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div>
          {children}
        </div>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="TooltipContent"
          sideOffset={sideOffset}
          side={direction}
        >
          <p>{message}</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
})

export { SimpleTooltip }
