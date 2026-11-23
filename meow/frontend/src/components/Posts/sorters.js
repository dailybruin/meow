/**
 * strNullSorter sorts strings alphabetically, with empty values
 * (null, undefined or "") last in both sort directions.
 * antd negates the result for "descend", so the empty-value result is
 * pre-inverted for that direction. Two empty values compare equal, so
 * their original order is kept.
 * @param {string|null|undefined} a
 * @param {string|null|undefined} b
 * @param {"ascend"|"descend"} sortOrder the third argument antd passes to a sorter
 * @returns {number}
 */
export const strNullSorter = (a, b, sortOrder) => {
  if (a && b) return a.localeCompare(b);
  if (!a && !b) return 0;
  const emptyLast = a ? -1 : 1;
  return sortOrder === "descend" ? -emptyLast : emptyLast;
};

/**
 * findSectionName returns the name of the section with the given id.
 * @param {Array<{id: number, name: string}>|null|undefined} sections
 * @param {number|null|undefined} id
 * @returns {string|null} null if id is empty, sections are not loaded, or the id is not found
 */
export const findSectionName = (sections, id) => {
  const section = id && sections ? sections.find(x => x.id === id) : undefined;
  return section ? section.name : null;
};
