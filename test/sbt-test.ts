import { SBT, Network } from '../src/index'

let sbt: SBT

describe('SBT', () => {
  beforeEach(async () => {
    const privateKey = ''
    sbt = SBT(Network.baobab, privateKey)
  })

  it('#1 Deploy SBT', async function () {})

  it('#2 Mint SBT', async function () {
    // const sbtAddress = ''
    // const userAddress = ''
    // sbt.mintSbt(sbtAddress, userAddress)
  })

  it('#3 Get tokenURI', async function () {})

  it('#4 send Klay Reward', async function () {})
})
