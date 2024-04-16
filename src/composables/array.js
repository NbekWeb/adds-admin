export const uniqueItems = (array, key) => {
  return [...new Map(array.map((item) => [item[key], item])).values()]
}

export const treeData = (data) => {
  return data
    .map((item) => {
      const arr = data.filter((child) => item.id === child.parentId)
      if (arr.length) {
        item.children = arr
      }
      return item
    })
    .filter((item) => !item.parentId)
}
