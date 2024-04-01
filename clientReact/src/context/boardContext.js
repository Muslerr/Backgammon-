import Board from "../models/Board";
import { useEffect } from "react";
import React, { createContext, useContext, useState } from "react";
import GameService from "../services/SocketGameService";
import { useGameInformation } from "./gameInformation";

const BoardContext = createContext();
export const BoardProvider = ({ children }) => {
  const [board, setBoard] = useState();
  
  const [color, setColor] = useState();
  const [moves,setMoves]=useState([]);
  const [numberOfEaten, setNumberOfEaten] = useState(0);
  const [isYourTurn, setisYourTurn] = useState(localStorage.getItem('isYourTurn'));
  const [isRollDice, setisRollDice] = useState(false);
  const [numberOfOutpieces, setnumberOfOutpieces] = useState(0);
  const [canLeaveBoard, setcanLeaveBoard] = useState();
  const gameService = GameService;

  const InitializeGame = (PlayerColor) => {
   
    if(!localStorage.getItem('board')){
    setColor(PlayerColor);
    setBoard(new Board(color).board);
    setisYourTurn(PlayerColor=='white');}
    else{
      LoadBoardState();
    }
  };
  function SaveBoardState(){
     localStorage.setItem('board',board);
     localStorage.setItem('isYourTurn',isYourTurn);
     localStorage.setItem('moves',moves);
     localStorage.setItem('isRollDice',isRollDice);
     localStorage.setItem('numberOfOutPieces',numberOfOutpieces);
     localStorage.setItem('canLeaveboard',canLeaveboard);
  }
  function LoadBoardState(){
    setBoard( JSON.parse(localStorage.getItem('board')));
    setisYourTurn(JSON.parse(localStorage.getItem('isYourTurn')));
    setMoves(JSON.parse(localStorage.getItem('moves')));
    setisRollDice(JSON.parse(localStorage.getItem('isRollDice')));
    setnumberOfOutpieces(localStorage.getItem('numberOfOutPieces'));
    setcanLeaveBoard(localStorage.getItem('canLeaveBoard'));
    setColor(localStorage.getItem('color'))

  }
  function ResetBoardState(){
     localStorage.removeItem('isRollDice');
     localStorage.removeItem('numberOfOutPieces');
     localStorage.removeItem('canLeaveBoard');
     localStorage.removeItem('board');
     localStorage.removeItem('moves');
     localStorage.removeItem('isYourTurn');
  }
  function rollDice() {
    const moves = [];
    const die1 = Math.floor(Math.random()*6 +1 );
    const die2 = Math.floor(Math.random()*6 +1);
    moves.push(die1, die2);
    if (die1 == die2) {
      moves.push(die1, die2);
    }
    // if(color=="black")
    //    return [6,6,6,6,6,6];
    return moves.sort();
  }

  function PossibleMoves(startingPosition, diceMoves) {
    let possibleMoves = [];
    
    
    startingPosition=startingPosition== 25? -1: startingPosition
    if (color == "white") {
      diceMoves = diceMoves.map((move) => move * -1);
      console.log(color);
    }
    for (var i = 0; i < diceMoves.length; i++) {
      let potantialMove = startingPosition + diceMoves[i];

      if (potantialMove < 0 || potantialMove > 23){
        if(canLeaveBoard)
        potantialMove=color=="white"? 26:27;        
        else {break;}
      };
      if (
        board[potantialMove].length < 2 ||
        (board[potantialMove].length > 1 &&
          board[potantialMove][0].color == color)
          ||potantialMove==26 ||potantialMove==27
      ) {
        possibleMoves.push(potantialMove);
      }
    }
    
    return possibleMoves;
  }

  function SendMove(origin, destination) {
    console.log("rechaed SendMove");
    gameService.SendMove(localStorage.getItem("token"), origin, destination);
  }
  function SendLastPlay(origin, destination) {
    setisYourTurn(false);
    gameService.SendLastMove(localStorage.getItem("token"), origin, destination);
  }

  function handlePlaySent(origin, destination,playerColor) {
    console.log("not last play",origin,destination);
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[destination].push(newBoard[origin].pop());
      return newBoard;
    });    
  }
  
  useEffect(() => {
    
    const numOfOut=board?(color=="white"? board[27].length:board[26].length):0
    if(numOfOut==15){
      GameService.HandlePlayerWon(localStorage.getItem('opponent'))
    }
   
  }, [board])
  
  function handleLastPlaySent(origin, destination,playerColor) {
    console.log("last play",origin,destination);
    setisYourTurn(true);
    setisRollDice(false);
    if(destination!=-100)
    {setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[destination].push(newBoard[origin].pop());
      return newBoard;
    });}
  }
  function handlePlayerWon(sender){
    console.log(sender);
    alert( sender+"won the game");
    ResetBoardState();
  }
  return (
    <BoardContext.Provider
      value={{
        board,
        InitializeGame,
        setBoard,
        SendMove,
        SendLastPlay,
        PossibleMoves,
        rollDice,
        color,
        isYourTurn,
        setisYourTurn,
        handlePlaySent,
        numberOfEaten,
        setNumberOfEaten,
        handleLastPlaySent,
        isRollDice,
        setisRollDice,
        numberOfOutpieces, setnumberOfOutpieces,
        canLeaveBoard, setcanLeaveBoard,
        handlePlayerWon,
        moves,setMoves
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => {
  return useContext(BoardContext);
};
