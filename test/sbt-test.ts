import { SBT, Network } from '../src/index'
import { assert } from 'chai'

let sbt: SBT
let sbtContractAddress = global.SBT_CONTRACT_ADDRESS
const baseURI = 'ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/'
const tokenID = 0

describe('SBT', () => {
  beforeEach(async () => {
    const wallet = global.Wallet0
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
    let wallet = global.Wallet0
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

  it('#5 updateBaseUri should pass', async function () {
    const newBaseUri = 'http://localhost/'
    try {
      await sbt.updateBaseUri(sbtContractAddress, newBaseUri)
    } catch (error) {
      console.log('Error:', error)
    }
    let tokenUri = await sbt.getTokenUri(sbtContractAddress, tokenID)
    console.log('sbt-test:updateBaseUri:tokeUri', tokenUri)
    assert.equal(tokenUri, newBaseUri + tokenID.toString())

    try {
      await sbt.updateBaseUri(sbtContractAddress, baseURI)
    } catch (error) {
      console.log('Error:', error)
    }
    tokenUri = await sbt.getTokenUri(sbtContractAddress, tokenID)
    assert.equal(tokenUri, baseURI + tokenID.toString())
  })

  it('#6 send Klay Reward', async function () {
    const userAddress = global.Wallet1.address
    const tokenAmount = '11'
    console.log('sbt-test:UserAddress', userAddress)
    let tx = await sbt.sendKlayReward(userAddress, tokenAmount)
    console.log('sbt-test:sendKlayReward:tx:', tx)
  })
})
