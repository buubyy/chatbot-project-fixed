document.getElementById("send-btn").addEventListener("click", async () => {
  const input = document.getElementById("user-input").value;
  if (!input) return;

  const chatBox = document.getElementById("chat-box");

  const userMessage = document.createElement("div");
  userMessage.className = "user-message";
  userMessage.innerText = input;
  chatBox.appendChild(userMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/.netlify/functions/dialogflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input })
    });
    const data = await response.json();

    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.innerText = data.reply || "🤖 (no reply)";
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error(err);
  }

  document.getElementById("user-input").value = "";
});