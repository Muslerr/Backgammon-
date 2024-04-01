class GamePiece {
  constructor(id, color) {
    this.color = color;
    this.id = id;
   
  }

  MovePosition(newPosition) {
    if (this.isMovable && newPosition < 28 && newPosition >= 0) {
      this.position = newPosition;
      return true;
    }
    return false;
  }

  
}

export default GamePiece;
