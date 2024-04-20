import React, { createContext, useContext, useEffect, useState } from "react";
import { WebSocketManager } from "./websocket_manager";

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
    const [manager, setManager] = useState(null)

    useEffect(() => {
        console.log("hhhhhhhh")
        const wsManager = new WebSocketManager('ws://localhost:8080/ws')
        setManager(wsManager)
        wsManager.connect()
        
        // return wsManager.disconnect()
    }, [])

    return (
        <WebSocketContext.Provider value={manager}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocketManager = () => useContext(WebSocketContext)