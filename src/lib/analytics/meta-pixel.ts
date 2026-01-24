type FbqFunction = ((command: string, ...args: unknown[]) => void) & {
  callMethod?: (command: string, ...args: unknown[]) => void
  queue?: unknown[]
  loaded?: boolean
  version?: string
  push?: (args: unknown[]) => void
}

declare global {
  interface Window {
    fbq?: FbqFunction
    _fbq?: FbqFunction
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

const CONSENT_STORAGE_KEY = 'fluxocerto:landing:analytics-consent'

/**
 * Consent gate for loading Meta Pixel.
 *
 * The landing app does not ship with a full CMP in-repo. To avoid loading tracking
 * without permission, we only enable the pixel when an explicit opt-in signal exists:
 * - `VITE_META_PIXEL_CONSENT=granted|true` (recommended in production), or
 * - localStorage `fluxocerto:landing:analytics-consent=granted|true`
 */
export function hasMetaPixelConsent(): boolean {
  if (!isBrowser()) return false

  const envConsentRaw =
    import.meta.env.VITE_META_PIXEL_CONSENT ?? import.meta.env.VITE_ANALYTICS_CONSENT ?? null
  const envConsent = typeof envConsentRaw === 'string' ? envConsentRaw.trim().toLowerCase() : null

  if (envConsent === 'true' || envConsent === 'granted') return true
  if (envConsent === 'false' || envConsent === 'denied') return false

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    const normalized = stored?.trim().toLowerCase() ?? null
    if (normalized === 'true' || normalized === 'granted') return true
    if (normalized === 'false' || normalized === 'denied') return false
  } catch {
    // ignore (storage disabled/private mode/etc)
  }

  return false
}

function getPixelId(): string | null {
  const id = import.meta.env.VITE_META_PIXEL_ID
  if (!id) return null
  const normalized = String(id).trim()
  return normalized.length > 0 ? normalized : null
}

function isMetaPixelDisabled(): boolean {
  if (!getPixelId()) return true
  if (import.meta.env.VITE_META_PIXEL_DISABLED === 'true') return true
  return false
}

function ensureFbqStub(): FbqFunction {
  const existing = window.fbq
  if (existing) return existing

  const fbq: FbqFunction = function (...args: unknown[]) {
    // Queue calls until the script loads and sets callMethod.
    ;(fbq.queue ||= []).push(args)
  } as FbqFunction

  fbq.loaded = false
  fbq.version = '2.0'
  fbq.queue = []

  window.fbq = fbq
  window._fbq = fbq
  return fbq
}

function loadPixelScript(): void {
  const scriptId = 'meta-pixel-script'
  if (document.getElementById(scriptId)) return

  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
}

let initialized = false

export function initMetaPixel(): void {
  if (!isBrowser()) return
  if (isMetaPixelDisabled()) return
  if (!hasMetaPixelConsent()) return
  if (initialized) return

  const pixelId = getPixelId()
  if (!pixelId) return

  const fbq = ensureFbqStub()
  loadPixelScript()

  try {
    fbq('init', pixelId)
    initialized = true
  } catch {
    // Never break the landing page because of tracking.
  }
}

export function metaTrack(eventName: string, params?: Record<string, unknown>): void {
  if (!isBrowser()) return
  if (isMetaPixelDisabled()) return
  if (!hasMetaPixelConsent()) return

  initMetaPixel()

  const fbq = window.fbq
  if (!fbq) return
  try {
    if (params) fbq('track', eventName, params)
    else fbq('track', eventName)
  } catch {
    // ignore
  }
}

