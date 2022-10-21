import type { TLPointerInfo } from '@tldraw/core'
import type { Action } from 'state/constants'

export const editShape: Action = (data, payload: TLPointerInfo) => {
  data.pageState.editingId = payload.target
}
