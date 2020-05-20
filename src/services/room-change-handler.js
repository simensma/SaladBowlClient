/**
 * Set up listeners for colyseus.io room events
 * @param {Room} room room to listen to events for
 * @param {func} onChange called whenever the room state has been updated
 * @param {func} playerProvider function that returns a list of the current players
 */
export function handleRoomChanges(room, onChange, playerProvider) {
  /**
   * 1. Look up players on state
   * 2. Perform modifications
   * 3. Transform players into a more usable list form
   * 4. Update state
   * @param {func} modify Function called when modifying playerlist
   */
  const handlePlayerListChange = (modify) => (player, sessionId) => {
    const players = { ...playerProvider() };
    modify(players, player, sessionId);
    const playerList = generatePlayerList(players);
    onChange({ players, playerList });
  };

  /**
   * The room emits its full current state when a client connects
   */
  room.onStateChange.once((state) => {
    onChange({ state: state.state, messages: state.messages });
  });

  // Add player to players list when joined room
  room.state.players.onAdd = handlePlayerListChange(
    (players, player, sessionId) => (players[sessionId] = player)
  );
  // Remove player from players list when removed from room
  room.state.players.onRemove = handlePlayerListChange(
    (players, player, sessionId) => delete players[sessionId]
  );
  // Update the given player when changed
  room.state.players.onChange = handlePlayerListChange(
    (players, player, sessionId) => (players[sessionId] = player)
  );
  /**
   * Update the game state when it changes.
   * `st` is in the form of [{field: field1, value: value1}, {...}, ...]
   * So transform it to {field1: value2, field2: value2, ...} and use that to update the current state.
   */
  room.state.onChange = (st) => {
    let updatedState = st.reduce((res, { field, value }) => {
      res[field] = value;
      return res;
    }, {});
    onChange(updatedState);
    let playerList = generatePlayerList(playerProvider());
    onChange({ playerList });
  };

  // Show toast when you disconnect from the room
  room.onLeave((code) => {
    window.M.toast({ html: "Disconnected" });
    onChange({ disconnected: true });
  });

  /**
   * Update lastPing when message is received.
   * - lastPing is continously sent from the backend to keep connected clients alive
   */
  room.onMessage((msg) => {
    if (msg && msg.type === "ping") {
      onChange({ lastPing: new Date() });
    }
  });
}

function generatePlayerList(playersObj) {
  let players = [];

  for (let id in playersObj) {
    players.push(playersObj[id]);
  }

  return players;
}
