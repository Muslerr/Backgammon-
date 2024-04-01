import GamePiece from './GamePiece';
import Triangle from './Triangle';

class Board {
  constructor(thisPlayerColor) {
    console.log(thisPlayerColor);
    this.blackCanMove=thisPlayerColor=='black';
    this.whiteCanMove=thisPlayerColor=='white';
    this.board = new Array(28).fill(null).map(() => []);   
    this.initializeGamePieces();
  }

  initializeGamePieces() {
    
    for (let i = 0; i < 2; i++) {
      const gamePiece = new GamePiece(i, 'black');
      this.board[0].push(gamePiece);
    }
    
    for (let i = 2; i < 7; i++) {
      const gamePiece = new GamePiece(i, 'white');
      this.board[5].push(gamePiece);
    }
    
    for (let i = 7; i < 10; i++) {
      const gamePiece = new GamePiece(i, 'white');
      this.board[7].push(gamePiece);
    }
    // Initialize 5 black game pieces at position 11
    for (let i = 10; i < 15; i++) {
      const gamePiece = new GamePiece(i, 'black');
      this.board[11].push(gamePiece);
    }
    // Initialize 5 white game pieces at position 12
    for (let i = 15; i < 20; i++) {
      const gamePiece = new GamePiece(i, 'white');
      this.board[12].push(gamePiece);
    }
    // Initialize 3 black game pieces at position 16
    for (let i = 20; i < 23; i++) {
      const gamePiece = new GamePiece(i, 'black');
      this.board[16].push(gamePiece);
    }
    
    for (let i = 23; i < 28; i++) {
      const gamePiece = new GamePiece(i, 'black');
      this.board[18].push(gamePiece);
    }
  
    for (let i = 28; i < 30; i++) {
      const gamePiece = new GamePiece(i, 'white');
      this.board[23].push(gamePiece);
    }
   
} 
}




export default Board;
