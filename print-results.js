const { times, constant } = require('lodash')

module.exports = function printResults (results, pools) {
  const output = Object.entries(results)
    .map(e => [
      Number(e[0]), 
      e[1] / pools
    ])
    .sort((a, b) => b[0] < a[0] ? 1 : -1)

  console.log('uniques | proportion')
  console.log('--------|-----------')
  output.forEach(([count, proportion]) => {
    console.log(`${count} | ${barGraph(proportion)} ${Math.floor(proportion * 100) / 100}`)
  })
}

function barGraph (proportion, width = 40) {
  const scale = 3 // fudged to make graph look bigger
  const barWidth = Math.floor(proportion * width) * 3

  if (barWidth > width) throw new Error('scaled too high')

  return [
    ...times(barWidth, constant('▓')),
    ...times(width - barWidth, constant('░'))
  ].join('')
}
