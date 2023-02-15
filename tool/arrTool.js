const arrTool = {
  // 数组交集
  intersection: (arr1, arr2) => {
    const a = new Set(arr1);
    const b = new Set(arr2);
    const tempSet = new Set([...a].filter(x => b.has(x)));
    return Array.from(tempSet);
  },
  // 数组差集arr1-b
  difference: (arr1, arr2) => {
    const a = new Set(arr1);
    const b = new Set(arr2);
    const tempSet = new Set([...a].filter(x => !b.has(x)));
    return Array.from(tempSet);
  },
};
module.exports = arrTool;
