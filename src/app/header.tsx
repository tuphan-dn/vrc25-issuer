'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

import LOGO from '@/static/images/logo.jpg'

export default function Header() {
  return (
    <div className="flex flex-row gap-4 p-4 bg-base-100 items-center">
      <div className="flex-auto">
        <a className="avatar" href="/">
          <div className="w-8 h-8 mask mask-squircle">
            <img src={LOGO.src} alt="logo" />
          </div>
        </a>
      </div>
      <ConnectButton />
    </div>
  )
}
