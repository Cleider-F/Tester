/* firebase-messaging-sw.js */
/* 🔴 NÃO usar import ES module aqui */

/* Firebase compat (obrigatório no Service Worker) */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

/* Config Firebase */
firebase.initializeApp({
  apiKey: "AIzaSyCAJPyQ7-a4Efxxh5yTXQ_326hn22OYAuc",
  authDomain: "pedidos-almoxarifado.firebaseapp.com",
  projectId: "pedidos-almoxarifado",
  storageBucket: "pedidos-almoxarifado.firebasestorage.app",
  messagingSenderId: "443882865992",
  appId: "1:443882865992:web:1afcc37c29bd8800eedf7d"
});

/* Messaging */
const messaging = firebase.messaging();

/* Push em background */
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Push recebido:", payload);

  const title = payload.notification?.title || "📦 Novo pedido";
  const options = {
    body: payload.notification?.body || "Um novo pedido foi registrado",
    icon: "/Tester/icon-192.png", // ajuste se quiser
    badge: "/Tester/icon-192.png",
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

/* Clique na notificação */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("/Tester/admin.html")
  );
});