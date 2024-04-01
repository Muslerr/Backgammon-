import React, { useState, useEffect } from "react";
import HttpActiveService from "../../../services/HttpActiveService";
import socketIo from "socket.io-client";
import style from "./usersList.module.css";
import UserBlock from "../userBlock/userBlock";
import { useChatRoom } from "../../../context/chatRooms";
import ChatService from "../../../services/SocketChatService";
import GameService from "../../../services/SocketGameService";
import { useGameInformation } from "../../../context/gameInformation";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const socketActiveUsers = socketIo(
  process.env.REACT_APP_ACTIVE_SERVICE_BASE_URL
);

function UsersList({ list, onChatOpen }) {
  const { user, token, setOpponent, setGameInvites,setCurrentInvite,opponent } = useGameInformation();
  const filteredList = list.filter((u) => u.username !== user);
  const [activeUserslist, setActiveUserslist] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { chatRoomsId, setChatRoomsId, messagesReceived, setMessagesReceived,isChatRoomOpen,setChatRoomOpen } = useChatRoom();
  const navigate = useNavigate();
  useEffect(() => {
    ChatService.initialize(user, setMessagesReceived, setChatRoomsId);
      
  }, []);
  
  const sortList = (listToSort) => {
    const sorted = listToSort.slice().sort((a, b) => {
      const aIsOnline = activeUserslist.includes(a.username);
      const bIsOnline = activeUserslist.includes(b.username);

      if (aIsOnline && !bIsOnline) {
        return -1;
      } else if (!aIsOnline && bIsOnline) {
        return 1;
      } else {
        return 0;
      }
    });
    setSortedList(sorted);
  };

  useEffect(() => {
    const httpServiceActive = new HttpActiveService();
    const fetchData = async () => {
      try {
        const response = await httpServiceActive.getActiveUsers(token);
        setActiveUserslist(response.data);
      } catch (error) {
        
        toast.error('an error ocurred , please login again', {
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
    }
    fetchData();
    socketActiveUsers.on("userDisconnected", (username) => {
      console.log(`User ${username} logged off`);
      setActiveUserslist((prev) => prev.filter((user) => user !== username));
      setGameInvites((prevGameInvites) => ({
        ...prevGameInvites,
        [username]: null,
      }));
    });

    socketActiveUsers.on("userConnected", (username) => {
      console.log(`User ${username} logged in`);
      setActiveUserslist((prev) => [...prev, username]);
    });

    return () => {
      socketActiveUsers.off("connect");
      socketActiveUsers.off("userDisconnected");
      socketActiveUsers.off("userConnected");
    };
  }, []);

  useEffect(() => {
    sortList(filteredList);
  }, [activeUserslist]);

  const handleUserClick = (username) => {
    if(selectedUser==username){
      setSelectedUser("");
    }
    else{
    setSelectedUser(username);}
  };

  const handleChatOpen = (username) => {
    setSelectedUser(username);
    onChatOpen(username, chatRoomsId[username], messagesReceived[username]);
  };
  useEffect(() => {
    sortList(filteredList);
  }, []);

  return (
    <div >
      <ToastContainer />
      <button className={style.minimizeButton} onClick={() => setMinimized(!minimized)}> {minimized ? <img  src="/gameIcons/maximize.png"></img> : <img  src="/gameIcons/minimise.png"></img>}</button>
      <div className={`${style.userlistcontainer} ${minimized ? style.minimized : ''}`} >                          
        {!minimized && (
          <div>
            {sortedList.map((item) => (
              <UserBlock
                key={item.username}
                username={item.username}
                isActive={activeUserslist.includes(item.username)}
                icon={item.icon}
                isSelected={item.username === selectedUser}
                onClick={() => handleUserClick(item.username)}
                onChatOpen={() => handleChatOpen(item.username)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersList;
