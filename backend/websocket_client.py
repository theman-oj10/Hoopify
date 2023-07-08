import websocket
import time

def on_open(ws):
    print("WebSocket connection opened")

def on_message(ws, message):
    print("Received message:", message)

def on_close(ws):
    print("WebSocket connection closed")

def on_error(ws, error):
    print("WebSocket error:", error)

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(
        "ws://localhost:5000/socket.io/?transport=websocket",
        on_open=on_open,
        on_message=on_message,
        on_close=on_close,
        on_error=on_error
    )
    ws.run_forever()
