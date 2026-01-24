const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const messaging = admin.messaging();

const TELEGRAM_TOKEN = "8229775934:AAEEIKF5ffP_rVvbosRilvPyb3wZ0fVBFLU";
const CHAT_ID = "-1003671947511";

/* ===============================
   TELEGRAM – NOVO PEDIDO
================================ */
exports.notificarNovoPedido = functions.firestore
.document("pedidos/{pedidoId}")
.onCreate(async (snap) => {

  const p = snap.data();

  const texto = `
📦 *NOVO PEDIDO DE PEÇAS*

👤 *Solicitante:* ${p.nome}
🔧 *Manutenção:* ${p.manutencao}
🏷 *GO:* ${p.go || "-"}

🧾 *Peças:*
${p.pecas.map(x => `• ${x.descricao} (${x.quantidade})`).join("\n")}

🕒 *Data:* ${new Date().toLocaleString("pt-BR")}
`;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  await fetch(url,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      chat_id: CHAT_ID,
      text: texto,
      parse_mode:"Markdown"
    })
  });

  return null;
});


/* ===============================
   PUSH – NOVO PEDIDO
================================ */
exports.pushNovoPedido = functions.firestore
.document("pedidos/{id}")
.onCreate(async () => {

  const cfg = await admin.firestore()
    .doc("admin_push_config/config")
    .get();

  if(!cfg.exists) return null;

  const data = cfg.data();
  if(!data.ativo_novo_pedido || !data.token) return null;

  await messaging.send({
    token: data.token,
    notification:{
      title: "📦 Novo pedido",
      body: "Um novo pedido foi criado no sistema"
    }
  });

  return null;
});


/* ===============================
   PUSH – STATUS DO PEDIDO
================================ */
exports.pushStatusPedido = functions.firestore
.document("pedidos/{id}")
.onUpdate(async (change) => {

  const antes = change.before.data();
  const depois = change.after.data();

  if(antes.status === depois.status) return null;

  const cfg = await admin.firestore()
    .doc("admin_push_config/config")
    .get();

  if(!cfg.exists) return null;

  const data = cfg.data();
  if(!data.ativo_status_pedido || !data.token) return null;

  await messaging.send({
    token: data.token,
    notification:{
      title: `📋 Pedido ${depois.status}`,
      body: `Pedido de ${depois.nome} foi ${depois.status}`
    }
  });

  return null;
});
