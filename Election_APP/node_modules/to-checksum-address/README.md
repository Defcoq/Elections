# to-checksum-address

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) ![code coverage: jest](https://img.shields.io/badge/coverage-100%25-green)

Validates addresses using an injective function that makes capital letters redundant. [RSKIP60](https://github.com/rsksmart/RSKIPs/blob/master/IPs/RSKIP60.md) describes an address checksum mechanism that can be implemented in any network based on [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md).
Allows using chainIds defined in [EIP-155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```js
//npm
npm install to-checksum-address

//yarn
yarn add to-checksum-address
```

## Usage

```js
// Node.js require
const toChecksumAddress = require("to-checksum-address");

// ES6 import
import toChecksumAddress from "to-checksum-address";

toChecksumAddress("0x88250f772101179a4ecfaa4b92a983676a3ce445", 30);
// returns 0x88250F772101179A4eCfaa4b92A983676A3cE445
```

## Maintainers

[@sebastinez](https://github.com/sebastinez)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2020 Sebastian Martinez
