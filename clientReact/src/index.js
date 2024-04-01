import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ChatRoomProvider } from "./context/chatRooms";
import { GameInformationProvider } from "./context/gameInformation";
import { BoardProvider } from "./context/boardContext";
import { Provider } from 'react-redux';
import store from './redux/store';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BoardProvider>
  <Provider store={store}>  
  <GameInformationProvider>
  <ChatRoomProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChatRoomProvider>
  </GameInformationProvider>  
  </Provider>
  </BoardProvider>
);

reportWebVitals();
