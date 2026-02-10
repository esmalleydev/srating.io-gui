
import Kontororu from '../Kontororu';


const hostname = process.env.NEXT_PUBLIC_WS_HOST;
const port = process.env.NEXT_PUBLIC_WS_PORT;
const path = process.env.NEXT_PUBLIC_WS_PATH;



type SocketMessage = {
  type: 'subscribe' | 'unsubscribe';
  table: string;
  id: string;
}

type SocketResponseMessage = {
  table: string;
  id: string;
  data: object;
}

class Socket extends Kontororu {
  // constructor() {
  //   super();
  // }

  private ws?: WebSocket;

  private protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

  private url = `${this.protocol}//${hostname}:${port}/${path}`;

  private session_id: string;

  private message_queue: SocketMessage[] = [];

  private reconnect_attempts: number = 0;

  private should_reconnect = true;

  private reconnect_timeout: NodeJS.Timeout;

  public connect(session_id: string) {
    if (!session_id) {
      console.warn('session_id required to open ws');
      return;
    }

    if (
      this.ws &&
      (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      )
    ) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.session_id = session_id;

    this.ws.addEventListener('open', (event) => this.handle_open(event));
    this.ws.addEventListener('message', (event) => this.handle_message(event));
    this.ws.addEventListener('close', (event) => this.handle_close(event));
    this.ws.addEventListener('error', (event) => this.handle_error(event));
  }

  /**
   * Send message if the websocket is open,
   * otherwise add it to the message queue
   */
  public message({ type, table, id }: SocketMessage) {
    const payload = { type, table, id };

    if (
      this.ws &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      this.ws.send(JSON.stringify(payload));
    } else {
      this.message_queue.push(payload);
    }
  }

  public disconnect() {
    // if we are manually disconnecting we do not want an auto reconnect
    this.should_reconnect = false;
    this.ws?.close();
    this.ws = undefined;
    if (this.reconnect_timeout) {
      clearTimeout(this.reconnect_timeout);
    }
  }

  private handle_open(event: Event) {
    // clear reconnect timeout if we connected
    if (this.reconnect_timeout) {
      clearTimeout(this.reconnect_timeout);
    }
    // reset the reconnect attempts
    this.reconnect_attempts = 0;

    this.ws?.send(JSON.stringify({ type: 'session', table: 'session', id: this.session_id }));

    while (this.message_queue.length > 0) {
      const queuedMsg = this.message_queue.shift();
      this.ws?.send(JSON.stringify(queuedMsg));
    }
  }

  private handle_message(event: MessageEvent) {
    try {
      // todo not sure I like this
      const messageEvent = new CustomEvent('message', {
        detail: JSON.parse(event.data) as SocketResponseMessage,
        bubbles: true,
      });

      this.dispatchEvent(messageEvent);
    } catch (e) {
      const messageEvent = new CustomEvent('message', {
        detail: event.data as SocketResponseMessage,
        bubbles: true,
      });
      this.dispatchEvent(messageEvent);
    }
  }

  private handle_close(event: CloseEvent) {
    if (this.should_reconnect) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnect_attempts), 30000);
      console.log(`Connection lost. Retrying in ${delay}ms... (Attempt ${this.reconnect_attempts + 1})`);

      this.reconnect_timeout = setTimeout(() => {
        this.reconnect_attempts++;
        this.connect(this.session_id);
      }, delay);
    }

    this.ws = undefined;
  }

  private handle_error(event: Event) {
    console.error('WebSocket Error:', event);
    this.ws?.close();
  }
}

export const socket = new Socket();
