// assets/js/chat.js

window.addEventListener('DOMContentLoaded', () => {
  // Sólo inicializar si existe #chat-container
  if (!document.getElementById('chat-container')) return;

  const chatList   = document.getElementById('chat-list');
  const inputField = document.getElementById('input-field');
  const sendBtn    = document.getElementById('send-btn');
  let step = 'ask_name';

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    chatList.appendChild(div);
    chatList.scrollTop = chatList.scrollHeight;
  }

  async function send(answer = '') {
    const res = await fetch('/Chatbot/apis/chat.php', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({step,answer})
    });
    const data = await res.json();
    if (!data.ok) return addMessage(data.message,'bot');
    if (data.question) {
      addMessage(data.question,'bot');
      step = data.nextStep;
    } else if (data.ready_schedule) {
      addMessage(data.message,'bot');
      step = 'schedule';
    } else {
      addMessage(data.message,'bot');
    }
  }

  sendBtn.onclick = () => {
    const val = inputField.value.trim();
    if (!val) return;
    addMessage(val,'user');
    inputField.value = '';
    send(val.toLowerCase());
  };

  // Primera pregunta
  send();
});
// Manejo de Enter para enviar mensajes
document.getElementById('input-field').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('send-btn').click();
  }
}
);