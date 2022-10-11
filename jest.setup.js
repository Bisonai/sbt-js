const dotenv = require('dotenv')
const ethers = require('ethers')

dotenv.config()

// Baobab 
// const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)

const wallet = new ethers.Wallet(process.env.privateKey)
const wallet1 = new ethers.Wallet(process.env.privateKey1)

global.Wallet = wallet
global.Wallet1 = wallet1
