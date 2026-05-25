type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export function subscribeApiMessage(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyApiMessage(message: string) {
  const trimmed = message.trim();
  if (!trimmed) return;
  listeners.forEach((listener) => listener(trimmed));
}
