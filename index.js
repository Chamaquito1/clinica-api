const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// Configuración de Middlewares
app.use(cors());
app.use(express.json());

// 1. Configuración de la Conexión (Preparada para Railway)
// Estas variables (process.env) las llena Railway automáticamente al desplegar
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'clinica',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mensaje de bienvenida (para probar en el navegador)
app.get('/', (req, res) => {
  res.send('🚀 API de MediGestion funcionando correctamente');
});

// 2. Endpoint para obtener todas las citas (GET)
app.get('/api/citas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM citas');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

// 3. PASO 1 DEL DOCUMENTO: Endpoint para eliminar cita (DELETE)
// DELETE /api/citas/:id - Eliminar una cita por su ID
app.delete('/api/citas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Ejecuta la query en la base de datos de Railway
    await pool.query('DELETE FROM citas WHERE id = ?', [id]);
    res.json({ mensaje: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
});

// Configuración del Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor API listo en http://localhost:${PORT}`);
});