'use client'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { isAddress, parseEther } from 'viem'
import { useAccount, useBalance, useContractWrite, useNetwork } from 'wagmi'

import Modal from '@/components/modal'

import { usePushMessage } from '@/components/message/store'
import { useVRC25IssuerContract } from '@/providers/issuer.provider'

export default function Charge({
  tokenAddress,
  disabled = false,
  loading = false,
}: {
  tokenAddress: string
  disabled?: boolean
  loading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const { chain: { blockExplorers } = {} } = useNetwork()
  const { data: { formatted: balance } = {} } = useBalance({ address })
  const pushMessage = usePushMessage()
  const vrc25Issuer = useVRC25IssuerContract()

  const { write, isLoading } = useContractWrite({
    address: vrc25Issuer.address,
    abi: vrc25Issuer.abi,
    functionName: 'charge',
    onSuccess: ({ hash }) => {
      setOpen(false)
      return pushMessage(
        'alert-success',
        `You have topped up the sponsor balance ${amount} VIC more. Click here to view the transaction on the scan!`,
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

  const onCharge = useCallback(() => {
    if (!isAddress(tokenAddress) || !Number(amount)) return
    return write({
      args: [tokenAddress],
      value: parseEther(amount),
    })
  }, [tokenAddress, write, amount])

  const onMax = useCallback(() => setAmount(balance || ''), [balance])

  useEffect(() => {
    if (!open) setAmount('')
  }, [open])

  return (
    <Fragment>
      <button
        className="btn btn-primary btn-block"
        onClick={() => setOpen(true)}
      >
        Top Up
      </button>
      <Modal open={open} onCancel={() => setOpen(false)}>
        <div className="grid grid-cols-12 gap-4">
          <h5 className="col-span-full">Top Up the Sponsor Balance</h5>
          <div className="col-span-full card bg-base-200 rounded-box p-4 grid grid-cols-12 gap-2">
            <p className="col-span-full font-bold text-sm opacity-60 px-4 pt-2">
              Amount
            </p>
            <div className="col-span-full flex flex-row items-center relative">
              <input
                className="w-full input bg-base-200 focus:border-none focus:outline-none pr-20 text-xl font-bold"
                placeholder="10"
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                className="btn btn-sm btn-primary absolute right-2"
                onClick={onMax}
              >
                MAX
              </button>
            </div>
          </div>
          <button
            className="col-span-full btn btn-primary"
            disabled={
              disabled ||
              loading ||
              !isAddress(tokenAddress) ||
              !Number(amount) ||
              isLoading
            }
            onClick={onCharge}
          >
            {(loading || isLoading) && (
              <span className="loading loading-spinner loading-sm" />
            )}
            Confirm
          </button>
        </div>
      </Modal>
    </Fragment>
  )
}
