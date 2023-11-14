import { Env, env } from './env'
import VRC25Issuer from '@/static/abi/VRC25Issuer.json'

/**
 * Contructor
 */
type Conf = {
  walletConnectId: string
  vrc25Issuer: {
    address: `0x${string}`
    abi: typeof VRC25Issuer
  }
}

const conf: Record<Env, Conf> = {
  /**
   * Development configurations
   */
  development: {
    walletConnectId: '3d5c635fdf7dfe407aab9f35ab943bf2',
    vrc25Issuer: {
      address: '0x0E2C88753131CE01c7551B726b28BFD04e44003F',
      abi: VRC25Issuer,
    },
  },

  /**
   * Production configurations
   */
  production: {
    walletConnectId: '3d5c635fdf7dfe407aab9f35ab943bf2',
    vrc25Issuer: {
      address: '0x8c0faeb5c6bed2129b8674f262fd45c4e9468bee',
      abi: VRC25Issuer,
    },
  },
}

/**
 * Module exports
 */
export default conf[env]
