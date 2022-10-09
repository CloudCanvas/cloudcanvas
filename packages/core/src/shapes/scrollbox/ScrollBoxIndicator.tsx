import { TLShapeUtil } from '@tldraw/core'
import * as React from 'react'
import type { ScrollBoxShape } from './ScrollBoxShape'

export const ScrollBoxIndicator = TLShapeUtil.Indicator<ScrollBoxShape>(({ shape }) => {
  return (
    <rect
      pointerEvents="none"
      width={shape.size[0]}
      height={shape.size[1]}
      fill="none"
      stroke="tl-selectedStroke"
      strokeWidth={0}
      rx={4}
    />
  )
})
