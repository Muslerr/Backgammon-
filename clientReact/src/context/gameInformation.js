import { createContext, useContext, useState } from "react";

const gameInformationContext = createContext({});
export function useGameInformation() {
  return useContext(gameInformationContext);
}
export function GameInformationProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [opponent, setOpponent] = useState();
  const [icon, setIcon] = useState(localStorage.getItem("icon"));
  const [gameInvites, setGameInvites] = useState([]);
  const [CurrentInvite, setCurrentInvite] = useState();


  const contextValue = {
    user,
    setUser,
    token,
    setToken,
    opponent,
    setOpponent,
    icon,
    setIcon,
    gameInvites,
    setGameInvites,
    CurrentInvite, 
    setCurrentInvite
  };

  return (
    <gameInformationContext.Provider value={contextValue}>
      {children}
    </gameInformationContext.Provider>
  );
}
