import React, { useState, useEffect } from "react";
import style from "./userBlock.module.css";
import ChatRoom from "../chatRoom/chatRoom"; // Update the import path if needed
import ReactDOM from "react-dom";
import { useChatRoom } from "../../../context/chatRooms";
import GameService from "../../../services/SocketGameService";
import { useGameInformation } from "../../../context/gameInformation";

function UserBlock({ username, isActive,icon,isSelected, onClick,onChatOpen,}) {
  const iconSRC = "icons/" + icon;
  const gameService = GameService;
  const { token, user, gameInvites, setgameInvites,CurrentInvite, setCurrentInvite } = useGameInformation();
  const [doubleClick, setDoubleClick] = useState(false);
  const { chatRoomsId, setChatRoomsId, messagesReceived, setMessagesReceived } =useChatRoom();
  const [unreadMessages, setUnreadMessages] = useState();
  const [readMessages, setreadMessages] = useState(0);
  useEffect(() => {
    let timer;
    if (doubleClick) {
      timer = setTimeout(() => {
        setDoubleClick(false);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [doubleClick]);

  useEffect(() => {
    const unreadCount =
      messagesReceived[username] &&
      messagesReceived[username].filter((message) => message.sender !== "You")
        .length;
    setUnreadMessages(unreadCount > 0 ? unreadCount - readMessages : 0);
  }, [messagesReceived[username]]);

  const handleDoubleClick = () => {
    setDoubleClick(true);
    handleChatIconClick();
  };

  const handleChatIconClick = (e) => {
    if (isActive) {
      setUnreadMessages(0);
      setreadMessages(
        messagesReceived[username] ? messagesReceived[username].length : 0
      );
      onChatOpen(username);
    } else {
      alert("Chat can only happen if the user is connected");
    }
  };

  const handleGameIconClick = (e) => {
    if (isActive && CurrentInvite==null) {      
      gameService.inviteToGame(username, token);
      console.log(token);
    } else {
      alert("you can only send one request at a time to an active user");
    }
  };
  const handleAcceptIconClick = (e) => {
    GameService.acceptGameInvite(token, username);
  };
  const handleDeclineIconClick = (e) => {
    GameService.declineGameInvite(token,username);
    console.log('Decline icon clicked');
  };

  useEffect(() => {}, [gameInvites]);

  return (
    <div
      className={`${style.userItem} ${isSelected ? style.selected : ""}`}
      onClick={gameInvites[username] ? null: onClick}
      onDoubleClick={gameInvites[username] ? null : handleDoubleClick}
    >
      <div className={style.userContent}>
        <div
          className={style.userCircle}
          style={{
            backgroundColor: isActive ? "green" : "black",
          }}
        >
          <div
            className={style.userImage}
            style={{
              backgroundImage: `url(${iconSRC})`,
            }}
          />
        </div>
        {gameInvites[username] && gameInvites[username].sender == username && (
          <div>
            <p>want to play?</p>
            <div className={style.iconContainerGame}>
              <div className={style.icon} onClick={handleAcceptIconClick}>
                <img
                  src="/gameIcons/check-mark.png"
                  alt="Chat Icon"
                  className={style.iconImage}
                />
              </div>
              <div className={style.icon} onClick={handleDeclineIconClick}>
                <img
                  src="/gameIcons/remove.png"
                  alt="Chat Icon"
                  className={style.iconImage}
                />
              </div>
            </div>
          </div>
        )}
        {gameInvites[username] && gameInvites[username].sender == user && (
          <div>
            <p>waiting for reply</p>
          </div>
        )}
          {isSelected && !gameInvites[username] && (
          <div className={style.iconContainer}>
            <div className={style.icon} onClick={handleChatIconClick}>
              <img
                src="/gameIcons/chat.png"
                alt="Chat Icon"
                className={style.iconImage}
              />
            </div>
            <div className={style.icon} onClick={handleGameIconClick}>
              <img
                src="/gameIcons/backgammon.png"
                alt="Game Icon"
                className={style.iconImage}
              />
            </div>
          </div>
        )}
        <div className={style.userName}>{username} </div>
        {messagesReceived[username] && unreadMessages > 0 && (
          <div className={style.unreadMessages}>
            {unreadMessages > 0 && <span>{unreadMessages}</span>}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default UserBlock;
