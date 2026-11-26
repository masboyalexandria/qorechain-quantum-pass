# QDay Counter — my first post-quantum transaction on QoreChain

**Level:** Quantum Pass — QoreChain Developer Fest "Build Before Q-Day"
**Network:** QoreChain testnet (`qorechain-diana`, EVM chain ID 9800). Test QOR has no value.
**Licence:** MIT.

This is the Workshop 1 project: a `Counter` contract deployed through
QoreChain's hybrid authorisation. Every EVM transaction on QoreChain needs
two things a normal EVM chain never asks for:

1. a registered **ML-DSA-87** (post-quantum, FIPS 204) key for the sender, and
2. a live **EVM authorisation window**, opened by a native-lane message
   signed hybrid (secp256k1 + ML-DSA-87).

The deploy transaction therefore carries a `PQCHybridSignature` extension
(4,627 bytes), and the chain emits a `pqc_hybrid_verify` event with status
`verified`. That is the whole point of this project: prove, on chain, that
the account survived "Q-Day" — the day a quantum computer breaks
secp256k1, this account's money still needs its ML-DSA-87 key.

## What I did

```sh
pnpm window status     # account, PQC key, window
# → faucet 100 QOR → pnpm window register   (±0.09 QOR)
# → pnpm window open   (600 blocks, 5 txs)
pnpm build
pnpm deploy:testnet    # Counter on qorechain-diana
```

Verification (after the deploy):

```sh
curl https://api-testnet.qore.host/cosmos/tx/v1beta1/txs/<DEPLOY_HASH>
# → code: 0
# → extension PQCHybridSignature, 4,627 bytes
# → event pqc_hybrid_verify: status = verified
```

## Testnet addresses

| Account | Address |
|---|---|
| Deployer (EVM) | `0x8251F4F18524FC92CB60FBd16Be8c8C864f74044` |
| Deployer (QoreChain) | `qor1sfglfuv9yn7f9jmql0gkh6xgepj0wszyt0pwdt` |
| Counter contract | *(after deploy — see below)* |

## Status

- [x] Scaffold (`create-qorechain-dapp@0.14.0`), `pnpm test` 2/2 passing
- [x] Throwaway testnet account created (keys only in `.env`, never committed)
- [ ] Faucet claim (100 QOR) — needs a browser sign-in to the dashboard
- [ ] `pnpm window register` + `pnpm window open`
- [ ] Deploy + on-chain hybrid verification
- [ ] Demo video ≤ 3 min (silent)

## Run it yourself

```sh
pnpm install
cp .env.example .env   # fill in your own throwaway key + recovery code
pnpm build && pnpm test
```

Built with `@qorechain/sdk` ^0.14.0, Hardhat 3, viem. Scaffolding by
`create-qorechain-dapp`; the window ceremony follows the official
Workshop 1 guide (https://docs.qorechain.io/build-before-qday/workshop-1).
