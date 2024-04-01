import socketIo from "socket.io-client";
import { useBoardContext } from "../context/boardContext";

class SocketGameService {
  constructor() {
    this.socket = socketIo(process.env.REACT_APP_GAME_SERVICE_BASE_URL);
    this.socket.on("InvitedToNewGame", this.handleGameInvite.bind(this));
    this.socket.on("GameStarted", this.handleGameStarted.bind(this));
    this.socket.on("GameDeclined", this.handleGameDeclined.bind(this));
    this.socket.on("PlaySent", this.HandlePlaySent.bind(this));
    this.socket.on("LastPlaySent", this.HandleLastPlaySent.bind(this));
    this.socket.on("PlayerWon", this.HandlePlayerWon.bind(this));
    this.socket.on("PlayerConcede", this.HandlePlayerConcede.bind(this));
    this.currentGameId="";
    this.currentOpponent="";
  }
  initialize(user,setGameInvites,setOpponent,setCurrentInvite,opponent,handlePlaySent,handleLastPlaySent,HandlePlayerWon) {    
    this.user = user;   
    this.GameId =[];
    this.playerColor="";
    this.setOpponent=setOpponent;
    this.setGameInvites = setGameInvites;
    this.setCurrentInvite = setCurrentInvite;
    this.opponent=opponent;
    this.handlePlaySent=handlePlaySent;
    this.handleLastPlaySent=handleLastPlaySent;
    this.handlePlayerWon= HandlePlayerWon;
    this.LoadGameData();

  }
  static gameServiceInstance = new SocketGameService();

  inviteToGame(recipient, token) {    
    this.setCurrentInvite(recipient);
    
    this.socket.emit("NewGameInvite", ({senderUsername :this.user,recipientUsername: recipient,token: token}));
    this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [this.user]:{sender:this.user, recipient:recipient}
      }))  
      console.log( this.user,"GameInvites",recipient)
  }

  handleGameInvite({ senderUsername, recipientUsername ,GameId }) //starts Listening to the socket room
   {            
    if (recipientUsername == this.user) {
      this.socket.emit("joinGame", GameId);      
      this.GameId[senderUsername] = GameId;      
      this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [senderUsername]:{sender:senderUsername, recipient:this.user}
      }))  
    } else if (senderUsername == this.user) {
      this.GameId[recipientUsername] = GameId;
      this.socket.emit("joinGame",  this.GameId[recipientUsername]);
      this.GameId[recipientUsername] = GameId;
      this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [recipientUsername]:{sender:senderUsername, recipient:recipientUsername}
      }))                    
    }
   }
  
   acceptGameInvite(token,selectedUserName) {
    this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [selectedUserName]:null
      }))      
    this.socket.emit(
      "AcceptGameInvite",
      this.user,
      selectedUserName,
      this.GameId[selectedUserName],    
      token
    );
    this.setOpponent(selectedUserName);
    this.playerColor = "black";
  }
  declineGameInvite(token,selectedUserName) {
    this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [selectedUserName]:null
      }))  
    this.socket.emit( "DeclineGameInvite",this.user,selectedUserName,this.GameId,token
    );    
  }
  
  handleGameStarted({sender, recipient,gameId}) {        
    if (recipient == this.user) {
        this.setGameInvites((prevGameInvites)=>({
            ...prevGameInvites,
            [sender]:null
          }))  
      this.setCurrentInvite(null);
      this.GameId[sender] = gameId;
      this.currentGameId=gameId;
      this.currentOpponent=sender;
      this.setOpponent(sender);      
      this.playerColor="white"
    }
    else if(sender==this.user){
      
      this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [recipient]:null
      }))        
      this.GameId[recipient] = gameId;
      this.setOpponent(recipient);
      localStorage.setItem("opponent",recipient);
      this.currentGameId=gameId;
      this.currentOpponent=recipient;
      this.playerColor="black";      
    }
    this.SaveGameData();
  }
  handleGameDeclined({sender, recipient,gameId}) {
    console.log(sender, recipient,gameId)
    if (recipient === this.user) {
      console.log("game declined");
      
      this.setCurrentInvite(null);
      this.setGameInvites((prevGameInvites)=>({
        ...prevGameInvites,
        [sender]:null
      }))  
      alert("game declined by " ,sender);
    }
  }
  SendMove(token ,origin,destination) {
     console.log("send move");     
     this.socket.emit("sendPlay",this.currentGameId,this.user,this.currentOpponent,this.playerColor,origin,destination,token);
  }
  HandlePlaySent({sender,receiver,playerColor, origin,destination}){   
    if (playerColor !== this.playerColor && receiver==this.user) {
       this.handlePlaySent(origin,destination,playerColor)
    }
  }
  SendLastMove(token ,origin,destination) {
     console.log("send move");     
     this.socket.emit("LastSendPlay",this.currentGameId,this.user,this.currentOpponent,this.playerColor,origin,destination,token);
  }
  HandleLastPlaySent({sender,receiver,playerColor, origin,destination}){   
    
    if (playerColor !== this.playerColor && receiver==this.user) {
       this.handleLastPlaySent(origin,destination,playerColor)
    }
  }
  // SendYouWon(token){
  //   this.socket.emit("IWon",this.currentGameId,this.user,this.currentOpponent,this.playerColor,token);
  // }
  SendIConcede(token){
    this.socket.emit("IConcede",this.currentGameId,this.currentOpponent,this.user,this.playerColor,token)
  }
  
  
  HandlePlayerWon(sender){  
   this.handlePlayerWon(sender);
   console.log(sender);
   console.log("game ended")
   this.setOpponent(null);   
   this.currentGameId="";
   this.currentOpponent="";   
   this.ResetGameData();
  }
  HandlePlayerConcede({sender}){  
   this.handlePlayerWon(sender);
   console.log(sender);
   console.log("game ended")
   this.setOpponent(null);   
   this.currentGameId="";
   this.currentOpponent="";   
   this.ResetGameData();
  }
  
  
  SaveGameData(){
     localStorage.setItem("color",this.playerColor);
     localStorage.setItem("opponent",this.currentOpponent);
     localStorage.setItem("gameId",this.currentGameId);
     
  }
  LoadGameData(){
     if(localStorage.getItem("gameId")){
      this.socket.emit("joinGame",localStorage.getItem("gameId")); 
      console.log("load game data");     
      this.setOpponent(localStorage.getItem("opponent"));
      this.currentGameId=localStorage.getItem("gameId");
      this.currentOpponent=localStorage.getItem("opponent");
      this.playerColor=localStorage.getItem("color");      
     }
  }
  ResetGameData(){
    localStorage.removeItem('isRollDice');
    localStorage.removeItem('numberOfOutPieces');
    localStorage.removeItem('canLeaveBoard');
    localStorage.removeItem('board');
    localStorage.removeItem('moves');
    localStorage.removeItem('isYourTurn');
    localStorage.removeItem("gameId");
    localStorage.removeItem("color");
    localStorage.removeItem("opponent");
  }
} 
const GameService = SocketGameService.gameServiceInstance;

export default GameService;
