import { SmartContractDeploy, SmartContractExecution, ValueTransfer } from 'caver-js'

export type Transaction = SmartContractDeploy | SmartContractExecution | ValueTransfer

export interface Keyring {
  address: string
  privateKey: string
}

export enum Network {
  localhost = 'localhost',
  baobab = 'baobab',
  cypress = 'cypress'
}
