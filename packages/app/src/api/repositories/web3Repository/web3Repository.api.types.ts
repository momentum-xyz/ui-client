/** Mint NFT */

export interface MintNftRequest {
  name: string;
  image: string;
  block_hash: string;
  wallet: string;
}

export interface MintNftResponse {
  job_id: string;
}

export interface MintNftCheckJobRequest {
  job_id: string;
}

export interface MintNftCheckJobResponse {
  status: string;
  nodeJSOut: {
    data: {
      userID: string;
    };
  };
}

/** RESOLVE NODE **/

export interface ResolveNodeRequest {
  object: string;
}

export interface ResolveNodeResponse {
  domain: string;
  node_id: string;
}
