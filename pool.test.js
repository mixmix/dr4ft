const { times  } = require('lodash')
const { DraftNormal } = require('./backend/pool')
const printResults = require('./print-results')

function makePool () {
  const playersLength = 8
  const sets = ['IKO', 'IKO', 'IKO']

  return DraftNormal({ playersLength, sets })
}


function rareCards (pool) {
  var multipleRaresCount = 0 // per pool

  return pool
    .flatMap(pack => {
      const rares = pack.filter(isRareSlotCard)
      // if (rares.length > 1) console.log('multiple rares:', ++multipleRaresCount)

      return rares
    })
    .sort((a, b) => b.number - a.number > 0 ? -1 : 1)
    .map(card => `${card.number} - ${card.name}`)
}
function isRareSlotCard (card) {
  return (
    card.rarity === 'Rare' ||
    card.rarity === 'Mythic'
  )
}

const pools = 1e5
var results = {}
times(30, n => {
  results[n + 1] = 0
})


times(pools, () => {
  const rares = rareCards(makePool())
  const uniqueRares = new Set(rares).size

  results[uniqueRares] = results[uniqueRares] + 1
})

printResults(results, pools)
