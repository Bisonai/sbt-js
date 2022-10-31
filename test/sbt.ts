import { assert } from 'chai'
import { ethers } from 'ethers'
import { SBT, Network } from '../src/index'
import { SbtErrorCode, SbtError } from '../src/errors'

const dotenv = require('dotenv')
dotenv.config()

let sbt: SBT
let sbtAddress

const tokenId = 0
let baseUri = 'https://bisonai.com/'
let logger

class Accounts {
  public privateKey0
  public accountAdr0

  public privateKey1
  public accountAdr1
}

const ACCOUNTS = new Accounts()

describe('SBT', () => {
  beforeEach(async () => {
    if (process.env.TEST_LOGGER) {
      logger = console.log
    } else {
      logger = function (arg: string) {}
    }
    const network = process.env.TEST_NETWORK || Network.localhost
    if (network == Network.localhost) {
      // We recommend using ganache with -d option to generate
      // accounts in a deterministic way. Following accounts are
      // prefunded by ganache.

      // account 0
      ACCOUNTS.privateKey0 = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
      ACCOUNTS.accountAdr0 = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'

      // account 1
      ACCOUNTS.privateKey1 = '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1'
      ACCOUNTS.accountAdr1 = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
    } else {
      if (process.env.MNEMONIC0 && process.env.MNEMONIC1) {
        const wallet0 = ethers.Wallet.fromMnemonic(process.env.MNEMONIC0)
        ACCOUNTS.privateKey0 = wallet0.privateKey
        ACCOUNTS.accountAdr0 = wallet0.address

        const wallet1 = ethers.Wallet.fromMnemonic(process.env.MNEMONIC1)
        ACCOUNTS.privateKey1 = wallet1.privateKey
        ACCOUNTS.accountAdr1 = wallet1.address
      } else {
        console.error('Environment variable MNEMONIC0 or MNEMONIC1 was not setup!')
        process.exit(1)
      }
    }

    sbt = new SBT(network, ACCOUNTS.privateKey0, logger)
  })

  it('#1 Deploy SBT', async function () {
    const contract = await sbt.deploy({ name: 'SBT', symbol: 'SBT', baseUri })
    logger('sbt-test:deploy:contract', contract)
    sbtAddress = contract.address
  })

  it('#2 Mint SBT', async function () {
    logger('sbt-test:mint:ACCOUNTS.accountAdr0', ACCOUNTS.accountAdr0)
    const txReceipt = await sbt.mint({ sbtAddress, userAddress: ACCOUNTS.accountAdr0, tokenId })
    logger('sbt-test:mint:txReceipt', txReceipt)
  })

  it('#3 Get tokenURI', async function () {
    const tokenUri = await sbt.getTokenUri({ sbtAddress, tokenId })
    logger('sbt-test:getTokenUri:tokenUri', tokenUri)
    assert.equal(tokenUri, baseUri + tokenId.toString())
  })

  it('#4 Get tokenURI should fail with invalid ID', async function () {
    expect(async () => await sbt.getTokenUri({ sbtAddress, tokenId: 100 })).rejects.toThrow()
  })

  it('#5 updateBaseUri should pass', async function () {
    const newBaseUri = 'http://localhost/'
    await sbt.updateBaseUri({ sbtAddress, baseUri: newBaseUri })
    let tokenUri = await sbt.getTokenUri({ sbtAddress, tokenId })
    logger('sbt-test:updateBaseUri:tokenUri', tokenUri)
    assert.equal(tokenUri, newBaseUri + tokenId.toString())

    await sbt.updateBaseUri({ sbtAddress, baseUri })
    tokenUri = await sbt.getTokenUri({ sbtAddress, tokenId })
    logger('sbt-test:updateBaseUri:tokenUri', tokenUri)
    assert.equal(tokenUri, baseUri + tokenId.toString())
  })

  it('#6 sendKlayReward', async function () {
    const tokenAmount = '11'
    logger('sbt-test:sendKlayReward:ACCOUNTS.accountAdr1', ACCOUNTS.accountAdr1)
    const txReceipt = await sbt.sendKlayReward({ userAddress: ACCOUNTS.accountAdr1, tokenAmount })
    logger('sbt-test:sendKlayReward:txReceipt:', txReceipt)
  })
})
