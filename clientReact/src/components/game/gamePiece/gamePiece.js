import React, { useEffect, useRef, useState } from 'react';
import style from "./gamePiece.module.css"
const GamePieceComponent = ({ gamePiece }) => {
 
  const { isMovable, id, isEaten, color } = gamePiece;
  useEffect(() => {              
  }, [gamePiece]);
 
  return (
    <div
    className={color=='white' ?style.gamePieceWhite :style.gamePieceBlack }>
    
  </div>
  );
};

export default GamePieceComponent;
