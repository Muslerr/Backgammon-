import React, { useState, useEffect } from "react";
import style from "./chatRoom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import socket from "socket.io-client";
import ChatService from "../../../services/SocketChatService";
import { useChatRoom } from "../../../context/chatRooms";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBCardFooter,
  MDBCollapse,
} from "mdb-react-ui-kit";
import chatService from "../../../services/SocketChatService";
import { useGameInformation } from "../../../context/gameInformation";

function ChatRoom({ selectedUsername, onClose, iconSelectedUser }) {
  const [userIconSrc, setUserIconSrc] = useState();
  const [otherIconSRC, setotherIconSRC] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [CurrentRoomId, setCurrentRoomId] = useState();
  const [minimized, setMinimized] = useState(false);
  const {token,icon, } = useGameInformation();
  const userName = localStorage.getItem("user");
  const socketChat = socket(process.env.REACT_APP_CHAT_SERVICE_BASE_URL);
  const { chatRoomsId, setChatRoomsId, messagesReceived, setMessagesReceived,isChatRoomOpen,setChatRoomOpen } =
    useChatRoom();
  const chatService = ChatService;
  
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { sender: "You", message: message }]);
      setMessage("");
      chatService.sendMessage(
        chatRoomsId[selectedUsername],
        userName,
        selectedUsername,
        message,
        token
      );
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
    setChatRoomOpen(!isChatRoomOpen);
  };

  useEffect(() => {
    setUserIconSrc("icons/" + icon);
    setotherIconSRC("icons/" + iconSelectedUser);
    setChatRoomOpen(true);
    setMessages(
      messagesReceived[selectedUsername]
        ? messagesReceived[selectedUsername]
        : []
    );
    if (chatRoomsId[selectedUsername]) {
      setCurrentRoomId(chatRoomsId[selectedUsername]);
      chatService.joinRoom(chatRoomsId[selectedUsername]);
    } else {
      chatService.createRoom(selectedUsername, token);
    }
    setMessages(messagesReceived[selectedUsername] || []);
    return () => {
      socketChat.off("receiveMessage");
      socketChat.off("roomCreated");
    };
  }, [selectedUsername, messagesReceived]);

  useEffect(() => {
    console.log("Updated messages:", messages);
  }, [messages, CurrentRoomId]);

  return (
    <div className={style.ChatRoom}  >
      <div className={style.chatButtons} >
        <button onClick={toggleMinimize}>
          <FontAwesomeIcon icon={minimized ? faPlus : faMinus} />
        </button>
        <button onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div   className="d-flex justify-content-between align-items-center"
               color="info"
              size="lg">
                      <div >
                        <div
                          className={style.userCircle}
                          style={{
                            backgroundColor: "green",
                          }}
                        >
                          <div
                            className={style.userImage}
                            style={{
                              backgroundImage: `url(${otherIconSRC})`,
                            }}
                          />
                        </div>
                      </div>
                      <span style={{marginLeft:"20px"}}>      {selectedUsername}</span>
                  </div>
      </div>      
          {!minimized && (                                                   
                  <div>
                    
                    
                    <div className={style.customScrollbar}>                      
                        {messages.map((msg, index) => (
                          <div key={index} className={style.message}>
                            {msg.sender === "You" ? (
                              <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-info">
                                  {msg.message}
                                </p>
                                <img
                                  src={
                                    msg.sender === "You"
                                      ? `${userIconSrc}`
                                      : `${otherIconSRC}`
                                  }
                                  alt={`avatar ${
                                    msg.sender === "You" ? "You" : "Other"
                                  }`}
                                  style={{ width: "30px", height: "80%" }}
                                />
                                <div></div>
                              </div>
                            ) : (
                              <div className="d-flex flex-row">
                                <img
                                  src={
                                    msg.sender === "You"
                                      ? `${userIconSrc}`
                                      : `${otherIconSRC}`
                                  }
                                  alt={`avatar ${
                                    msg.sender === "You" ? "You" : "Other"
                                  }`}
                                  style={{ width: "35px", height: "80%" }}
                                />
                                <div>
                                  <p
                                    className="small p-2 ms-3 mb-1 rounded-3"
                                    style={{ backgroundColor: "#f5f6f7" }}
                                  >
                                    {msg.message}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                     
                    </div>
                   <div className="d-flex justify-content-between align-items-center">
                      <img
                        src={`${userIconSrc}`}
                        alt="avatar 3"  
                        style={{ width: "35px", height: "80%" }}                      
                      />
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="exampleFormControlInput3"
                        placeholder="Type message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button
                        onClick={handleSendMessage}                   
                      >
                        {" "}
                        Send
                      </button> 
                  </div>                  
              </div>                                     
          )}       
    
    </div>
  );
}

export default ChatRoom;
