/**
 * Returns the server address as specified in config.
 * Connects to ws://localhost:5000 if REACT_APP_IS_DEV_ENV is defined in your .env file
 */
export function getServerAddress() {
  if (process.env.REACT_APP_IS_DEV_ENV === "true") {
    const host = window.document.location.host.replace(/:.*/, "");
    return (
      location.protocol.replace("http", "ws") +
      "//" +
      host +
      (location.port ? ":" + 5000 : "")
    );
  } else {
    return "wss://mighty-sands-84244.herokuapp.com";
  }
}

/**
 * Returns url for the current game that can be accessed to join the game
 * @param {Room} room room to get url for
 */
export function roomUrl(room) {
  const gameUrl = `/game/${room.id}`;
  return `${window.document.location.host}${gameUrl}`;
}
