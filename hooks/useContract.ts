import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { getAddress } from '../util';

export default function useContract<T extends Contract = Contract>(
  ABI: any
): T | null {
  const { library, account, chainId } = useWeb3React();
  const address = getAddress(chainId);
  return useMemo(() => {
    if (!address || !ABI || !library || !chainId) {
      return null;
    }

    try {
      return new Contract(address, ABI, library.getSigner(account));
    } catch (error) {
      console.error('Failed To Get Contract', error);

      return null;
    }
  }, [address, ABI, library, account]) as T;
}
