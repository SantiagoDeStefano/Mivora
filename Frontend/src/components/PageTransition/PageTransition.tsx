import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface Props {
  children?: React.ReactNode
  className?: string
}

// Slide-up page transition that re-triggers when the route path changes.
export default function PageTransition({ children, className = '' }: Props) {
  const [mounted, setMounted] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // restart animation on every pathname change
    setMounted(false)
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <div
      className={`transform-gpu transition-transform transition-opacity duration-500 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  )
}
