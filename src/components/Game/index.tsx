import { useEffect, useRef } from 'react'
import config from 'modules/config'
import { useCanvasSize, usePlatforms, usePlayer } from 'modules/hooks'
import styles from './Game.module.scss'

export type GameProps = {
  onEnd: (score: number) => void
}

function Game({ onEnd }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { canvasSize } = useCanvasSize()

  const { platformsRef, movePlatformsDown, refreshPlatforms } = usePlatforms()

  const { playerRef, playerImagesRef } = usePlayer()

  const keysRef = useRef({
    left: false,
    right: false,
  })

  const scoreRef = useRef(0)

  const hasEndedRef = useRef(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        keysRef.current.left = true
      }

      if (event.key === 'ArrowRight') {
        keysRef.current.right = true
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        keysRef.current.left = false
      }

      if (event.key === 'ArrowRight') {
        keysRef.current.right = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const tiltLR = event.gamma // -90 ~ 90

      if (tiltLR !== null) {
        if (tiltLR < -10) {
          keysRef.current.left = true
          keysRef.current.right = false
        } else if (tiltLR > 10) {
          keysRef.current.left = false
          keysRef.current.right = true
        } else {
          keysRef.current.left = false
          keysRef.current.right = false
        }
      }
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    const drawPlatforms = () => {
      platformsRef.current.forEach((platform) => {
        ctx.fillStyle = 'green'
        ctx.fillRect(
          platform.x * canvasSize.width,
          platform.y * canvasSize.height,
          platform.width * canvasSize.width,
          platform.height * canvasSize.height
        )
      })
    }

    const drawPlayer = () => {
      const player = playerRef.current
      const playerHeight =
        (player.width * canvasSize.width) / config.player.aspectRatio

      while (player.x < 0) {
        player.x += 1
      }

      while (player.x > 1) {
        player.x -= 1
      }

      ctx.drawImage(
        player.dX < 0
          ? playerImagesRef.current.left
          : playerImagesRef.current.right,
        player.x * canvasSize.width,
        player.y * canvasSize.height,
        player.width * canvasSize.width,
        playerHeight
      )

      if (player.x + player.width > 1) {
        ctx.drawImage(
          player.dX < 0
            ? playerImagesRef.current.left
            : playerImagesRef.current.right,
          (player.x - 1) * canvasSize.width,
          player.y * canvasSize.height,
          player.width * canvasSize.width,
          playerHeight
        )
      }
    }

    const drawScore = () => {
      ctx.fillStyle = 'black'
      ctx.font = '30px Arial'
      ctx.fillText(`スコア：${scoreRef.current}`, 10, 50)
    }

    const update = () => {
      const {
        physics: { acceleration, friction, gravity, jumpForce },
        platform: { moveDownYThreshold },
      } = config

      const player = playerRef.current
      const platforms = platformsRef.current

      let newDX = player.dX

      if (keysRef.current.left) {
        newDX -= acceleration
      } else if (keysRef.current.right) {
        newDX += acceleration
      }

      newDX *= friction

      const newX = player.x + newDX

      let newY = player.y + player.dY
      let newDY = player.dY + gravity

      if (newDY < 0) {
        // Jumping
        if (newY < moveDownYThreshold) {
          movePlatformsDown(newDY)
          scoreRef.current += Math.floor(Math.abs(newDY) * 100)
        }
      } else {
        // Falling
        const playerHeight =
          (player.width * canvasSize.width) / config.player.aspectRatio
        const playerHeightPercentage = playerHeight / canvasSize.height

        if (newY > 1 - playerHeightPercentage) {
          // Hit the ground
          // newY = 1 - playerHeightPercentage
          // newDY = -jumpForce
          if (!hasEndedRef.current) {
            onEnd(scoreRef.current)
            hasEndedRef.current = true
          }
        } else {
          platforms.forEach((platform) => {
            if (
              player.x + player.width > platform.x &&
              player.x < platform.x + platform.width &&
              player.y + playerHeightPercentage > platform.y &&
              player.y < platform.y + platform.height
            ) {
              newY = platform.y - playerHeightPercentage
              newDY = -jumpForce
            }
          })
        }
      }

      playerRef.current = {
        ...player,
        x: newX,
        y: newY,
        dX: newDX,
        dY: newDY,
      }

      refreshPlatforms()
    }

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawPlatforms()
      drawPlayer()
      drawScore()
      update()

      window.requestAnimationFrame(gameLoop)
    }

    const animationFrameId = window.requestAnimationFrame(gameLoop)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [
    canvasSize.height,
    canvasSize.width,
    movePlatformsDown,
    onEnd,
    platformsRef,
    playerImagesRef,
    playerRef,
    refreshPlatforms,
  ])

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  )
}

export default Game
