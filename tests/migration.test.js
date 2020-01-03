const migration = require("../lib/migration");

describe("extractSequenceFromFilename()", () => {
  test.each([
    ["001.sql", 1],
    ["002-test.sql", 2],
    ["0003.sql", 3],
    ["1000.sql", 1000]
  ])("should return correct sequence for %p", (input, expected) =>
    expect(migration.extractSequenceFromFilename(input)).toEqual(expected)
  );
});

describe("getPendingMigrations()", () => {
  test.each([
    [
      [{ seq: 1, filename: "001.sql" }],
      [
        { seq: 2, filename: "002.sql" },
        { seq: 1, filename: "001.sql" }
      ],
      [{ seq: 2, filename: "002.sql" }]
    ],
    [
      [{ seq: 1, filename: "001.sql" }],
      [
        { seq: 2, filename: "002.sql" },
        { seq: 1, filename: "001.sql" },
        { seq: 3, filename: "003.sql" }
      ],
      [
        { seq: 2, filename: "002.sql" },
        { seq: 3, filename: "003.sql" }
      ]
    ]
  ])("should return correct pending migration for %p, %p", (appliedMigrations, localMigrations, expected) =>
    expect(migration.getPendingMigrations(appliedMigrations, localMigrations)).toEqual(expected)
  );
});

describe("generateNextMigrationFilename()", () => {
  test.each([
    [[], [], "001.sql"],
    [["001.sql"], [], "002.sql"],
    [["001.sql"], ["test"], "002-test.sql"]
  ])("should return correct filename for %p, %p", (migrations, name, expected) =>
    expect(migration.generateNextMigrationFilename(migrations, name)).toEqual(expected)
  );
});

describe("validateStateConsistency()", () => {
  test("should throw when two files have the same sequence", () => {
    const local = [
      { seq: 1, filename: "001.sql" },
      { seq: 2, filename: "002.sql" },
      { seq: 2, filename: "002-b.sql" }
    ];
    expect(() => migration.validateStateConsistency([], local)).toThrow("002.sql, 002-b.sql");
  });

  test("should throw when local migration is missing", () => {
    const applied = [
      { seq: 1, filename: "001.sql" },
      { seq: 2, filename: "002.sql" }
    ];
    const local = [{ seq: 2, filename: "002.sql" }];

    expect(() => migration.validateStateConsistency(applied, local)).toThrow("expected 001.sql but found 002.sql");
  });

  test("should throw when last local migration is missing", () => {
    const applied = [
      { seq: 1, filename: "001.sql" },
      { seq: 2, filename: "002.sql" }
    ];
    const local = [{ seq: 1, filename: "001.sql" }];

    expect(() => migration.validateStateConsistency(applied, local)).toThrow("missing 002.sql");
  });

  test("should throw when hash is different", () => {
    const applied = [
      { seq: 1, filename: "001.sql", hash: "a" },
      { seq: 2, filename: "002.sql", hash: "b" }
    ];
    const local = [
      { seq: 1, filename: "001.sql", hash: "a" },
      { seq: 2, filename: "002.sql", hash: "c" }
    ];

    expect(() => migration.validateStateConsistency(applied, local)).toThrow("002.sql was modified");
  });
});
