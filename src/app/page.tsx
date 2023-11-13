'use client'
import { useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { useContractRead, useContractWrite } from 'wagmi'
import { BN } from 'bn.js'

import walletConfig from '@/configs/wallet.config'
import { undecimalize } from '@/helpers/decimals'
import { numeric } from '@/helpers/utils'

export function Apply({
  disabled = false,
  loading = false,
}: {
  disabled?: boolean
  loading?: boolean
}) {
  const apply = useContractWrite({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'apply',
  })

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={disabled || loading}
    >
      {loading && <span className="divider divider-spinner divider-sm" />}
      Apply
    </button>
  )
}

export function Charge({
  disabled = false,
  loading = false,
}: {
  disabled?: boolean
  loading?: boolean
}) {
  const charge = useContractWrite({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'apply',
  })

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={disabled || loading}
    >
      {loading && <span className="divider divider-spinner divider-sm" />}Charge
    </button>
  )
}

export default function App() {
  const [tokenAddress, setTokenAddress] = useState('')

  const { data, isLoading, error } = useContractRead<
    typeof walletConfig.vrc25Issuer.abi,
    'getTokenCapacity',
    bigint
  >({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'getTokenCapacity',
    args: [tokenAddress],
    enabled: isAddress(tokenAddress),
  })

  const initialized = useMemo(() => data && data > global.BigInt(0), [data])

  const balance = useMemo(
    () => undecimalize(new BN(data?.toString() || '0'), 18),
    [data],
  )

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-[512px] w-full card border-base-300 rounded-box bg-base-200 p-4 grid grid-cols-12 gap-4">
        <h5 className="col-span-full">VRC25 Issuer</h5>
        <div className="col-span-full card bg-base-100 p-4">
          <input
            className="w-full input focus:border-none focus:outline-none"
            placeholder="Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <div className="flex flex-row gap-2 p-4 items-baseline">
            <p className="text-sm font-bold opacity-60 flex-auto">
              Current Balance
            </p>
            <h4>{numeric(balance).format('0,0.[0000]')}</h4>
          </div>
        </div>
        <div className="col-span-full flex flex-row justify-center">
          {initialized ? (
            <Charge
              loading={isLoading}
              disabled={!isAddress(tokenAddress) || !data}
            />
          ) : (
            <Apply
              loading={isLoading}
              disabled={!isAddress(tokenAddress) || !data}
            />
          )}
        </div>
      </div>
    </div>
  )
}
