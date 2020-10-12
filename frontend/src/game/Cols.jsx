import React, {Component} from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZoneDisplayName} from "../zones";
import Spaced from "../components/Spaced";
import {getCardSrc, getFallbackSrc} from "../cardimage";

import './Cols.scss';

class Cols extends Component {
  constructor(props) {
    super(props);
    this.state={
      className: "right",
      card: undefined
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }
  onMouseEnter(card, e) {
    let {offsetLeft} = e.target;
    let {clientWidth} = document.documentElement;

    let imgWidth = 240;
    let colWidth = 180;

    let className = offsetLeft + colWidth > clientWidth - imgWidth
      ? "left"
      : "right";

    if ("split" === card.layout) {
      className += " split-card";
    }

    if (card.foil) {
      className += " foil-card ";
    }

    this.setState({ card, className });
  }
  onMouseLeave() {
    this.setState({
      card: undefined
    });
  }
  render() {
    return (
      <div class="Cols">
        <Zones zoneNames={this.props.zones} onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave} />
        <ImageHelper onMouseEnter={this.onMouseEnter} {...this.state} />
      </div>
    );
  }
}

Cols.propTypes = {
  zones: PropTypes.array.isRequired
};

const Zones = ({zoneNames, onMouseOver, onMouseLeave}) => {
  const renderZone = (zoneName) => {
    const zone = App.getSortedZone(zoneName);
    let sum = 0;
    let cols = [];

    const prefferedType = "Creature"
    for (let key in zone) {
      const prefferedItems = zone[key].filter((card) => card.type === prefferedType)
      const otherItems = zone[key].filter((card) => card.type !== prefferedType)

      const colTotal = otherItems.length + prefferedItems.length;
      sum += colTotal
      // TODO extract minHeight style
      cols.push(
        <div key={key} className='col'>
          <div>
            <strong>{`${key} (${colTotal})`}</strong>
          </div>
          <div style={{ minHeight: 255 + 2 * 20 }} >
            {otherItems.map((card, index) => (
              Card({ card, index, zoneName, onMouseOver, onMouseLeave })
            ))}
          </div>
          <div>
            {prefferedItems.map((card, index) => (
              Card({ card, index, zoneName, onMouseOver, onMouseLeave })
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={zoneName} className={"zone " + zoneName}>
        <h1>
          <Spaced elements={[getZoneDisplayName(zoneName), sum]}/>
        </h1>
        {cols}
      </div>
    );
  };

  return zoneNames.map(renderZone);
};

// TODO extract Card from Cols + Grid
const Card = ({ card, index, zoneName, onMouseOver, onMouseLeave }) => (
  <div
    className={`${card.foil ? "foil-card": ""} card-col`}
    key={index}
    onClick={App._emit("click", zoneName, card)}
    onMouseOver={e => onMouseOver(card, e)}
    onMouseLeave={onMouseLeave}
  >

    {App.state.cardSize === "text"
      ? <div><strong>{card.name}</strong> {card.manaCost}</div>
      : <img
        src={getCardSrc(card)}
        onError= {getFallbackSrc(card)}
        alt={card.name + " " + card.manaCost} />}
  </div>
)

Card.propTypes = {
  card: PropTypes.object,
  index: PropTypes.integer,
  zoneName: PropTypes.string,
  onMouseOver: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired
};

const ImageHelper = ({onMouseEnter, className, card}) => (
  card
    ? card.isDoubleFaced
      ? <div className={className} id="doubleimg">
        <img className="card" src={getCardSrc(card)} onError= {getFallbackSrc(card)} onMouseEnter={onMouseEnter.bind(card)} />
        <img className={`card ${card.layout === "flip" ? "flipped" : ""}`} src={getCardSrc({
          ...card,
          isBack: card.flippedIsBack,
          number: card.flippedNumber,
        })} onError= {e => e.target.src = card.flippedCardURL} onMouseEnter={onMouseEnter.bind(card)} />
      </div>
      :
      <div id='img' className = {className}>
        <img
          className = "image-inner"
          onMouseEnter = {e => onMouseEnter(card, e)}
          onError= {getFallbackSrc(card)}
          src = {getCardSrc(card)} />
      </div>
    : <div />
);

ImageHelper.propTypes = {
  onMouseEnter: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  card: PropTypes.object
};

export default Cols;
