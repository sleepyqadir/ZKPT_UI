import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';

import POOL_ABI from '../../contracts/Pool.json';
import { getAddress } from '../../util';

export default async (req, res) => {
  const {
    body: { proof, args },
  } = req;
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-mainnet.g.alchemy.com/v2/ZtJ_Tilj4-DWyigjZhIdQImHwkaljIYi'
    );

    console.log({ provider });

    const signer = new ethers.Wallet(process.env.WALLET, provider);

    console.log({ signer });

    const contract = new Contract(getAddress(), POOL_ABI, signer);

    console.log(...[...args.slice(2, 7), args[0]]);

    const tx = await contract.winning(
      proof,
      ...[...args.slice(2, 7), args[0]],
      {}
    );
    const txReciept = await tx.wait();
    console.log({ txReciept });
    res.json(txReciept);
  } catch (err) {
    console.log({ err });
    res.json(err);
  }
};
