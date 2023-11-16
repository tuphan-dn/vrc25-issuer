'use client'
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

import { ChevronRight } from 'lucide-react'

export default function Faucet() {
  const { chain } = useNetwork()
  const isTestnet = useMemo(() => chain?.id === 89, [chain])

  if (!isTestnet) return null
  return (
    <div className="card rounded-box cursor-pointer grid grid-cols-12 gap-4 group bg-[url('/panel.jpeg')] bg-center bg-cover">
      <a
        className="col-span-full rounded-box grid grid-cols-12 gap-4 p-4 transition-all backdrop-blur-md"
        href="https://faucet.testnet.tomochain.com/"
        target="_blank"
        rel="noreferrer"
      >
        <h5 className="text-slate-100">FAUCET</h5>
        <p className="col-span-full text-slate-100 font-semibold">
          You are on <span className="text-secondary">Viction Testnet</span>.
          You can click here to request free VIC from the Viction faucet for
          testing.
        </p>
        <div className="col-span-12 flex flex-row gap-2 justify-end group-hover:translate-x-1 transition-all">
          <ChevronRight className="h-5 w-5 text-slate-100" />
        </div>
      </a>
    </div>
  )
}
