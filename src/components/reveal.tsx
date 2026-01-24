import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Props = PropsWithChildren<{
  className?: string
  delay?: number
}>

export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const shouldReduce = useReducedMotion()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let timeout = 0

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

    // Fail-open: never leave content hidden if IO fails to fire for any reason.
    timeout = window.setTimeout(() => {
      setIsInView(true)
      observer.disconnect()
    }, 1200)

    return () => {
      observer.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduce ? false : { opacity: 0, y: 18 }}
      animate={
        shouldReduce
          ? undefined
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 18 }
      }
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )}
