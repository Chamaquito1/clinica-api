const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

// --- Configuración de Middlewares ---
// Esto permite que el frontend de tu amigo se conecte sin errores de bloqueo
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

// Mensaje de bienvenida (Prueba de vida)
app.get('/', (req, res) => {
  res.send('🚀 API de MediGestion funcionando correctamente en Railway');
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

// --- 4. Endpoint para editar cita (PUT) ---
app.put('/api/citas/:id', async (req, res) => {
  const { id } = req.params;
  const { paciente, fecha, hora, motivo } = req.body;

  try {
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

// --- Configuración del Puerto (CORREGIDO PARA RAILWAY) ---
// 1. Usamos process.env.PORT que asigna Railway
// 2. Escuchamos en '0.0.0.0' para que sea accesible desde internet
const PORT = process.env.PORT || 3000;