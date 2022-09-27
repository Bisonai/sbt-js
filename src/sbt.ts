const Caver = require('caver-js')
import { TransactionReceipt, Contract } from 'caver-js'
import { SETTINGS } from './constants'
import { Network, Keyring, Transaction } from './types'
import { SBT__factory } from '@bisonai/sbt-contracts'
import { SbtErrorCode, SbtError } from './errors'

export class SBT {
  private caver: typeof Caver
  private keyring: Keyring

  constructor(network: Network, privateKey: string) {
    console.log('sbt-js:constructor')

    const settings = SETTINGS[network]
    console.log('sbt-js:constructor:settings:', settings)

    this.caver = new Caver(settings.RPC_ENDPOINT)
    this.keyring = this.caver.wallet.keyring.createFromPrivateKey(privateKey)
    this.caver.wallet.add(this.keyring)
    console.log('sbt-js:constructor:keyring:', this.caver.wallet.getKeyring(this.keyring.address))
  }

  private buildSbtContract(sbtAddress: string): Contract {
    return new this.caver.contract(SBT__factory.abi, sbtAddress)
  }

  private async signAndSendTransaction(tx: Transaction): Promise<TransactionReceipt> {
    await this.caver.wallet.sign(this.keyring.address, tx)
    const rlpEncodedTransaction = tx.getRLPEncoding()
    console.log('sbt-js:signAdnExecute:rlpEncodedTransaction:', rlpEncodedTransaction)
    return this.caver.rpc.klay.sendRawTransaction(rlpEncodedTransaction)
  }

  public async deploySbt(
    name: string,
    symbol: string,
    baseUri: string
  ): Promise<TransactionReceipt> {
    const params = [name, symbol, baseUri]

    const sbtContract = this.caver.contract.create(SBT__factory.abi)
    const sbtContractDeploy = sbtContract.deploy(SBT__factory.bytecode, params)
    const gasEstimate = sbtContractDeploy.estimateGas()
    return sbtContractDeploy.send({
      from: this.keyring.address,
      gas: gasEstimate
    })
  }

  public async mintSbt(
    sbtAddress: string,
    userAddress: string,
    tokenUri: string
  ): Promise<TransactionReceipt> {
    console.log('sbt-js:mintSbt')
    console.log('sbt-js:mintSbt:userAddress:', userAddress)

    const sbtContract = this.buildSbtContract(sbtAddress)

    try {
      const params = [userAddress, tokenUri]
      const input = this.caver.abi.encodeFunctionCall(SBT__factory.abi, params)
      const gasAmount = await sbtContract.methods.safeMint(...params).estimateGas() // FIXME change name

      const tx = this.caver.transaction.smartContractExecution.create({
        from: this.keyring.address,
        to: sbtAddress,
        gas: gasAmount,
        input: input
      })
      return this.signAndSendTransaction(tx)
    } catch (error) {
      console.error(error)
      throw new SbtError(SbtErrorCode.MintSbtError, 'SBT minting failed')
    }
  }

  public async getTokenUri(sbtAddress: string, tokenId: string): Promise<string> {
    console.log('sbt-js:getTokenUri')
    console.log('sbt-js:getTokenUri:sbtAddress:', sbtAddress)
    console.log('sbt-js:getTokenUri:tokenId:', tokenId)

    const sbtContract = this.buildSbtContract(sbtAddress)
    try {
      return sbtContract.methods.tokenURI(tokenId).call({ from: this.keyring.address })
    } catch (error) {
      console.error(error)
      throw new SbtError(SbtErrorCode.GetTokenUriError, 'Fetching tokenURI failed')
    }
  }

  public async sendKlayReward(
    userAddress: string,
    tokenAmount: string
  ): Promise<TransactionReceipt> {
    console.log('sbt-js:sendKlayReward')
    console.log('sbt-js:sendKlayReward:userAddress:', userAddress)
    console.log('sbt-js:sendKlayReward:tokenAmount:', tokenAmount)

    const tx = this.caver.transaction.valueTransfer.create({
      from: this.keyring.address,
      to: userAddress,
      value: tokenAmount,
      gas: 21000
    })
    return this.signAndSendTransaction(tx)
  }
}
