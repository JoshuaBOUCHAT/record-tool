import React, { useEffect, useState } from "react";

export default function WebSocketTest() {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8070/api/ws/");
        setWs(socket);

        socket.onopen = () => {
            console.log("WebSocket connected");
            socket.send("Hello from React!");
        };

        socket.onmessage = (event) => {
            setMessages((msgs) => [...msgs, event.data]);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send("Message from React button!");
        }
    };

    return (
        <div>
            <button onClick={sendMessage}>Send Message</button>
            <div>
                <h3>Messages:</h3>
                <ul>
                    {messages.map((msg, i) => (
                        <li key={i}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
