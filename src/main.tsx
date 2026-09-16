import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { ThemeProvider } from './lib/ThemeProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* reducedMotion="user": every framer-motion animation site-wide
        (page transitions, card stagger, sidebar slide, theme-icon swap)
        automatically respects the OS-level prefers-reduced-motion setting,
        rather than each animated component needing to check it itself. */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>,
)
