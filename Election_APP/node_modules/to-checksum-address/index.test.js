const { stripHexPrefix } = require("./utils.js");
const toChecksumAddress = require("./index.js");

describe("Prefix Stripping", () => {
  test("Strips prefix 0x", () => {
    expect(
      stripHexPrefix("0x6e0C35Dc9B559CE646e060Df5437137F59eb16ea", 30)
    ).toBe("6e0C35Dc9B559CE646e060Df5437137F59eb16ea");
  });

  test("Doesn't strip anything from address when no prefix available", () => {
    expect(stripHexPrefix("6e0C35Dc9B559CE646e060Df5437137F59eb16ea", 30)).toBe(
      "6e0C35Dc9B559CE646e060Df5437137F59eb16ea"
    );
  });
});

describe("toChecksumAddress", () => {
  it("Throw error when not receiving valid address", () => {
    expect(() => toChecksumAddress("0x3453454")).toThrow(
      "Not given a valid Ethereum Address"
    );

    expect(() => toChecksumAddress(undefined)).toThrow(
      "Not given a valid Ethereum Address"
    );

    expect(() => toChecksumAddress(1234)).toThrow(
      "Not given a valid Ethereum Address"
    );

    expect(() => toChecksumAddress(["0", "2"])).toThrow(
      "Not given a valid Ethereum Address"
    );
  });

  it("Convert address without prefix to checksummed address", () => {
    expect(
      toChecksumAddress("6e0c35dc9b559ce646e060df5437137f59eb16ea", 30)
    ).toBe("0x6e0C35Dc9B559CE646e060Df5437137F59eb16ea");
  });

  it("Convert address with prefix to checksummed address", () => {
    expect(
      toChecksumAddress("0x6e0c35dc9b559ce646e060df5437137f59eb16ea", 30)
    ).toBe("0x6e0C35Dc9B559CE646e060Df5437137F59eb16ea");
  });

  it("When missing chainId parameter use chainId = null", () => {
    expect(toChecksumAddress("6e0c35dc9b559ce646e060df5437137f59eb16ea")).toBe(
      "0x6e0c35dc9B559Ce646E060df5437137F59eb16ea"
    );
  });
});
