import React from "react";
import PropTypes from "prop-types";
import Badge from "react-bootstrap/Badge";

const TypePill = ({ type }) => {
  let variant;

  switch(type) {
    case "rock":
    case "fairy":
    case "normal":
    case "flying":
      variant = "light"; 
      break;
    
    case "electric":
    case "fighting":
    case "ground":
      variant="warning";
      break;
    
    case "grass":
    case "poison":
    case "bug":
      variant="success";
      break;
    
    case "steel":
      variant="secondary";
      break;
    
    case "dragon":
    case "fire":
      variant="danger";
      break;
    
    case "water":
      variant="primary";
      break;
    
    case "ice":
      variant="info";
      break;
    
    case "unknown":
    case "ghost":
    case "shadow":
    case "psychic":
    case "dark":
      variant="dark";
      break;
    
    default:
      break; 
  }

  return <Badge variant={variant} className="mr-2">{type}</Badge>
}

TypePill.propTypes = {
  type: PropTypes.string.isRequired
}

export default TypePill;
