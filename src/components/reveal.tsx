import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Props = PropsWithChildren<{
  className?: string
  delay?: number
}>

export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const instanceId = useRef<string>(
    `r_${Math.random().toString(16).slice(2)}_${Math.random().toString(16).slice(2)}`
  )
  const isSafari =
    typeof navigator !== 'undefined' &&
    /Safari/i.test(navigator.userAgent) &&
    !/(Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS)/i.test(navigator.userAgent)
  const shouldReduce = useReducedMotion()
  const [isInView, setIsInView] = useState(false)
  const [forceVisible, setForceVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0

  // Initial in-view check; used to avoid leaving content hidden if already visible.
  const rect0 = el.getBoundingClientRect()
  const vh0 = window.innerHeight || document.documentElement.clientHeight
  const inView0 = rect0.top < vh0 * 0.98 && rect0.bottom > vh0 * 0.02
  void inView0

    // Safari can miss the initial IntersectionObserver callback when observing an element
    // that is already in view (this becomes very visible in React StrictMode remounts).
    // Do a cheap synchronous viewport check as a fallback so content doesn't get stuck hidden.
    const checkInView = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return rect.top < vh * 0.98 && rect.bottom > vh * 0.02
    }

    if (checkInView()) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )

    observer.observe(el)

    // Safari (esp. mobile) can report incorrect rects in the same tick as mount/scroll.
    // Re-check on the next frame to catch elements that are already in view.
    raf = window.requestAnimationFrame(() => {
      if (checkInView()) {
        setIsInView(true)
        observer.disconnect()
      }
    })

    return () => {
      observer.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    window.getComputedStyle(el)
  }, [isInView])

  useEffect(() => {
    if (!isInView || shouldReduce || forceVisible) return
    const el = ref.current
    if (!el) return

    // Safari can sometimes keep Motion elements stuck at initial styles even after state flips.
    // Verify next frame; if still hidden, force visible with a plain div render.
    const raf = window.requestAnimationFrame(() => {
      const node = ref.current
      if (!node) return
      const cs = window.getComputedStyle(node)
      const opacity = Number(cs.opacity)
      if (Number.isFinite(opacity) && opacity < 0.1) {
        setForceVisible(true)
      }
    })

    return () => window.cancelAnimationFrame(raf)
  }, [forceVisible, isInView, shouldReduce])

  useEffect(() => {
    if (!forceVisible) return
    const el = ref.current
    if (!el) return
    const raf = window.requestAnimationFrame(() => {
      const node = ref.current
      if (!node) return
      window.getComputedStyle(node)
    })
    return () => window.cancelAnimationFrame(raf)
  }, [forceVisible])

  if (shouldReduce || isSafari || forceVisible) {
    return (
      <div
        ref={ref}
        className={className}
        data-fc-reveal-id={instanceId.current}
        data-fc-reveal-inview={isInView ? '1' : '0'}
        style={
          shouldReduce
            ? undefined
            : forceVisible
              ? { opacity: 1, transform: 'none' }
              : isSafari
                ? {
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'none' : 'translate3d(0, 18px, 0)',
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '600ms',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transitionDelay: `${delay}s`,
                    willChange: 'opacity, transform',
                  }
                : undefined
        }
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      data-fc-reveal-id={instanceId.current}
      data-fc-reveal-inview={isInView ? '1' : '0'}
      initial={shouldReduce ? false : { opacity: 0, y: 18 }}
      animate={
        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )}
