import { useState } from 'react'
import Game from 'components/Game'
import styles from './App.module.scss'

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>(
    'start'
  )
  const [score, setScore] = useState<number | null>(null)

  return (
    <div className={styles.container}>
      {gameState === 'start' && (
        <div>
          <button
            onClick={() => {
              setGameState('playing')
            }}
          >
            スタート
          </button>
        </div>
      )}
      {gameState === 'playing' && (
        <Game
          onEnd={(score: number) => {
            setGameState('end')
            setScore(score)
          }}
        />
      )}
      {gameState === 'end' && (
        <div>
          <div>ゲームオーバー、{score} ポイントを獲得しました！</div>
          <button
            onClick={() => {
              setGameState('start')
              setScore(null)
            }}
          >
            リスタート
          </button>
        </div>
      )}
    </div>
  )
}
export default App
