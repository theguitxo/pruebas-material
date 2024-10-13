export interface TokenInfo {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface TokenStored {
  token: TokenInfo;
  time: number;
}

export interface TokenCheckInfo {
  isOk: boolean;
  token?: string;
}
