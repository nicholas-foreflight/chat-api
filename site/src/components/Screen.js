import React, { useEffect, useRef, useState } from 'react';
import Lottie from "lottie-react";
import loading from "./loading.json";

const Screen = ({driverIp, setIsDriverConnected}) => {
    const [image, setImage] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        setIsDriverConnected(false);

        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = driverIp;
        const port = ':8182';
        const wsurl = `${protocol}${host}${port}/stream`;

        ws.current = new WebSocket(wsurl);

        ws.current.onopen = () => {
            console.log("WebSocket connection established");
        };
        ws.current.onmessage = (event) => {
            try {
                setIsDriverConnected(true);
                const data = JSON.parse(event.data);
                if (data.message) {
                    const base64Image = `data:image/png;base64,${data.message}`;
                    setImage(base64Image);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message: ", error);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };

        ws.current.onclose = () => {
            setIsDriverConnected(false);
            console.log("WebSocket connection closed");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return (
        image === '' ? (
            <div style={{
                width: "1200px",
                height: "760px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Lottie animationData={loading} style={{ width: "120px" }} />
            </div>
        ) : (
            <img
                src={image}
                alt="Live Stream"
                style={{
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: "8px",
                    maxWidth: "100%",
                    height: "auto",
                    cursor: "pointer",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "transparent",
                    MozUserSelect: "none",
                    WebkitUserSelect: "none",
                    msUserSelect: "none"
                }}
            />
        )
    );
};

export default Screen;