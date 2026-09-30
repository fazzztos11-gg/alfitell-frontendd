import { useState, useEffect } from 'react'

export function useDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('tema') === 'dark'
    })

    useEffect(() => {
        const root = document.documentElement
        if (darkMode) {
            root.setAttribute('data-theme', 'dark')
            localStorage.setItem('tema', 'dark')
        } else {
            root.removeAttribute('data-theme')
            localStorage.setItem('tema', 'light')
        }
    }, [darkMode])

    return [darkMode, setDarkMode]
}