import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'

const strictMode = false

createRoot(document.getElementById('root')!).render(
  strictMode
    ? <StrictMode><App /></StrictMode>
    : <App />,
)
