const { times, constant } = require('lodash')
const data = require('./data/boosterRules.json')
const printResults = require('./print-results')

const PLAYERS = 8
const PACKS_PP = 3

const iko_rare_mythic = data.IKO.sheets.iko_rare_mythic.cards

const RARES = Object.entries(iko_rare_mythic)
  .filter(pair => pair[1] > 1)
  .length
const MYTHICS = Object.entries(iko_rare_mythic)
  .filter(pair => pair[1] === 1)
  .length

const RARES_MULT = 2 // how much more likely a rare is that mythic

const cards = [
  ...times(RARES, i => i + 1)
    .flatMap(i => times(RARES_MULT, constant(i))),
  ...times(MYTHICS, i => `${i + 100 + 1}`)
]

function makePool () {
  return times(PLAYERS * PACKS_PP, () => {
    return cards[Math.floor(Math.random() * cards.length)]
  })
}


function simulate (nPools) {
  const results = {}
  times(24, i => (results[i+1] = 0))

  times(nPools, () => {
    const pool = makePool()
    const uniquesCount = new Set(pool).size

    results[uniquesCount] = results[uniquesCount] + 1
  })
  return results
}

console.log('Rares:', RARES)
console.log('Mythics:', MYTHICS)

const POOLS = 1e6
printResults(simulate(POOLS), POOLS)
