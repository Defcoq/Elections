const keccak256 = require("keccak256");
const { stripHexPrefix } = require("./utils");

const toChecksumAddress = (address, chainId = null) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error("Not given a valid Ethereum Address");
  }

  // Adds the chain id as a prefix. Converts the address to hexadecimal.
  // Calculates keccak with the prefixed address.
  const stripAddress = stripHexPrefix(address).toLowerCase();
  const prefix = chainId !== null ? `${chainId.toString()}0x` : "";
  const keccakHash = keccak256(prefix + stripAddress)
    .toString("hex")
    .replace(/^0x/i, "");

  // Prints i digit if it's a number, otherwise checks if i byte of the hash of the keccak.
  // If it's grater than 8 prints uppercase, otherwise lowercase.
  let checksumAddress = "0x";
  for (let i = 0; i < stripAddress.length; i += 1)
    checksumAddress +=
      parseInt(keccakHash[i], 16) >= 8
        ? stripAddress[i].toUpperCase()
        : stripAddress[i];

  return checksumAddress;
};

module.exports = toChecksumAddress;
