const tableIndex = (index, total, page, size) => {
  if (total > 0 && page) {
    return index + size * page + 1
  } else {
    return index + 1
  }
}
export default tableIndex
