import POOL_ABI from '../contracts/Pool.json';
import type { Pool } from '../contracts/types';
import useContract from './useContract';
import { useWeb3React } from '@web3-react/core';
import { getAddress } from '../util';

export default function useZKPoolContract() {
  return useContract<Pool>(POOL_ABI);
}
