'use client'
import { useEffect, useMemo, useState } from 'react'
import { isAddress } from 'viem'
import { useContractRead, useContractWrite } from 'wagmi'
import { BN } from 'bn.js'

import walletConfig from '@/configs/wallet.config'
import { undecimalize } from '@/helpers/decimals'
import { numeric } from '@/helpers/utils'
import { usePushMessage } from '@/components/message/store'

function Apply({
  disabled = false,
  loading = false,
}: {
  disabled?: boolean
  loading?: boolean
}) {
  const { write } = useContractWrite({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'apply',
  })

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={disabled || loading}
      onClick={() => write()}
    >
      {loading && <span className="divider divider-spinner divider-sm" />}
      Apply
    </button>
  )
}

function Charge({
  disabled = false,
  loading = false,
}: {
  disabled?: boolean
  loading?: boolean
}) {
  const { write } = useContractWrite({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'apply',
  })

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={disabled || loading}
      onClick={() => write()}
    >
      {loading && <span className="divider divider-spinner divider-sm" />}Top Up
    </button>
  )
}

export default function App() {
  const [tokenAddress, setTokenAddress] = useState('')
  const pushMessage = usePushMessage()

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

  useEffect(() => {
    if (error) pushMessage('alert-error', error.message)
  }, [error, pushMessage])

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
            <h4>{numeric(balance).format('0,0.[0000]')} VIC</h4>
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
