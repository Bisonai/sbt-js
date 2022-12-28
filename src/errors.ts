export enum SbtErrorCode {
  DeploySbtError = 10000,
  MintSbtError,
  GetTokenUriError,
  OwnerOfError,
  UpdateBaseUriError,
  SendKlayRewardError
}

export class SbtError extends Error {
  constructor(public readonly code: SbtErrorCode, message?: string, public readonly value?: any) {
    super(message)
    this.name = SbtErrorCode[code]
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
