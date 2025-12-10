const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const data = require('./bootstrap.json');

// ---------------------------------------------
// REGLA: No tocamos Auth desde aquí (solo Firestore)
// Los usuarios se crean en Firestore para roles, 
// pero deberás crearlos en Authentication manualmente.
// ---------------------------------------------

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadData() {
  console.log("🚀 Iniciando carga de datos a Pizza Brava Dev...");

  // 1. CONFIGURACIÓN DEL SISTEMA
  console.log("⚙️ Cargando Configuración del Sistema...");
  await db.collection('systemInfo').doc('default').set(data.systemInfo);
  // Guardamos las reglas de negocio también
  await db.collection('systemInfo').doc('rules').set(data.rules);
  console.log("✅ Configuración cargada.");

  // 2. USUARIOS BASE (Solo DB, no Auth)
  console.log("👥 Cargando Usuarios Base (Firestore)...");
  const usersBatch = db.batch();
  data.users.forEach(user => {
    const ref = db.collection('users').doc(user.id);
    usersBatch.set(ref, user);
  });
  await usersBatch.commit();
  console.log("✅ Usuarios cargados.");

  // 3. MESAS
  console.log("🪑 Cargando Mesas...");
  const tablesBatch = db.batch();
  data.tables.forEach(table => {
    const ref = db.collection('tables').doc(table.id);
    tablesBatch.set(ref, table);
  });
  await tablesBatch.commit();
  console.log("✅ Mesas cargadas.");

  // 4. CATEGORÍAS DE GASTOS (Para Cortes de Caja)
  console.log("💸 Cargando Categorías de Gastos...");
  const expBatch = db.batch();
  data.expenseCategories.forEach(exp => {
    const ref = db.collection('expenseCategories').doc(exp.id);
    expBatch.set(ref, exp);
  });
  await expBatch.commit();
  console.log("✅ Gastos cargados.");

  // 5. MENÚ Y CATEGORÍAS (Lo que ya tenías)
  console.log("📦 Cargando Categorías de Menú...");
  const categoriesBatch = db.batch();
  data.categories.forEach(cat => {
    const ref = db.collection('categories').doc(cat.id);
    categoriesBatch.set(ref, cat);
  });
  await categoriesBatch.commit();

  console.log("🍕 Cargando Menu Items...");
  const itemsBatch = db.batch();
  data.menuItems.forEach(item => {
    const ref = db.collection('menuItems').doc(item.id);
    itemsBatch.set(ref, item);
  });
  await itemsBatch.commit();

  console.log("🎁 Cargando Combos...");
  const combosBatch = db.batch();
  data.combos.forEach(combo => {
    const ref = db.collection('combos').doc(combo.id);
    combosBatch.set(ref, combo);
  });
  await combosBatch.commit();

  console.log("🎉 TODO LISTO. Base de datos operativa para Admin, POS y Cocina.");
}

uploadData().catch(console.error);