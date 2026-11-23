import { test } from "node:test";
import assert from "node:assert/strict";
// Node's ES module loader needs the file extension.
// eslint-disable-next-line import/extensions
import { strNullSorter, findSectionName } from "./sorters.js";

// Same wrapper as antd 3 Table#getSorterFn: it passes sortOrder as the
// third argument and negates non-zero results for "descend".
const antdSort = (rows, sorter, order) =>
  rows.slice().sort((a, b) => {
    const result = sorter(a, b, order);
    if (result !== 0) return order === "descend" ? -result : result;
    return 0;
  });

const values = ["delta", null, "alpha", "Charlie", "bravo", "", "echo"];

test("strNullSorter returns numbers", () => {
  const pairs = [["a", "b"], ["b", "a"], ["a", "a"], [null, "a"], ["a", null], [null, ""]];
  pairs.forEach(([a, b]) => {
    ["ascend", "descend"].forEach(order => {
      assert.equal(typeof strNullSorter(a, b, order), "number");
    });
  });
});

test("strNullSorter ascend: alphabetical, empty values last", () => {
  assert.deepEqual(antdSort(values, strNullSorter, "ascend"), [
    "alpha",
    "bravo",
    "Charlie",
    "delta",
    "echo",
    null,
    ""
  ]);
});

test("strNullSorter descend: reverse alphabetical, empty values still last", () => {
  assert.deepEqual(antdSort(values, strNullSorter, "descend"), [
    "echo",
    "delta",
    "Charlie",
    "bravo",
    "alpha",
    null,
    ""
  ]);
});

test("regression: the old true/false comparator could never say 'a goes first'", () => {
  // A comparator must return a negative number when a sorts before b.
  // The old one returned true/false (1/0), so the result depended on
  // each browser's sort algorithm.
  const oldSorter = (a, b) => {
    if (a && b) return a > b;
    if (a) return false;
    if (b) return true;
    return false;
  };
  const results = values.flatMap(a => values.map(b => Number(oldSorter(a, b))));
  assert.ok(results.every(r => r >= 0));
  assert.ok(Number(strNullSorter("alpha", "bravo", "ascend")) < 0);
});

test("findSectionName", () => {
  const sections = [{ id: 1, name: "Sports" }, { id: 2, name: "Arts" }];
  assert.equal(findSectionName(sections, 2), "Arts");
  assert.equal(findSectionName(sections, 99), null);
  assert.equal(findSectionName(sections, null), null);
  assert.equal(findSectionName(null, 1), null);
});

test("section column sorts by section name, missing and unknown sections last", () => {
  const sections = [{ id: 1, name: "Sports" }, { id: 2, name: "Arts" }, { id: 3, name: "News" }];
  // Same composition as the section column sorter in Content.js.
  const sorter = (a, b, order) =>
    strNullSorter(
      findSectionName(sections, a.section),
      findSectionName(sections, b.section),
      order
    );
  const rows = [1, 2, null, 3, 99].map(section => ({ section }));
  const ids = order => antdSort(rows, sorter, order).map(r => r.section);
  assert.deepEqual(ids("ascend"), [2, 3, 1, null, 99]);
  assert.deepEqual(ids("descend"), [1, 3, 2, null, 99]);
});

test("slug, tweet and facebook columns sort rows in both directions", () => {
  ["slug", "post_twitter", "post_facebook"].forEach(field => {
    const rows = values.map(value => ({ [field]: value }));
    const sorter = (a, b, order) => strNullSorter(a[field], b[field], order);
    const sorted = order => antdSort(rows, sorter, order).map(r => r[field]);
    assert.deepEqual(sorted("ascend"), ["alpha", "bravo", "Charlie", "delta", "echo", null, ""]);
    assert.deepEqual(sorted("descend"), ["echo", "delta", "Charlie", "bravo", "alpha", null, ""]);
  });
});
