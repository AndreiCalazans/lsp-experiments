exports.getBlacklisted = (text) => {
  const blacklist = [
    'foo',
    'bar',
    'baz',
  ]
  const regex = new RegExp(`\\b(${blacklist.join('|')})\\b`, 'gi')
  const results = []
  while ((matches = regex.exec(text)) && results.length < 100) {
    results.push({
      value: matches[0],
      index: matches.index,
    })
  }
  return results
}

