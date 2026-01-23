import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { App } from '@/App'
import '@/index.css'
import { initPosthog } from '@/lib/analytics/posthog'

initPosthog()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </PostHogProvider>
  </StrictMode>
)
