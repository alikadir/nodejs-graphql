export function fieldMapResolver(fieldNode) {
  let list =
    fieldNode.name.value +
    ' { ' +
    fieldNode.selectionSet.selections
      .map(x => {
        return x.selectionSet ? fieldMapResolver(x) : x.name.value;
      })
      .join(', ') +
    ' }';
  return list;
}
