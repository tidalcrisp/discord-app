const app = document.getElementById("app");

const discord = new DiscordEmbeddedAppSDK();
await discord.ready();

// Shared state key
const STATE_KEY = "currentScreen";

// Helper to read shared state
async function getState() {
  const { value } = await discord.instance.storage.get(STATE_KEY);
  return value || "hub";
}

// Helper to write shared state
async function setState(value) {
  await discord.instance.storage.set(STATE_KEY, value);
  render();
}

// Get participants
async function getPlayers() {
  const channel = await discord.getChannel();
  return channel.voice_states ?? [];
}

// Render logic
async function render() {
  const screen = await getState();
  const players = await getPlayers();

  if (screen === "hub") {
    app.innerHTML = `
      <h1>Board Night Hub (POC)</h1>
      <p>Players:</p>
      <ul>
        ${players.map(p => `<li>${p.user?.username ?? "Unknown"}</li>`).join("")}
      </ul>
      <button id="gameA">Launch Game A</button>
    `;

    document.getElementById("gameA").onclick = () => {
      setState("gameA");
    };
  }

  if (screen === "gameA") {
    app.innerHTML = `
      <h1>Game A Placeholder</h1>
      <p>This is not a game. It is a proof.</p>
      <button id="back">Back to Hub</button>
    `;

    document.getElementById("back").onclick = () => {
      setState("hub");
    };
  }
}

// Re-render when storage changes (other players click things)
discord.instance.storage.on("update", render);

// Initial render
render();
