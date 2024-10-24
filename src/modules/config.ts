export default {
  canvas: {
    aspectRatio: 9 / 16,
  },
  physics: {
    acceleration: 2e-3,
    friction: 9e-1,
    gravity: 1e-3,
    jumpForce: 1.5e-2,
  },
  platform: {
    livingArea: {
      minY: -0.5,
      maxY: 1,
    },
    size: {
      minWidth: 0.08,
      maxWidth: 0.16,
      height: 0.02,
    },
    initY: 0.9,
    offsetY: 0.1,
    moveDownYThreshold: 0.55,
  },
  player: {
    aspectRatio: 180 / 209,
    width: 0.12,
    initY: 0.5,
  },
}
