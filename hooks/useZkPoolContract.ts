import POOL_ABI from '../contracts/Pool.json';
import type { Pool } from '../contracts/types';
import useContract from './useContract';

export default function useZKPoolContract(tokenAddress?: string) {
  return useContract<Pool>(tokenAddress, POOL_ABI);
}

