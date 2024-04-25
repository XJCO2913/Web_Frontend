import React, { createContext, useContext, useEffect, useState } from "react";
import { WebSocketManager } from "./websocket_manager";

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
    const [wsManager, setWsManager] = useState(null)

    return (
        <WebSocketContext.Provider value={{ wsManager, setWsManager }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocketManager = () => useContext(WebSocketContext)