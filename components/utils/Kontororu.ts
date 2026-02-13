
// コントロール

class Kontororu extends EventTarget {
  constructor() {
    super();
    this.listeners = {};
  }

  private listeners: {
    [type: string]: Array<(...args: unknown[]) => void>;
  };

  addEventListener(type: string, listener: (...args: unknown[]) => void) {
    super.addEventListener(type, listener);

    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (...args: unknown[]) => void) {
    super.removeEventListener(type, listener);

    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
    }
  }

  getListeners(type: string) {
    return this.listeners[type] || [];
  }
}

export default Kontororu;
