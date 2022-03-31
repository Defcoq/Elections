const stripHexPrefix = (string) => {
  return string.startsWith("0x") || string.startsWith("0X")
    ? string.slice(2)
    : string;
};

module.exports = { stripHexPrefix };
