'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export function useSessionActivity() {
  const pathname = usePathname()

  const updateActivity = useCallback(async () => {
    try {
      await fetch('/api/admin/update-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Failed to update activity:', error)
    }
  }, [])

  useEffect(() => {
    // Update activity saat halaman berubah
    updateActivity()

    // Update activity setiap 5 menit (jika masih aktif)
    const interval = setInterval(() => {
      updateActivity()
    }, 5 * 60 * 1000) // 5 menit

    // Update activity saat user berinteraksi
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    const handleUserActivity = () => {
      updateActivity()
    }
    
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity)
    })

    return () => {
      clearInterval(interval)
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
      })
    }
  }, [updateActivity, pathname])
}