'use client'

import { ChevronRight } from 'lucide-react'

export default function Faucet() {
  return (
    <div className="card rounded-box cursor-pointer grid grid-cols-12 gap-4 group bg-[url('/panel.jpeg')] bg-center bg-cover">
      <a
        className="col-span-full rounded-box grid grid-cols-12 gap-4 p-4 transition-all backdrop-blur-md"
        href="https://faucet.testnet.tomochain.com/"
        target="_blank"
        rel="noreferrer"
      >
        <p className="col-span-full text-slate-100 font-semibold">
          You are on Viction Testnet. You can click here to faucet VIC for
          testing.
        </p>
        <div className="col-span-12 flex flex-row gap-2 justify-end group-hover:translate-x-1 transition-all">
          <ChevronRight className="h-5 w-5 text-slate-100" />
        </div>
      </a>
    </div>
  )
}
