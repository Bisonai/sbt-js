const dotenv = require('dotenv')
const ethers = require('ethers')

dotenv.config()

let wallet0, wallet1
if (process.env.RUNNING_NETWORK == 'baobab') {
  // Baobab
  wallet0 = ethers.Wallet.fromMnemonic(process.env.MNEMONIC0)
  wallet1 = ethers.Wallet.fromMnemonic(process.env.MNEMONIC1)
} else {
  // klaytnDevSandBox Localhost
  wallet0 = new ethers.Wallet(process.env.PRIVATEKEY0)
  wallet1 = new ethers.Wallet(process.env.PRIVATEKEY1)
}
global.Wallet0 = wallet0
global.Wallet1 = wallet1
