'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatEther, isAddress, parseEther } from 'viem'
import { useContractRead, useContractWrite, useNetwork, useToken } from 'wagmi'

import walletConfig from '@/configs/wallet.config'
import { numeric } from '@/helpers/utils'
import { usePushMessage } from '@/components/message/store'
import Faucet from './faucet'
import Island from '@/components/island'

function Apply({
  tokenAddress,
  disabled = false,
  loading = false,
}: {
  tokenAddress: string
  disabled?: boolean
  loading?: boolean
}) {
  const { write } = useContractWrite({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'apply',
  })

  const onApply = useCallback(() => {
    if (!isAddress(tokenAddress)) return
    return write({
      args: [tokenAddress],
      value: parseEther('10'),
    })
  }, [tokenAddress, write])

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={disabled || loading || !isAddress(tokenAddress)}
      onClick={onApply}
    >
      {loading && <span className="divider divider-spinner divider-sm" />}
      Apply
    </button>
  )
}

function Charge({
  tokenAddress,
  disabled = false,
  loading = false,
}: {
  tokenAddress: string
  disabled?: boolean
  loading?: boolean
}) {
  const { write } = useContractWrite({
    address: walletConfig.vrc25Issuer.address,
    abi: walletConfig.vrc25Issuer.abi,
    functionName: 'apply',
  })

  const onCharge = useCallback(() => {
    if (!isAddress(tokenAddress)) return
    return write({
      args: [tokenAddress],
      value: parseEther('10'),
    })
  }, [tokenAddress, write])

  return (
    <button
      className="btn btn-primary btn-block"
      disabled={disabled || loading || !isAddress(tokenAddress)}
      onClick={onCharge}
    >
      {loading && <span className="divider divider-spinner divider-sm" />}Top Up
    </button>
  )
}

export default function App() {
  const [tokenAddress, setTokenAddress] = useState('')
  const pushMessage = usePushMessage()
  const { chain } = useNetwork()

  const {
    data: sponsor,
    isLoading,
    error,
  } = useContractRead<
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

  const { data: token } = useToken({
    address: isAddress(tokenAddress) ? tokenAddress : undefined,
  })

  const initialized = useMemo(
    () => sponsor && sponsor > global.BigInt(0),
    [sponsor],
  )

  const isTestnet = useMemo(() => chain?.id === 89, [chain])

  useEffect(() => {
    if (error && isAddress(tokenAddress))
      pushMessage('alert-error', error.message)
  }, [error, tokenAddress, pushMessage])

  return (
    <div className="flex flex-col gap-4 items-center">
      <Island>
        {isTestnet && (
          <div className="max-w-[512px] w-full">
            <Faucet />
          </div>
        )}
      </Island>
      <div className="max-w-[512px] w-full card rounded-box bg-base-200 p-4 grid grid-cols-12 gap-4">
        <h5 className="col-span-full">VRC25 Issuer</h5>
        <div className="col-span-full card bg-base-100 p-4 grig grid-cols-12 gap-2">
          <p className="text-sm font-bold opacity-60 px-4 pt-4">
            Token Address
          </p>
          <input
            className="col-span-full input focus:border-none focus:outline-none"
            placeholder="0x12887ab..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <div className="col-span-full flex flex-row gap-2 px-4">
            {token && (
              <span className="badge badge-primary badge-lg font-bold">
                {token.name}
              </span>
            )}
            {token && (
              <span className="badge badge-primary badge-lg font-bold">
                {token.symbol}
              </span>
            )}
          </div>
          <div className="col-span-full flex flex-row gap-2 p-4 items-baseline">
            <p className="text-sm font-bold opacity-60 flex-auto">
              Sponsor Balance
            </p>
            <h4>
              {numeric(formatEther(sponsor || 0n)).format('0,0.[0000]')} VIC
            </h4>
          </div>
        </div>
        <div className="col-span-full flex flex-row justify-center">
          {initialized ? (
            <Charge
              tokenAddress={tokenAddress}
              loading={isLoading}
              disabled={typeof sponsor === 'undefined'}
            />
          ) : (
            <Apply
              tokenAddress={tokenAddress}
              loading={isLoading}
              disabled={typeof sponsor === 'undefined' || !token}
            />
          )}
        </div>
      </div>
    </div>
  )
}
