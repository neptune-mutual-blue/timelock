# Neptune Mutual Timelock

## Installation

### Checklist

- [ ] Install [foundry](https://book.getfoundry.sh/getting-started/installation)
- [ ] Install [lcov](https://formulae.brew.sh/formula/lcov) on Mac OS or [genhtml](https://manpages.ubuntu.com/manpages/xenial/man1/genhtml.1.html) on Linux

```
git submodule update --init --recursive
forge install
```

### Commands

**Build**

```
forge build
```

**Test**

```
yarn test
```

**Coverage**

```
yarn coverage

open ./coverage/index.html
```

**Deploy**

```
npx hardhat run scripts/deploy/timelock/0.timelock.js --network hardhat
```
