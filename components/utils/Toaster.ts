
// Handles toast components throughout the app

export interface ToastItem {
  id: number;
  message: string;
  type: string;
  exiting?: boolean;
}

// Define the shape of the listener function
export type ToastListener = (toasts: ToastItem[]) => void;

class Toaster {
  private listeners: ToastListener[] = [];

  private toasts: ToastItem[] = [];

  // React component will subscribe to this
  subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  requestClose(id: number) {
    this.toasts = this.toasts.map((t) => {
      if (t.id === id) {
        return { ...t, exiting: true };
      }
      return t;
    });
    this.notify();
  }

  add(message: string, type = 'info') {
    const id = Date.now();
    this.toasts = [...this.toasts, { id, message, type }];
    this.notify();

    // Auto-remove
    setTimeout(() => {
      this.requestClose(id);
    }, 4000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

export const toaster = new Toaster();

// Helper function for cleaner usage in your app
export const toast = {
  info: (msg: string) => toaster.add(msg, 'info'),
  error: (msg: string) => toaster.add(msg, 'error'),
  success: (msg: string) => toaster.add(msg, 'success'),
};
