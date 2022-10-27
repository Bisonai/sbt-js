import { ethers, Contract } from 'ethers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { SBT__factory } from '@bisonai/sbt-contracts'
import { Network } from './types'
import { SbtErrorCode, SbtError } from './errors'
import { SETTINGS } from './constants'

export class SBT {
  private wallet

  constructor(network: Network | string, privateKey: string) {
    console.debug('sbt-js:constructor')

    const settings = SETTINGS[network]
    console.debug('sbt-js:constructor:settings:', settings)

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
    const sbtContract = new ethers.ContractFactory(
      SBT__factory.abi,
      SBT__factory.bytecode,
      this.wallet
    )
    console.debug(sbtContract)

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
    console.debug('sbt-js:mintSbt')
    console.debug('sbt-js:mintSbt:userAddress:', userAddress)

    try {
      const sbtContract = this.fetchSbtContract(sbtAddress)
      return await sbtContract.safeMint(userAddress, tokenId)
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
    console.debug('sbt-js:getTokenUri')
    console.debug('sbt-js:getTokenUri:sbtAddress:', sbtAddress)
    console.debug('sbt-js:getTokenUri:tokenId:', tokenId)

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
  }): Promise<string> {
    console.debug('sbt-js:updateBaseURI')
    console.debug('sbt-js:updateBaseURI:sbtAddress:', sbtAddress)

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
    console.debug('sbt-js:sendKlayReward')
    console.debug('sbt-js:sendKlayReward:userAddress:', userAddress)
    console.debug('sbt-js:sendKlayReward:tokenAmount:', tokenAmount)

    try {
      return this.wallet.sendTransaction({
        to: userAddress,
        value: tokenAmount
      })
    } catch (err) {
      throw new SbtError(SbtErrorCode.SendKlayRewardError, err)
    }
  }
}
