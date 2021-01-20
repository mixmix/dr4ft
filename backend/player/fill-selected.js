const {pull, pullAllWith, times, sample } = require("lodash");

module.exports = function fillSelected (cardIds, selected, picksPerPack, burnsPerPack) {
  pullAllWith(cardIds, selected.picks, (cardId, _cardId) => cardId === _cardId);
  pullAllWith(cardIds, selected.burns, (cardId, _cardId) => cardId === _cardId);


  // pick cards
  const remainingToPick = Math.min(cardIds.length, picksPerPack) - selected.picks.length;
  times(remainingToPick, () => {
    const randomCardId = sample(cardIds);
    selected.picks.push(randomCardId);
    pull(cardIds, randomCardId);
  });

  // burn cards
  const remainingToBurn = Math.min(burnsPerPack, cardIds.length) - selected.burns.length;
  times(remainingToBurn, () => {
    const randomCardId = sample(cardIds);
    selected.burns.push(randomCardId);
    pull(cardIds, randomCardId);
  });

  return selected
} 
