import React from 'react';
import style from "./navigationBar.module.css"
import GameService from '../../../services/SocketGameService';
import { useGameInformation } from '../../../context/gameInformation';
import { useState } from 'react';
import { useChatRoom } from '../../../context/chatRooms';
import HttpLoginService from '../../../services/HttpLoginService';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
    const {user,setToken, opponent,setOpponent, icon,setIcon} = useGameInformation();
    const {setMessagesReceived}=useChatRoom();
    const[list,setList] =useState( location.state?.list || []);  
    const httpLoginService = new HttpLoginService();
    const gameService = GameService;
    const navigate = useNavigate();  
      const handlelogOut = () => {
          setToken("");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("icon");
          gameService.ResetGameData();
          setMessagesReceived([]);
          setOpponent(null);
          httpLoginService.logout(user);
          navigate("/");
        };
       
  
    return (
    <nav>    
      <ul>
        <li><h5>welcome {user}</h5></li>
        <li><a href="/" onClick={handlelogOut}>Login</a></li>
        <li><a href="/registration">Registration</a></li>
        <li><a href="/homepage">Homepage</a></li>
        <li><a href="/" onClick={handlelogOut}>Logout</a></li>       
        
      </ul>
    </nav>
  );
}

export default NavigationBar;