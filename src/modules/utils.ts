import { CanvasSize, Platform } from 'modules/types'
import config from 'modules/config'

const getRandomValue = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const calculateCanvasSize = (): CanvasSize => {
  const { innerWidth, innerHeight } = window
  const { aspectRatio } = config.canvas

  const isWindowWiderThanAspectRatio = innerWidth / innerHeight > aspectRatio

  const [width, height] = isWindowWiderThanAspectRatio
    ? [innerHeight * aspectRatio, innerHeight]
    : [innerWidth, innerWidth / aspectRatio]

  return { width, height }
}

const generatePlatform = (platforms: Platform[]): Platform => {
  const {
    size: { minWidth, maxWidth, height },
    initY,
    offsetY,
  } = config.platform

  const width = getRandomValue(minWidth, maxWidth)
  const x = Math.random() * (1 - width)

  const highestPlatform =
    platforms.length === 0 ? null : platforms[platforms.length - 1]
  const y = highestPlatform ? highestPlatform.y - offsetY : initY

  return {
    x,
    y,
    width,
    height,
  }
}

export const preparePlatforms = (initPlatforms: Platform[]): Platform[] => {
  let platforms: Platform[] = [...initPlatforms]

  let shouldGeneratePlatform =
    platforms.length === 0 ||
    platforms[platforms.length - 1].y > config.platform.livingArea.minY

  while (shouldGeneratePlatform) {
    const newPlatform = generatePlatform(platforms)

    platforms.push(newPlatform)

    shouldGeneratePlatform = newPlatform.y > config.platform.livingArea.minY
  }

  platforms = platforms.filter(
    (platform) => platform.y < config.platform.livingArea.maxY
  )

  return platforms
}
