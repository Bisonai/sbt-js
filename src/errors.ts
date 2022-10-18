export enum SbtErrorCode {
  MintSbtError = 10000, // SBT minting failed
  GetTokenUriError, // Fetching tokenURI failed
  UpdateBaseUriError
}

export class SbtError extends Error {
  constructor(public readonly code: SbtErrorCode, message?: string, public readonly value?: any) {
    super(message)
    this.name = SbtErrorCode[code]
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
