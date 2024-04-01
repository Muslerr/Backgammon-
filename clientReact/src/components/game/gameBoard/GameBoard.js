import React, { useEffect } from 'react';
import BarComponent from '../gameBar/gameBar';
import GameService from '../../../services/SocketGameService';
import './gameBoard.css'; // Import the CSS file
import { useBoardContext } from '../../../context/boardContext';
import { useGameInformation } from "../../../context/gameInformation";
import { useState } from 'react';
const GameBoardComponent = ({initialGameBoard}) => {
  const boardArray = initialGameBoard || [];
  const {user}=useGameInformation();
  const [piecePicked, setpiecePicked] = useState(-1);
  const gameService = GameService;
  const [destination, setdestination] = useState(-1);
  const [seconedTimeClicked, setseconedTimeClicked] = useState(false)
  const [highlightedList, sethighlightedList] = useState([])
  const{board,color,moves,setMoves,InitializeGame, setBoard,SendMove,SendLastPlay,PossibleMoves,rollDice, setisYourTurn,isYourTurn,numberOfEaten,setNumberOfEaten,isRollDice,setisRollDice,canLeaveBoard, setcanLeaveBoard,numberOfOutpieces, setnumberOfOutpieces,}=useBoardContext();
  let EatenBar = color=="white"? 24:25 
  
  function SaveBoardState(){
    localStorage.setItem('board',JSON.stringify(initialGameBoard));
    localStorage.setItem('isYourTurn',JSON.stringify(isYourTurn));
    localStorage.setItem('moves',JSON.stringify(moves));
    localStorage.setItem('isRollDice',JSON.stringify(isRollDice));   
    localStorage.setItem('numberOfOutPieces',numberOfOutpieces);
    localStorage.setItem('canLeaveboard',canLeaveBoard);
 }

  const handleRollDice=(()=>{
   
    if(!isRollDice) 
    {var dice=rollDice();   
     setMoves(dice);
     checkCanYouplay(dice);
     setisRollDice(true); 
    }
    else{
      alert("you can only roll once!")
    }
    })
  
    const checkCanYouplay=((dice)=>{
    if(numberOfOutpieces==15) return;
    var canPlayEaten=true;
    var avilablePlyes=false
    if(board[EatenBar].length>0&& PossibleMoves(EatenBar,dice).length==0){
      canPlayEaten=false;
     
    }   
    for(let i=0; i<24 ; i++){        
       if((board[i].length>0 && board[i][0].color==color)){
        if(PossibleMoves(i,dice).length>0){
          avilablePlyes = true;
          console.log(i)
        }}
    }
    if(!canPlayEaten &&dice.length>0 ){
      alert("cant play you rolled" ,dice)
      setMoves([]);
      SendLastPlay(-100,-100);
    }
    if(!avilablePlyes&&dice.length>0){
      setMoves([]);
      alert("cant play you rolled " , dice)
      SendLastPlay(-100,-100);
    }
   })
  
    const handleBarOriginPicked=((id)=>{       
      setnumberOfOutpieces(color=="white"? board[26].length:board[27].length);
      checkCanYouplay(moves);
      checkCanYouEnd();
      console.log("length of barEat" ,board[EatenBar].length )
    if(board[EatenBar].length>0){
        
        setpiecePicked(EatenBar);
        var highlightList=(PossibleMoves(EatenBar,moves));     
        highlightList.push(EatenBar);
        sethighlightedList(highlightList)
       }else{
        setpiecePicked(id);                     
        var highlightList=(PossibleMoves(id,moves));     
        highlightList.push(id);
        sethighlightedList(highlightList)
       }      
       setseconedTimeClicked(true);           
    })
  
    const handleBarDestinationPicked=((id)=>{          
       setseconedTimeClicked(false); 
       setpiecePicked(-1);
       sethighlightedList([])
       if(piecePicked==id){                     
           return;
       }        
                      
      if(board[id][0])//eat the opponents piece
      {
        if(board[id][0].color!=color)
        {
          if(color=="white")
             {movePiece(id,25);}
          else
             {movePiece(id,24);}
        }
      }
      setdestination(id);  
      movePiece(piecePicked,id);
    })
  
    const movePiece=((origin,destination)=>{           
    const OriginIfBlakcEaten = origin==25 ? -1:origin;
    if(destination==27){
      const stepsTaken=24-origin;
      const indexOfValueToRemove = moves.findIndex((value) => value >= stepsTaken);
      if ((indexOfValueToRemove !== -1 )) {    
        const updatedMoves = [...moves.slice(0, indexOfValueToRemove), ...moves.slice(indexOfValueToRemove + 1)];        
        setMoves(updatedMoves);        
      }
     }
    else if (destination==26){
       const stepsTaken=Math.abs(-1-origin);
       const indexOfValueToRemove = moves.findIndex((value) => value >= stepsTaken);
       if ((indexOfValueToRemove !== -1 )) {    
         const updatedMoves = [...moves.slice(0, indexOfValueToRemove), ...moves.slice(indexOfValueToRemove + 1)];        
         setMoves(updatedMoves);        
       }
    } 
    else{const indexOfValueToRemove = moves.findIndex((value) => value === Math.abs(OriginIfBlakcEaten - destination));     
      if ((indexOfValueToRemove !== -1 && destination<24)) {    
        const updatedMoves = [...moves.slice(0, indexOfValueToRemove), ...moves.slice(indexOfValueToRemove + 1)];        
        setMoves(updatedMoves);        
      }}
    boardArray[destination].push(boardArray[origin].pop());
    setBoard(boardArray);
    sethighlightedList([])     
    if(destination== 26 ||destination == 27){
    setNumberOfEaten((prev)=>{return prev+1})}
    sendToServer(origin,destination);
    })
    
    
    const checkCanYouEnd=()=>{
       let numberOfpiecesInLastQuarter = 0       
       if(color=="black"){
        for (let i = 18; i < 24; i++) {
            if(board[i].length>0){
              if(board[i][0].color=="black"){
                numberOfpiecesInLastQuarter+=board[i].length;
              }
            }
        }}
        else{
          for (let i = 0; i < 6; i++) {
            if(board[i].length>0){
              if(board[i][0].color=="white"){
                numberOfpiecesInLastQuarter+=board[i].length;
              }
            }
          }
        }
        console.log("numberOfPiecesInLastQuarter",numberOfpiecesInLastQuarter,color,numberOfOutpieces);
        const canLeaveBoard=(numberOfpiecesInLastQuarter+(color=="white"? board[26].length:board[27].length))==15
        setcanLeaveBoard(canLeaveBoard);
    } 
      
    
    const sendToServer=(origin,destination)=>{      
      if(moves.length ==1){
            SendLastPlay(origin,destination);
      }
      else{
            SendMove(origin,destination);
      }
   }
   
   const concede=()=>{
    gameService.SendIConcede(localStorage.getItem("token"));
   }

  useEffect(() => {    
    const numOfOut=color=="white"? board[26].length:board[27].length
    setnumberOfOutpieces(numOfOut);
    checkCanYouEnd();
    SaveBoardState();
    if(numOfOut==15){      
      // gameService.SendYouWon(localStorage.getItem("token"));
      gameService.HandlePlayerWon(localStorage.getItem("user"));
    }
  }, [board,moves,numberOfEaten,canLeaveBoard])
    
  const firstDivision = boardArray.slice(0, 12);
  const secondDivision = boardArray.slice(12,24);
  const EatenBars=boardArray.slice(24,26);
  const whiteOutBar=boardArray.slice(26,27);
  const blackOutBar=boardArray.slice(27,28);
  
 

  return (
    <div className="container">
    <h1 style={{color:color,alignItems:"center" , display:"flex", justifyContent:"center"}}> {moves.length > 0 ? `${color} player's Moves: ${moves.join(', ')}` : ''}</h1>
    <div className='wholeGame-board' style={{ border: isYourTurn ? '10px solid #A9A9A9' : '10px solid red' }}>

      <div className='left-div'>
      <BarComponent
            key={26}
            id={26}
            colorBar={"outBar"}
            gamePieceList={whiteOutBar[0]}
            barClicked={piecePicked==-1?handleBarOriginPicked:handleBarDestinationPicked}
            Highlighted={highlightedList}
            isSecondTimeClicked={seconedTimeClicked}
          />
      </div>
    <div className="game-board">     
      <div className="board-division">
        {firstDivision.map((element, index) => (
          <BarComponent
            key={index}
            id={index}
            colorBar={index % 2 === 0 ? 'black' : 'white'}
            gamePieceList={element}
            barClicked={piecePicked==-1?handleBarOriginPicked:handleBarDestinationPicked}
            Highlighted={highlightedList}
            isSecondTimeClicked={seconedTimeClicked}
          />
        ))}
      </div>

      {/* Second Division */}
      <div className="board-division">
        {secondDivision.map((element, index) => (
          <BarComponent
            key={index}
            id={index+12}
            colorBar={index % 2 === 0 ? 'black' : 'white'}
            gamePieceList={element}
            barClicked={piecePicked==-1?handleBarOriginPicked:handleBarDestinationPicked}
            Highlighted={highlightedList}
            isSecondTimeClicked={seconedTimeClicked}
          />
        ))}
      </div>
      <button onClick={handleRollDice}>roll Die</button>
      <div className="board-division">
        {EatenBars.map((element, index) => (
          <BarComponent
            key={index}
            id={index+24}
            colorBar={index % 2 === 0 ? 'black' : 'white'}
            gamePieceList={element}
            barClicked={piecePicked==-1?handleBarOriginPicked:handleBarDestinationPicked}
            Highlighted={highlightedList}
            isSecondTimeClicked={seconedTimeClicked}
          />
        ))}
      </div>
     </div>
     <div className='left-div'>
      <BarComponent
            key={27}
            id={27}
            colorBar={"outBar"}
            gamePieceList={blackOutBar[0]}
            barClicked={piecePicked==-1?handleBarOriginPicked:handleBarDestinationPicked}
            Highlighted={highlightedList}
            isSecondTimeClicked={seconedTimeClicked}
          />
      </div>
      <button onClick={concede}>concede</button>
    </div>
  
  </div>
  );
};

export default GameBoardComponent;
 