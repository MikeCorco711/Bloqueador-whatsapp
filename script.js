const DEFAULT_TIME = 60;
const COINS_PER_PURCHASE = 5;
const TIME_PER_SESSION = 10;

let timeLeft = 0;
let coins = 0;
let lastUsedDate = null;
let sessionActive = false;
let sessionInterval;

function loadData() {
  const data = JSON.parse(localStorage.getItem('whatsappBlockerData')) || {};
  const today = new Date().toDateString();

  if (data.date !== today) {
    timeLeft = DEFAULT_TIME;
    lastUsedDate = today;
  } else {
    timeLeft = data.timeLeft || DEFAULT_TIME;
    coins = data.coins || 0;
    lastUsedDate = data.date;
  }
}

function saveData() {
  localStorage.setItem('whatsappBlockerData', JSON.stringify({
    timeLeft,
    coins,
    date: new Date().toDateString()
  }));
}

function updateUI() {
  document.getElementById('timeLeft').innerText = timeLeft;
  document.getElementById('coins').innerText = coins;
  document.getElementById('lastUsed').innerText = lastUsedDate || '---';
}

function showNotification(msg, isSuccess = true) {
  const el = document.getElementById("notification");
  el.innerText = msg;
  el.style.background = isSuccess ? "#d4edda" : "#f8d7da";
  el.style.color = isSuccess ? "#155724" : "#721c24";
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 3000);
}

function startSession() {
  if (sessionActive) return;

  if (timeLeft >= TIME_PER_SESSION) {
    sessionActive = true;
    let minutesLeft = TIME_PER_SESSION;
    showNotification("Sesión iniciada: 10 minutos disponibles");

    sessionInterval = setInterval(() => {
      minutesLeft--;
      timeLeft--;
      updateUI();
      saveData();

      if (minutesLeft <= 0) {
        clearInterval(sessionInterval);
        sessionActive = false;
        showNotification("Sesión terminada.", false);
      }
    }, 60000);
  } else if (coins > 0) {
    const confirmUse = confirm(`Se acabó tu tiempo. ¿Quieres usar 1 moneda para añadir ${TIME_PER_SESSION} minutos?`);
    if (confirmUse) {
      coins--;
      timeLeft += TIME_PER_SESSION;
      updateUI();
      saveData();
      showNotification("Se han añadido 10 minutos con 1 moneda.");
    }
  } else {
    showNotification("No te queda tiempo ni monedas. Compra más para continuar.", false);
  }

  lastUsedDate = new Date().toLocaleString();
}

function buyCoins() {
  const confirmBuy = confirm(`¿Quieres comprar ${COINS_PER_PURCHASE} monedas por 1€?`);
  if (confirmBuy) {
    coins += COINS_PER_PURCHASE;
    showNotification("¡Compra exitosa!");
    saveData();
    updateUI();
  }
}

// Inicialización
loadData();
updateUI();
