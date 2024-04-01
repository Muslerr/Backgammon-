import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HttpService from "../../../services/HttpLoginService";
import UsersList from "../usersList/usersList";
import ChatRoom from "../chatRoom/chatRoom";
import style from "./homePage.module.css";
import HttpLoginService from "../../../services/HttpLoginService";
import { Link, useNavigate } from "react-router-dom";
import { useChatRoom } from "../../../context/chatRooms";
import { useGameInformation } from "../../../context/gameInformation";
import GameBoardComponent from "../../game/gameBoard/GameBoard";
import GameService from "../../../services/SocketGameService";
import { useBoardContext } from "../../../context/boardContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(false);
  const {
    user,
    setUser,
    token,
    setToken,
    opponent,
    setOpponent,
    icon,
    setIcon,
    setGameInvites,
    setCurrentInvite,
  } = useGameInformation();
  const [list, setList] = useState(location.state?.list || []);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [selectedUserIcon, setSelectedUserIcon] = useState(null);
  const httpLoginService = new HttpLoginService();
  const { setMessagesReceived, setChatRoomOpen } = useChatRoom();
  const gameService = GameService;
  const {
    board,
    InitializeGame,
    handlePlaySent,
    handleLastPlaySent,
    handlePlayerWon,
  } = useBoardContext();

  const handleChatOpen = (username) => {
    setSelectedChatUser(username);
    const selectedUser = list.find((user) => user.username === username);
    if (selectedUser) {
      setSelectedUserIcon(selectedUser.icon);
    }
  };

  useEffect(() => {
    if (list.length < 1 || token == "") {
      toast.error(" please login before trying to go the homePage", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/"); // Navigate to the home route
      }, 3000); // 3000 milliseconds = 3 seconds
    }
    GameService.initialize(
      user,
      setGameInvites,
      setOpponent,
      setCurrentInvite,
      opponent,
      handlePlaySent,
      handleLastPlaySent,
      handlePlayerWon
    );
  }, []);

  const handleChatClose = () => {
    setSelectedChatUser(null);
    setChatRoomOpen(false);
  };

  useEffect(() => {
    if (opponent != null) {
      console.log(gameService.playerColor);
      InitializeGame(gameService.playerColor);
      setShowGame(true);
    } else {
      setShowGame(false);
    }
  }, [opponent]);

  return (
    

<div className={style.homePage}>
<div className={style.usersAndChatContainer}>
  <div className={style.userListContainer} style={{ height: selectedChatUser ? '70%' : '100%' }}>
    <UsersList list={list} onChatOpen={handleChatOpen} />
  </div>
  {selectedChatUser && (
    <div className={style.chatRoomContainer}>
      <ChatRoom
        selectedUsername={selectedChatUser}
        onClose={handleChatClose}
        iconSelectedUser={selectedUserIcon}
      />
    </div>
  )}
</div>
  <div className={style.content}>
    {showGame && (
      <div className={style.gameBoardContainer}>
        <GameBoardComponent initialGameBoard={board} />
      </div>
    )}
  </div>
</div>

  
  );
}

export default HomePage;
