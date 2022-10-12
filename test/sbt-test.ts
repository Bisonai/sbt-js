import { SBT, Network } from '../src/index'
import { SETTINGS } from '../src/constants'
import { assert, expect } from 'chai'

let sbt: SBT
let sbtContractAddress = SETTINGS.baobab.SBT_CONTRACT_ADDRESS
const baseURI = 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/'
const tokenID = 0

describe('SBT', () => {
  beforeEach(async () => {
    const wallet = global.Wallet
    console.log('Wallet:', wallet)
    const privateKey = await wallet._signingKey()
    console.log('SignedKey', privateKey)
    console.log('Private_Key: privateKey', privateKey.privateKey)
    sbt = new SBT(Network.baobab, privateKey.privateKey)
    console.log('sbt')
  })

  it('#1 Deloy SBT', async function () {
    const sbtName = 'SBT'
    const sbtSymbol = 'SBT'
    const deployedSBT = await sbt.deploy(sbtName, sbtSymbol, baseURI)
    console.log('Deployed SBT:', deployedSBT)
    console.log('Deployed SBT address:', deployedSBT._address)
    sbtContractAddress = deployedSBT._address
  })

  it('#2 Mint SBT', async function () {
    let wallet = global.Wallet
    const userAddress = wallet.address
    console.log('sbt-test:UserAddress', userAddress)
    let tx = await sbt.mint(sbtContractAddress, userAddress, tokenID)
    console.log(tx)
  })

  it('#3 Get tokenURI', async function () {
    let tokenUri = await sbt.getTokenUri(sbtContractAddress, tokenID)
    console.log('sbt-test:TokenUri', tokenUri)
    assert.equal(tokenUri, baseURI + tokenID.toString())
  })

  it('#4 Get tokenURI should fail with invalid ID', async function () {
    let invalidId = -1
    try {
      await sbt.getTokenUri(sbtContractAddress, invalidId)
    } catch (error) {
      console.log('Error:', error)
    }
  })

  it('#5 send Klay Reward', async function () {
    const userAddress = global.Wallet1.address
    const tokenAmount = '11'
    console.log('sbt-test:UserAddress', userAddress)
    let tx = await sbt.sendKlayReward(userAddress, tokenAmount)
    console.log('sbt-test:sendKlayReward:tx:', tx)
  })
})
