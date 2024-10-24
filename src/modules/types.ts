export type CanvasSize = {
  width: number // pixels
  height: number // pixels
}

export type Platform = {
  x: number // percentage
  y: number // percentage
  width: number // percentage
  height: number // percentage
}

export type Player = {
  x: number // percentage
  y: number // percentage
  width: number // percentage
  // height is calculated based on player aspect ratio
  dX: number // percentage
  dY: number // percentage
}
