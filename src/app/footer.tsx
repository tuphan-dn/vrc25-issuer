'use client'

import { Moon, Sun, Twitter } from 'lucide-react'

import { useTheme } from '@/providers/ui.provider'

import LOGO from '@/static/images/logo.jpg'

export default function Footer() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-row gap-2 p-4 bg-base-100 items-center border-t-2 border-t-base-300">
      <Twitter className="h-4 w-4 fill-current" />
      <a
        className="text-sm font-bold opacity-60"
        href="https://twitter.com/phan_sontu"
        target="_blank"
        rel="noreferrer"
      >
        @phan_sontu
      </a>
      <span className="divider divider-horizontal m-0" />
      <div className="avatar">
        <div className="w-6 h-6 rounded-full">
          <img src={LOGO.src} alt="logo" />
        </div>
      </div>
      <a
        className="text-sm font-bold opacity-60"
        href="https://twitter.com/BuildOnViction"
        target="_blank"
        rel="noreferrer"
      >
        #BuildOnViction
      </a>
      <div className="flex-auto" />
      <button
        className="btn btn-ghos btn-circle btn-sm"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')}
            checked={theme === 'dark'}
          />
          <p className="swap-on">
            <Moon className="w-5 h-5" />
          </p>
          <p className="swap-off">
            <Sun className="w-5 h-5" />
          </p>
        </label>
      </button>
    </div>
  )
}
