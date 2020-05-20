/**
 * Returns the server address as specified in config.
 * Connects to ws://localhost:5000 if REACT_APP_SALAD_HOST is defined in your .env file
 */
export function getServerAddress() {
  return process.env.REACT_APP_SALAD_HOST || "ws://localhost:5000";
}

/**
 * Returns url for the current game that can be accessed to join the game
 * @param {Room} room room to get url for
 */
export function roomUrl(room) {
  const gameUrl = `/game/${room.id}`;
  return `${window.document.location.host}${gameUrl}`;
}
