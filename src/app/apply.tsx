'use client'
import { useCallback } from 'react'
import { isAddress, parseEther } from 'viem'
import { useContractWrite, useNetwork } from 'wagmi'

import { useVRC25IssuerContract } from '@/providers/issuer.provider'
import { usePushMessage } from '@/components/message/store'

export default function Apply({
  tokenAddress,
  disabled = false,
  loading = false,
}: {
  tokenAddress: string
  disabled?: boolean
  loading?: boolean
}) {
  const pushMessage = usePushMessage()
  const { chain: { blockExplorers } = {} } = useNetwork()
  const vrc25Issuer = useVRC25IssuerContract()

  const { write } = useContractWrite({
    address: vrc25Issuer.address,
    abi: vrc25Issuer.abi,
    functionName: 'apply',
    onSuccess: ({ hash }) => {
      return pushMessage(
        'alert-success',
        `You have applied to gasless mechanism with 10 VIC. Click here to view the transaction on the scan!`,
        {
          onClick: () =>
            window.open(`${blockExplorers?.default.url}/tx/${hash}`, '_blank'),
        },
      )
    },
    onError: (er) => {
      return pushMessage('alert-error', er.message.split('\n').at(0) || '')
    },
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
      {loading && <span className="loading loading-spinner loading-sm" />}
      Apply
    </button>
  )
}
