

# ZK-POOLTOGETHER

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmirshko%2Fnext-web3-boilerplate)

## Folder Structure

```bash
.
├── classes
│   ├── deposit.ts
│   ├── merkleTree.ts
│   └── PoseidonHasher.ts
├── components
│   ├── Account.tsx
│   ├── ETHBalance.tsx
│   ├── Hero.tsx
│   ├── Nav.tsx
│   ├── Network.tsx
│   ├── PackageTier.tsx
│   └── Statistics.tsx
├── connectors.ts
├── contracts
│   ├── Pool.json
│   └── types
│       ├── common.d.ts
│       ├── index.ts
│       └── Pool.ts
├── getLibrary.ts
├── hooks
│   ├── useBlockNumber.ts
│   ├── useContract.ts
│   ├── useEagerConnect.ts
│   ├── useENSName.ts
│   ├── useETHBalance.ts
│   ├── useKeepSWRDataLiveAsBlocksArrive.ts
│   ├── useMetaMaskOnboarding.ts
│   └── useZkPoolContract.ts
├── next.config.js
├── next-env.d.ts
├── package.json
├── package-lock.json
├── pages
│   ├── api
│   │   ├── withdraw.ts
│   │   └── withdrawWinning.ts
│   ├── _app.tsx
│   ├── app.tsx
│   ├── check.tsx
│   ├── draws.tsx
│   └── index.tsx
├── public
│   ├── circuit_final.zkey
│   ├── favicon.ico
│   ├── images
│   │   ├── background3.jpg
│   │   └── background.png
│   └── withdraw.wasm
├── README.md
├── styles
│   └── globals.css
├── tsconfig.json
├── util.ts
└── yarn.lock

```
## Features

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!


## Acknowledgments

#### Create-next-app boilerplate

This is a default [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), customized as the default boilerplate for new Web3 projects.

#### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
