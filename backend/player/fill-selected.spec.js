const {describe, it} = require("mocha");
const assert = require("assert").strict;
const fillSelected = require('./fill-selected')

describe.only("fillSelected", () => {
  const pack = ['A', 'B', 'C'];

  describe("'Classic draft' (pick 1)", () => {
    describe("Pick made", () => {
      it("should return exactly the same selection", () => {
        assert.deepEqual(fillSelected(pack
      });
    });
    describe("No pick made", () => {
      it("it returns a new selection object with a random pick", () => {
      });
    });
  });

  describe("'Glimpse draft' (pick 2 burn 1)", () => {
  });

  describe("'Custom draft' (pick 3 burn 2)", () => {
  });
});
