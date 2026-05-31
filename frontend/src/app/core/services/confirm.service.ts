import { Injectable, signal } from '@angular/core';

export interface ConfirmState {
  title: string;
  message: string;
  type: 'danger' | 'safe';
  confirmText: string;
  action: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  state = signal<ConfirmState | null>(null);

  show(title: string, message: string, type: 'danger' | 'safe', confirmText: string, action: () => void) {
    this.state.set({ title, message, type, confirmText, action });
  }

  close() {
    this.state.set(null);
  }

  execute() {
    const s = this.state();
    if (s) {
      s.action();
      this.close();
    }
  }
}
