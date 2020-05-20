export function handleRoomChanges(room) {
  room.onStateChange.once((state) => {
    this.setState({ state: state.state, messages: state.messages });
  });
  /**
   * 1. Look up players on state
   * 2. Perform modifications
   * 3. Transform players into a more usable list form
   * 4. Update state
   * @param {func} modify Functikon called when modifying playerlist
   */
  const handlePlayerListChange = (modify) => (player, sessionId) => {
    const players = { ...this.state.players };
    modify(players, player, sessionId);
    const playerList = this.generatePlayerList(players);
    this.setState({ players, playerList });
  };
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
    this.setState(updatedState);
    let playerList = this.generatePlayerList(this.state.players);
    this.setState({ playerList });
  };
  // Show toast when you disconnect from the room
  room.onLeave((code) => {
    window.M.toast({ html: "Disconnected" });
    this.setState({ disconnected: true });
  });
  /**
   * Update lastPing when message is received.
   * - lastPing is continously sent from the backend to keep connected clients alive
   */
  room.onMessage((msg) => {
    if (msg && msg.type === "ping") {
      this.setState({ lastPing: new Date() });
    }
  });
}
