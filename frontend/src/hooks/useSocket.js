import { useEffect, useRef } from "react";

export const useSocket = (path = "/chat") => {
  const wsRef = useRef(null);
  const url = import.meta.env.VITE_WS_URL || "ws://localhost:6001";

  useEffect(() => {
    try {
      const socket = new WebSocket(url + path);
      wsRef.current = socket;
    } catch (err) {
      console.warn("WebSocket init failed:", err.message || err);
      wsRef.current = null;
    }

    return () => {
      try {
        wsRef.current?.close();
      } catch (e) {}
    };
  }, [url, path]);

  const send = (payload) => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
    } catch (err) {}
  };

  return { wsRef, send };
};
