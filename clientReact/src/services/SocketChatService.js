import socketIo from "socket.io-client";
import { useChatRoom } from "../context/chatRooms";

class SocketChatService {
  constructor() {
    this.socket = socketIo(process.env.REACT_APP_CHAT_SERVICE_BASE_URL);
    this.rooms = {};

    this.setMessagesReceived = null; 
    this.setChatRoomsId = null; 

    this.socket.on("roomCreated", this.handleRoomCreated.bind(this));
    this.socket.on("receiveMessage", this.handleReceiveMessage.bind(this));
  }

  initialize(user, setMessagesReceived, setChatRoomsId) {
    this.user = user;
    this.setMessagesReceived = setMessagesReceived;
    this.setChatRoomsId = setChatRoomsId;
  }
  static chatServiceInstance = new SocketChatService();

  handleRoomCreated({ sender, recipient, roomId }) {
    if (recipient == this.user) {
      this.socket.emit("joinRoom", roomId);
      console.log(`Joined room: ${roomId}`);
      this.setChatRoomsId((chatRoomIds) => ({
        ...chatRoomIds,
        [sender]: roomId,
      }));
    }
    else if(sender ==this.user){
        this.socket.emit("joinRoom", roomId);
        console.log(`Joined room: ${roomId}`);
        this.setChatRoomsId((chatRoomIds) => ({
          ...chatRoomIds,
          [recipient]: roomId,
        }));
    }
  }

  handleReceiveMessage(sender, recipient, message) {
   
    if (recipient === this.user) {
      console.log('recieved message in',message)
        this.setMessagesReceived((prevMessagesReceived) => ({
        ...prevMessagesReceived,
        [sender]: [
          ...(prevMessagesReceived[sender] || []),
          { sender: sender, message: message },
        ],
      }));
    }
  }

  createRoom(recipient, token) {
    
    this.socket.emit("createRoom", {
      sender: this.user,
      recipient,
      token,
    });
  }

  joinRoom(roomId) {
    this.socket.emit("joinRoom", roomId);
  }

  sendMessage(CurrentRoomId, userName, selectedUsername, message, storedToken) {
    console.log("sent a message to room "+CurrentRoomId);
    this.setMessagesReceived((prevMessagesReceived) => ({
      ...prevMessagesReceived,
      [selectedUsername]: [
        ...(prevMessagesReceived[selectedUsername] || []),
        { sender: "You", message: message },
      ],
    }));

    this.socket.emit(
      "sendMessage",
      CurrentRoomId,
      userName,
      selectedUsername,
      message,
      storedToken
    );
  }
}
const chatService = SocketChatService.chatServiceInstance;

export default chatService;
