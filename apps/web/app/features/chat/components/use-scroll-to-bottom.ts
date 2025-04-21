/* eslint-disable react-compiler/react-compiler */
import type React from 'react'
import { useState, useRef, useCallback, useEffect } from 'react'

export type ScrollUtilities = {
  autoScrollEnabled: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
  isScrolling: boolean
  scrollTriggered: boolean
  newMessageAdded: boolean
  setNewMessageAdded: React.Dispatch<React.SetStateAction<boolean>>
  prevChildrenCountRef: React.MutableRefObject<number>
}

export function useScrollToBottom<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  React.RefObject<T | null>,
  ScrollUtilities,
] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const lastScrollTopRef = useRef(0)
  const autoScrollingRef = useRef(false)
  const [newMessageAdded, setNewMessageAdded] = useState(false)
  const prevChildrenCountRef = useRef(0)
  const scrollTriggeredRef = useRef(false)

  const isAtBottom = useCallback((element: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element
    return scrollHeight - scrollTop - clientHeight <= 8
  }, [])

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const container = containerRef.current
      if (!container) return

      autoScrollingRef.current = true
      scrollTriggeredRef.current = true

      const targetScrollTop = container.scrollHeight - container.clientHeight

      container.scrollTo({
        top: targetScrollTop,
        behavior: behavior,
      })

      const checkScrollEnd = () => {
        if (Math.abs(container.scrollTop - targetScrollTop) < 5) {
          autoScrollingRef.current = false
          scrollTriggeredRef.current = false
          return
        }

        requestAnimationFrame(checkScrollEnd)
      }

      requestAnimationFrame(checkScrollEnd)

      const safetyTimeout = setTimeout(() => {
        autoScrollingRef.current = false
        scrollTriggeredRef.current = false
      }, 500)

      try {
        const handleScrollEnd = () => {
          autoScrollingRef.current = false
          scrollTriggeredRef.current = false
          clearTimeout(safetyTimeout)
          container.removeEventListener('scrollend', handleScrollEnd)
        }

        container.addEventListener('scrollend', handleScrollEnd, {
          once: true,
        })
      } catch (_e) {
        // scrollend event not supported in this browser, fallback to requestAnimationFrame
      }
    },
    [containerRef],
  )

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    lastScrollTopRef.current = container.scrollTop

    const handleScroll = () => {
      if (autoScrollingRef.current) return

      const currentScrollTop = container.scrollTop

      if (currentScrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false)
      }

      if (isAtBottom(container) && !autoScrollEnabled) {
        setAutoScrollEnabled(true)
      }

      lastScrollTopRef.current = currentScrollTop
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && autoScrollEnabled) {
        setAutoScrollEnabled(false)
      }
    }

    const handleTouchStart = () => {
      lastScrollTopRef.current = container.scrollTop
    }

    const handleTouchMove = () => {
      if (container.scrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false)
      }

      lastScrollTopRef.current = container.scrollTop
    }

    const handleTouchEnd = () => {
      if (isAtBottom(container) && !autoScrollEnabled) {
        setAutoScrollEnabled(true)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [containerRef, autoScrollEnabled, isAtBottom])

  return [
    containerRef,
    endRef,
    {
      autoScrollEnabled,
      scrollToBottom,
      isScrolling: autoScrollingRef.current,
      scrollTriggered: scrollTriggeredRef.current,
      newMessageAdded,
      setNewMessageAdded,
      prevChildrenCountRef,
    },
  ]
}
