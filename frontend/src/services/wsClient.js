export function createWSClient({
  url = `ws://localhost:3001`,
  onOpen,
  onMessage,
  onError,
  onClose,
  protocols,
} = {}) {
  const ws = new WebSocket(url, protocols);

  ws.onopen = () => {
    console.log("WebSocket connected");
    if (onOpen) onOpen(ws);
  };

  ws.onmessage = (event) => {
    if (onMessage) onMessage(event);
  };

  ws.onerror = (event) => {
    console.error("WebSocket error:", event);
    if (onError) onError(event);
  };

  ws.onclose = (event) => {
    console.warn("WebSocket closed:", event);
    if (onClose) onClose(event);
  };

  return ws;
}
