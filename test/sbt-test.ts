import { SBT, Network } from '../src/index'
import { expect } from "chai";

let sbt: SBT
let sbtContractAddress
		
describe('SBT', () => {
  beforeEach(async () => {
    let wallet = global.Wallet
    const privateKey = await wallet._signingKey().privateKey
    console.log("Private_Key: privateKey", privateKey)
    sbt = new SBT(Network.localhost, privateKey)
		console.log("sbt")
  })

  it('#1 Deloy SpBT', async function () {
		const sbtName = "SBT";
    const sbtSymbol = "SBT";
    const baseURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/";
    const deployedSBT = await sbt.deploySbt(sbtName, sbtSymbol, baseURI);
		console.log("Deployed SBT:", deployedSBT);
		console.log("Deployed SBT address:", deployedSBT._address);
		sbtContractAddress = deployedSBT._address
	})

  it('#2 Mint SBT', async function () {
		let wallet = global.Wallet
    const userAddress = wallet.address
		console.log("sbt-test:UserAddress", userAddress)
    let tx = await sbt.mintSbt(sbtContractAddress, userAddress)
		console.log(tx)
  })

  it('#3 Get tokenURI', async function () {
		let tokenUri = await sbt.getTokenUri(sbtContractAddress, "0")
		console.log("sbt-test:TokenUri", tokenUri)
	})
	
	// TODO
	// it('#4 Get tokenURI should fail with invalid ID', async function () {
	// 	let tokenUri = await sbt.getTokenUri(sbtContractAddress, "!*@(#AD").
	// 	await expect(
	// 		sbt.getTokenUri(sbtContractAddress, "!*@(#AD")
	// 		).to.be.reverted
	// })

  it('#4 send Klay Reward', async function () {
    const userAddress = global.Wallet1.address
		const tokenAmount = "11"
		console.log("sbt-test:UserAddress", userAddress)
    let tx = await sbt.sendKlayReward(userAddress, tokenAmount)
	})
})
