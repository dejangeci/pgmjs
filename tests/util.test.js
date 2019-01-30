const util = require("../lib/util");

describe("cleanFilename()", () => {
  test.each([
    ["a<>", "alessgreater"],
    ["a b c", "a-b-c"],
    ["a>b<c", "agreaterblessc"],
    ["/a", "a"],
    ["../a", "a"],
    ["a/../b", "ab"],
    ["a\\b", "ab"],
    ["a\tb", "a-b"],
    ["a!@#%^*()b", "ab"]
  ])("should return safe filename for %p", (input, expected) => expect(util.cleanFilename(input)).toEqual(expected));
});

describe("calculateNextInSequence()", () => {
  test.each([[[], 1], [[1], 2], [[5], 6], [[1, 2], 3], [[1, 3], 4], [[10, 15], 16], [[20, 10], 21]])(
    "should return correct sequence for %p",
    (input, expected) => expect(util.calculateNextInSequence(input)).toEqual(expected)
  );
});

describe("stripFilenameExtension()", () => {
  test.each([
    ["test.abc", ".abc", "test"],
    ["test.abc", ".efg", "test.abc"],
    ["test.txt.sql", ".sql", "test.txt"],
    ["test", ".sql", "test"]
  ])("should return filename without extension for %p", (filename, ext, expected) =>
    expect(util.stripFilenameExtension(filename, ext)).toEqual(expected)
  );
});

describe("isPositiveInteger()", () => {
  test.each([
    ["0", false],
    ["1", true],
    ["-1", false],
    ["1.0", false],
    ["test", false],
    ["00", false],
    ["01", true],
    ["001", true],
    ["0010", true],
    ["00100", true],
    ["001001", true]
  ])("should return correct value for %p", (input, expected) =>
    expect(util.isPositiveInteger(input)).toEqual(expected)
  );
});

describe("getDuplicateElements()", () => {
  test.each([[[1, 2, 3], []], [[1, 2, 2, 3], [2, 2]], [[1, 2, 3, 2], [2, 2]], [[3, 2, 1, 2, 3], [3, 2, 2, 3]]])(
    "should return duplicate array elements for %p",
    (input, expected) => expect(util.getDuplicateElements(input)).toEqual(expected)
  );
});
