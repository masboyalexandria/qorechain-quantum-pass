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

## Testnet addresses (LIVE — deployed 27 Nov 2026 ~02:25 WITA)

| Account | Address |
|---|---|
| Deployer (EVM) | `0x8251F4F18524FC92CB60FBd16Be8c8C864f74044` |
| Deployer (QoreChain) | `qor1sfglfuv9yn7f9jmql0gkh6xgepj0wszyt0pwdt` |
| Counter contract | `0x9ccf9c87f89212493c10c33e8099c620c667526d` |

- Faucet: 100 QOR (+ 1,000 fUSD, 0.5 fETH, 0.02 fBTC), tx `78F8E7BA64742D2CC5EA2FBBCE080988221069C968906421E65266339C7623EC`.
- PQC key registered: tx `35293527BFEDC9155B1655D2ED7C66F8F88C70FBD716AF066485CBACB00FDFA4`.
- EVM window opened: tx `B23185F4E649CE47C6BCD9926C4F3B2B1DC587B4756B9C41CD3C246DECDBEF86` — extension `/qorechain.pqc.v1.PQCHybridSignature`, event `pqc_hybrid_verify` = **verified** (`algorithm_id: dilithium5` = ML-DSA-87).
- Counter deployed: EVM tx `0x39ebc1cbea7aef6d0c698fb2dd317a6bd781efe64245c5bfa2fd19b70fc648c1`, block 10803171, status success; `count()` = 0. (Cosmos wrapper tx `DF5C67CFB0051080D608E1C6EC98059D8263D9D87280FF39A72CDA663EB06994`, code 0, `MsgEthereumTx`.)
- Note: `pnpm deploy:testnet` (Hardhat Ignition) stalled before submitting anything on this network, so the deploy was done directly with viem (`scripts/deploy-counter.ts`) — same contract, same constructor argument (initial count 0).

## Status

- [x] Scaffold (`create-qorechain-dapp@0.14.0`), `pnpm test` 2/2 passing
- [x] Throwaway testnet account created (keys only in `.env`, never committed)
- [x] Faucet claim (100 QOR) — done 27 Nov ~02:11 WITA
- [x] `pnpm window register` + `pnpm window open`
- [x] Deploy + on-chain hybrid verification (see above)
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
