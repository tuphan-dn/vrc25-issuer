'use client'
import { useEffect, useMemo } from 'react'
import { formatEther, isAddress } from 'viem'
import { useContractRead, useToken } from 'wagmi'

import Island from '@/components/island'
import Faucet from './faucet'
import Apply from './apply'
import Charge from './charge'

import { numeric } from '@/helpers/utils'
import { usePushMessage } from '@/components/message/store'
import {
  useTokenAddress,
  useVRC25IssuerContract,
} from '@/providers/issuer.provider'

export default function App() {
  const { tokenAddress, setTokenAddress } = useTokenAddress()
  const pushMessage = usePushMessage()
  const vrc25Issuer = useVRC25IssuerContract()

  const {
    data: sponsor,
    isLoading,
    error,
  } = useContractRead<typeof vrc25Issuer.abi, 'getTokenCapacity', bigint>({
    address: vrc25Issuer.address,
    abi: vrc25Issuer.abi,
    functionName: 'getTokenCapacity',
    args: [tokenAddress],
    enabled: isAddress(tokenAddress),
    watch: true,
  })

  const { data: token } = useToken({
    address: isAddress(tokenAddress) ? tokenAddress : undefined,
  })

  const initialized = useMemo(
    () => sponsor && sponsor > global.BigInt(0),
    [sponsor],
  )

  useEffect(() => {
    if (error && isAddress(tokenAddress))
      pushMessage('alert-error', error.message.split('\n').at(0) || '')
  }, [error, tokenAddress, pushMessage])

  return (
    <Island>
      <div className="flex flex-col gap-4 items-center">
        <div className="max-w-[512px] w-full">
          <Faucet />
        </div>
        <div className="max-w-[512px] w-full card rounded-box bg-base-200 p-4 grid grid-cols-12 gap-4 shadow-xl">
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
                {numeric(formatEther(sponsor || 0n)).format('0,0.[000000]')} VIC
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
    </Island>
  )
}
