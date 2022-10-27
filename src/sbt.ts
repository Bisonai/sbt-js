import { ethers, Contract } from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { SBT__factory } from '@bisonai/sbt-contracts'
import { Network } from './types'
import { SbtErrorCode, SbtError } from './errors'
import { SETTINGS } from './constants'

export class SBT {
  private wallet
  private logger

  constructor(network: Network | string, privateKey: string, logger?: (arg: string) => void) {
    this.logger = logger || ((arg: string) => arg)
    this.logger('sbt-js:constructor')

    const settings = SETTINGS[network]
    this.logger('sbt-js:constructor:settings:', settings)

    const provider = new ethers.providers.JsonRpcProvider(settings.RPC_ENDPOINT)
    this.wallet = new ethers.Wallet(privateKey, provider)
  }

  private fetchSbtContract(sbtAddress: string): Contract {
    return new ethers.Contract(sbtAddress, SBT__factory.abi, this.wallet)
  }

  public async deploy({
    name,
    symbol,
    baseUri
  }: {
    name: string
    symbol: string
    baseUri: string
  }): Promise<Contract> {
    this.logger('sbt-js:deploy:sbtContract')
    const sbtContract = new ethers.ContractFactory(
      SBT__factory.abi,
      SBT__factory.bytecode,
      this.wallet
    )
    this.logger('sbt-js:deploy:sbtContract:', sbtContract)

    try {
      const contract = await sbtContract.deploy(name, symbol, baseUri)
      await contract.deployed()
      return contract
    } catch (err) {
      throw new SbtError(SbtErrorCode.DeploySbtError, err)
    }
  }

  public async mint({
    sbtAddress,
    userAddress,
    tokenId
  }: {
    sbtAddress: string
    userAddress: string
    tokenId: number
  }): Promise<TransactionReceipt> {
    this.logger('sbt-js:mintSbt')
    this.logger('sbt-js:mintSbt:userAddress:', userAddress)

    try {
      const sbtContract = this.fetchSbtContract(sbtAddress)
      return (await sbtContract.safeMint(userAddress, tokenId)).wait()
    } catch (err) {
      throw new SbtError(SbtErrorCode.MintSbtError, err)
    }
  }

  public async getTokenUri({
    sbtAddress,
    tokenId
  }: {
    sbtAddress: string
    tokenId: number
  }): Promise<string> {
    this.logger('sbt-js:getTokenUri')
    this.logger('sbt-js:getTokenUri:sbtAddress:', sbtAddress)
    this.logger('sbt-js:getTokenUri:tokenId:', tokenId)

    try {
      const sbtContract = this.fetchSbtContract(sbtAddress)
      return await sbtContract.tokenURI(tokenId)
    } catch (err) {
      throw new SbtError(SbtErrorCode.GetTokenUriError, err)
    }
  }

  public async updateBaseUri({
    sbtAddress,
    baseUri
  }: {
    sbtAddress: string
    baseUri: string
  }): Promise<TransactionReceipt> {
    this.logger('sbt-js:updateBaseURI')
    this.logger('sbt-js:updateBaseURI:sbtAddress:', sbtAddress)

    try {
      const sbtContract = this.fetchSbtContract(sbtAddress)
      return (await sbtContract.updateBaseURI(baseUri)).wait()
    } catch (err) {
      throw new SbtError(SbtErrorCode.UpdateBaseUriError, err)
    }
  }

  public async sendKlayReward({
    userAddress,
    tokenAmount
  }: {
    userAddress: string
    tokenAmount: string
  }): Promise<TransactionReceipt> {
    this.logger('sbt-js:sendKlayReward')
    this.logger('sbt-js:sendKlayReward:userAddress:', userAddress)
    this.logger('sbt-js:sendKlayReward:tokenAmount:', tokenAmount)

    try {
      return (
        await this.wallet.sendTransaction({
          to: userAddress,
          value: tokenAmount
        })
      ).wait()
    } catch (err) {
      throw new SbtError(SbtErrorCode.SendKlayRewardError, err)
    }
  }
}
