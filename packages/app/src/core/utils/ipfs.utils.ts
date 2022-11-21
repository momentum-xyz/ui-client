import * as isIPFS from 'is-ipfs';

export const isIpfsHash = (value: string): boolean => isIPFS.cid(value);

export const fetchIpfs = async (ipfsHash: string): Promise<string | null> => {
  const res = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);

  const ipfsResponse = res.status >= 200 && res.status < 300 ? await res.text() : null;

  return ipfsResponse;
};
