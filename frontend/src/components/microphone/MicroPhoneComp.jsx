import React, { useEffect, useRef, useState } from "react";

export default function MicroPhoneComp() {
    const [messages, setMessages] = useState([]);
    const wsRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket("wss://127.0.0.1/api/ws/");
        wsRef.current = socket;

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

    const activateMicrophone = async () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.log("WebSocket pas prêt");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0 && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(event.data);
                }
            };

            mediaRecorderRef.current.start(100); // chunk toutes les 100ms

            console.log("Micro activé et streaming démarré");
        } catch (err) {
            console.error("Erreur accès micro", err);
        }
    };

    const stopMicrophone = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            console.log("MediaRecorder stopped");
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            console.log("Stream tracks stopped");
        }
    };

    return (
        <div>
            <button onClick={activateMicrophone}>Activer le micro</button>
            <button onClick={stopMicrophone}>Arrêter le micro</button>

            <div>
                <h3>Messages reçus :</h3>
                <ul>
                    {messages.map((msg, i) => (
                        <li key={i}>{msg.toString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
