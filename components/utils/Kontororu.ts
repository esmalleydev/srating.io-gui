
// コントロール

class Kontororu extends EventTarget {
  constructor() {
    super();
    this.listeners = {};
  }

  private listeners: object;

  addEventListener(type, listener) {
    super.addEventListener(type, listener);

    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    super.removeEventListener(type, listener);

    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
    }
  }

  getListeners(type) {
    return this.listeners[type] || [];
  }
}

export default Kontororu;
