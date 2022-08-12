import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';

import POOL_ABI from '../../contracts/Pool.json';
import { getAddress, getProviderByChainId } from '../../util';

export default async (req, res) => {
  const {
    body: { proof, args, chainId },
  } = req;
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      await getProviderByChainId(chainId)
    );

    const signer = new ethers.Wallet(process.env.WALLET, provider);

    const contract = new Contract(getAddress(chainId), POOL_ABI, signer);

    const maxFeePerGas = ethers.utils.parseUnits(60 + '', 'gwei');
    const maxPriorityFeePerGas = ethers.utils.parseUnits(57 + '', 'gwei');

    const tx = await contract.winning(
      proof,
      ...[...args.slice(2, 7), args[0]],
      {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit: 10000000,
      }
    );
    const txReciept = await tx.wait();
    res.json(txReciept);
  } catch (err) {
    res.json(err);
  }
};
