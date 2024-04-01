import { createContext,useContext, useState } from "react";

const chatRoomsContext = createContext({});
export function useChatRoom(){
    return useContext(chatRoomsContext);
}
export function ChatRoomProvider({children}){
    const [chatRoomsId, setChatRoomsId] = useState([]);
    const [messagesReceived, setMessagesReceived] = useState([]);
    const[isChatRoomOpen,setChatRoomOpen] =useState(false);
return (<chatRoomsContext.Provider value ={{chatRoomsId,setChatRoomsId,messagesReceived,setMessagesReceived,isChatRoomOpen,setChatRoomOpen}}>{children}</chatRoomsContext.Provider>)
}