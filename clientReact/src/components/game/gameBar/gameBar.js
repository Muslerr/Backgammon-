import React from "react";
import GamePieceComponent from "../gamePiece/gamePiece";
import './Bar.css';
import { useBoardContext } from "../../../context/boardContext";
import { useEffect } from "react";

const BarComponent = ({ colorBar, gamePieceList, id, barClicked,isSecondTimeClicked, Highlighted }) => {
  const{board,InitializeGame, setBoard,Move,Turn,PossibleMoves,rollDice, setisYourTurn,isYourTurn,color,numberOfEaten,setNumberOfEaten}=useBoardContext();
    
    const ContainsPiecesOfPlayersColor=(gamePieceList.length > 0 && gamePieceList[0].color==color)
    const isHighlighted = Highlighted.includes(id);  
    const highlightClass = isHighlighted ? 'highlighted' : '';
    const isClickable=(((isHighlighted && isSecondTimeClicked) || (!isSecondTimeClicked&&ContainsPiecesOfPlayersColor)))
    const handleClick = () => {
       
      if( isYourTurn && isClickable){
       barClicked(id);}
    }
    useEffect(() => {      
      gamePieceList = gamePieceList  || [];
    }, [gamePieceList])
    

  return (
    <div onClick={handleClick} className={`bar ${colorBar}  ${highlightClass}`}>
      {id}
      {gamePieceList.map((gamePiece, index) => (        
        <GamePieceComponent
          key={gamePiece.id}
          gamePiece={gamePiece}
        />
      ))}
    </div>
  );
};

export default BarComponent;
