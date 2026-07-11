import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom doesn't implement <dialog>'s imperative API (showModal/close), which
// RoomFormDialog relies on. Polyfill the bare minimum so tests can drive it
// the same way a real browser does.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    const wasOpen = this.open;
    this.open = false;
    if (wasOpen) {
      this.dispatchEvent(new Event('close'));
    }
  };
}

afterEach(() => {
  cleanup();
});
