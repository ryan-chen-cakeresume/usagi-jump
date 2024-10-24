import { useEffect, useRef, useState } from 'react'
import config from 'modules/config'
import { CanvasSize, Platform, Player } from 'modules/types'
import { calculateCanvasSize, preparePlatforms } from 'modules/utils'

export function useCanvasSize() {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(calculateCanvasSize)

  useEffect(() => {
    const handleResize = () => {
      const canvasSize = calculateCanvasSize()
      setCanvasSize(canvasSize)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { canvasSize }
}

export function usePlatforms() {
  const platformsRef = useRef<Platform[]>(preparePlatforms([]))

  const movePlatformsDown = (playerDY: number) => {
    platformsRef.current = platformsRef.current.map((platform) => ({
      ...platform,
      y: platform.y - playerDY,
    }))
  }

  const refreshPlatforms = () => {
    platformsRef.current = preparePlatforms(platformsRef.current)
  }

  return { platformsRef, movePlatformsDown, refreshPlatforms }
}

export function usePlayer() {
  const {
    physics: { jumpForce },
    player: { width, initY },
  } = config

  const playerRef = useRef<Player>({
    width,
    x: 0.5 - width / 2,
    y: initY,
    dX: 0,
    dY: -jumpForce,
  })

  const playerImagesRef = useRef({
    left: new Image(),
    right: new Image(),
  })

  useEffect(() => {
    playerImagesRef.current.left.src = 'images/left.png'
    playerImagesRef.current.right.src = 'images/right.png'
  }, [])

  return { playerRef, playerImagesRef }
}
