const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// --- Configuración de Middlewares ---
app.use(cors());
app.use(express.json());

// --- 1. Configuración de la Conexión (Preparada para Railway) ---
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

// Mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('🚀 API de MediGestion funcionando correctamente');
});

// --- 2. Endpoint para obtener todas las citas (GET) ---
app.get('/api/citas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM citas');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

// --- 3. Endpoint para eliminar cita (DELETE) ---
app.delete('/api/citas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM citas WHERE id = ?', [id]);
    res.json({ mensaje: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
});

// --- 4. NUEVO: Endpoint para editar cita (PUT) ---
app.put('/api/citas/:id', async (req, res) => {
  const { id } = req.params;
  const { paciente, fecha, hora, motivo } = req.body;

  try {
    // IMPORTANTE: Asegúrate que los nombres de las columnas coincidan con tu DB
    const query = `
      UPDATE citas 
      SET paciente = ?, fecha = ?, hora = ?, motivo = ? 
      WHERE id = ?
    `;
    
    const [result] = await pool.query(query, [paciente, fecha, hora, motivo, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json({ mensaje: 'Cita actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar cita:', error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
});

// --- Configuración del Puerto ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor API listo en http://localhost:${PORT}`);
});