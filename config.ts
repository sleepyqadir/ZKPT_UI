export const networks = {
  1: 'Eth Mainnet',
  3: 'Robston',
  4: 'Rinkeby',
  5: 'Goerli',
  137: 'Polygon Mainnet',
  80001: 'Polygon Testnet',
  1666600000: 'Mainnet Harmony',
  1666900000: 'Devnet Harmony',
};

export const networksSwitchId = {
  1: '0x1',
  3: '0x3',
  4: '0x4',
  5: '0x5',
  137: '0x89',
  80001: '0x13881',
  1666600000: '0x63564C40',
  1666900000: '0x635AE020',
};

export const activeNetworks = {
  1: false,
  3: false,
  4: true,
  5: false,
  137: true,
  80001: true,
  1666600000: false,
  1666900000: false,
};

export const ETHERSCAN_PREFIXES = {
  4: 'https://rinkeby.etherscan.io/tx/',
  80001: 'https://mumbai.polygonscan.com/tx/',
  137: 'https://polygonscan.com/tx/',
};

export const providers = {
  137: 'https://polygon-mainnet.g.alchemy.com/v2/ZtJ_Tilj4-DWyigjZhIdQImHwkaljIYi',
  8001: 'https://polygon-mumbai.g.alchemy.com/v2/vmZYC0Bktg1cLHDS2vmOZR2bb5LImtI4',
  4: 'https://eth-rinkeby.alchemyapi.io/v2/VmxWigXMpDjAERj9JssUE_MNmC_NnbMX',
};

export const poolContracts = {
  4: '0xC8b59e543cc298dECa3965a0d6c8612951bd2F24',
  137: '0xebC02B3371ef6f01309c5cC2Ef32a755FDeeEDef',
  80001: '',
};

export const relayerAddress = {
  137: '0xf61c320cbfebf96ab97fa667fee931eecd417be5',
  4: '0x99d667ff3e5891a5f40288cb94276158ae8176a0',
  80001: '',
};
