import dotenv from 'dotenv'
import { ethers } from 'ethers'

dotenv.config()

// Baobab 
// const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)

// Local 
const wallet = new ethers.Wallet("0x2117626e32fafba4f3239ffe2d2ea6c4fb0f13b999b33b00824d94d46cdc26cb")
const wallet1 = new ethers.Wallet("0x8903071ac0266bec806bae591a093c1e0968d53c20179f9a8e795453c3179077")
global.Wallet = wallet
global.Wallet1 = wallet1
