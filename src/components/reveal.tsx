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
  const shouldReduce = useReducedMotion()
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let timeout = 0

    const rect0 = el.getBoundingClientRect()
    const vh0 = window.innerHeight || document.documentElement.clientHeight
    const inView0 = rect0.top < vh0 * 0.98 && rect0.bottom > vh0 * 0.02
    // #region agent log
    fetch('http://localhost:7249/ingest/72fc49e3-14d9-4dc7-b1c1-81c23f0976db',{method:'POST',mode:'no-cors',body:JSON.stringify({location:'src/components/reveal.tsx:effect',message:'Reveal mount/effect',data:{delay,shouldReduce,inView0,rect0:{top:rect0.top,bottom:rect0.bottom,height:rect0.height},vh:vh0,ua:navigator.userAgent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

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
        // #region agent log
        fetch('http://localhost:7249/ingest/72fc49e3-14d9-4dc7-b1c1-81c23f0976db',{method:'POST',mode:'no-cors',body:JSON.stringify({location:'src/components/reveal.tsx:io',message:'Reveal IO callback',data:{isIntersecting:entry.isIntersecting,ratio:entry.intersectionRatio,rect:{top:entry.boundingClientRect?.top,bottom:entry.boundingClientRect?.bottom,height:entry.boundingClientRect?.height},root:entry.rootBounds?{top:entry.rootBounds.top,bottom:entry.rootBounds.bottom,height:entry.rootBounds.height}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
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
      // #region agent log
      fetch('http://localhost:7249/ingest/72fc49e3-14d9-4dc7-b1c1-81c23f0976db',{method:'POST',mode:'no-cors',body:JSON.stringify({location:'src/components/reveal.tsx:cleanup',message:'Reveal cleanup/unmount',data:{isInViewAtCleanup:isInView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      observer.disconnect()
      if (raf) window.cancelAnimationFrame(raf)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cs = window.getComputedStyle(el)
    // #region agent log
    fetch('http://localhost:7249/ingest/72fc49e3-14d9-4dc7-b1c1-81c23f0976db',{method:'POST',mode:'no-cors',body:JSON.stringify({location:'src/components/reveal.tsx:isInView',message:'Reveal isInView changed',data:{isInView,opacity:cs.opacity,display:cs.display,visibility:cs.visibility,transform:cs.transform},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  }, [isInView])

  return (
    <motion.div
      ref={ref}
      className={className}
      data-fc-reveal-id={instanceId.current}
      data-fc-reveal-inview={isInView ? '1' : '0'}
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
