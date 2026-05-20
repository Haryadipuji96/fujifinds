'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type AdminTheme = 'dark' | 'light'

interface AdminThemeContextType {
  adminTheme: AdminTheme
  setAdminTheme: (theme: AdminTheme) => void
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [adminTheme, setAdminThemeState] = useState<AdminTheme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Ambil theme admin dari localStorage (terpisah dari theme frontend)
    const stored = localStorage.getItem('admin_theme') as AdminTheme | null
    
    if (stored === 'light') {
      setAdminThemeState('light')
      document.documentElement.classList.add('admin-light')
      document.documentElement.classList.remove('admin-dark')
    } else {
      setAdminThemeState('dark')
      document.documentElement.classList.add('admin-dark')
      document.documentElement.classList.remove('admin-light')
    }
  }, [])

  const setAdminTheme = (newTheme: AdminTheme) => {
    setAdminThemeState(newTheme)
    localStorage.setItem('admin_theme', newTheme)
    
    // Hapus kedua class dulu
    document.documentElement.classList.remove('admin-light', 'admin-dark')
    
    // Tambah class yang sesuai
    if (newTheme === 'dark') {
      document.documentElement.classList.add('admin-dark')
    } else {
      document.documentElement.classList.add('admin-light')
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AdminThemeContext.Provider value={{ adminTheme, setAdminTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext)
  if (!context) {
    return { adminTheme: 'dark' as AdminTheme, setAdminTheme: () => {} }
  }
  return context
}