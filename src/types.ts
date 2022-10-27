import { SmartContractDeploy, SmartContractExecution, ValueTransfer } from 'caver-js'

export type Transaction = SmartContractDeploy | SmartContractExecution | ValueTransfer

export enum Network {
  localhost = 'localhost',
  baobab = 'baobab',
  cypress = 'cypress'
}
