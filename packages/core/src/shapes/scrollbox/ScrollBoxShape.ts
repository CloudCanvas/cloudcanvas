import type { TLShape } from '@tldraw/core'

export interface ScrollBoxShape extends TLShape {
  type: 'scrollbox'
  size: number[]
}
