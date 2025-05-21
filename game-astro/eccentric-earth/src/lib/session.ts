export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID(); // o nanoid()
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}