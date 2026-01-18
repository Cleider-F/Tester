importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

// Inicializa Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCAJPyQ7-a4Efxh5yTXQ_326hn22OYAUc",
  authDomain: "pedidos-almoxarifado.firebaseapp.com",
  projectId: "pedidos-almoxarifado",
  storageBucket: "pedidos-almoxarifado.appspot.com",
  messagingSenderId: "443882865992",
  appId: "1:443882865992:web:1afcc37c29bd8800eedf7d"
});

const messaging = firebase.messaging();

// Recebe notificação em background
messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/suzano-logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
