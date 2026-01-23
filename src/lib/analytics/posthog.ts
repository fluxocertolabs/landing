import posthog from 'posthog-js'

function isPosthogDisabled(): boolean {
  if (!import.meta.env.VITE_POSTHOG_KEY) return true
  if (import.meta.env.VITE_POSTHOG_DISABLED === 'true') return true
  return false
}

export function initPosthog(): void {
  if (isPosthogDisabled()) return

  const apiKey = import.meta.env.VITE_POSTHOG_KEY
  if (!apiKey) return

  const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

  posthog.init(apiKey, {
    api_host: apiHost,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
  })

  // Single-page landing: capture a pageview on load (we don't use a router here).
  posthog.capture('$pageview')
}

export function captureEvent(event: string, properties?: Record<string, unknown>): void {
  if (isPosthogDisabled()) return
  posthog.capture(event, properties)
}

