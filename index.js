const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- DATOS DE PRUEBA (En lugar de la base de datos) ---
let citas = [
  { id: 1, paciente: "Juan Pérez", fecha: "2026-03-25", hora: "10:00", motivo: "Consulta general" },
  { id: 2, paciente: "Maria García", fecha: "2026-03-26", hora: "12:00", motivo: "Limpieza dental" }
];

// Mensaje de bienvenida
app.get('/', (req, res) => {
  res.send('🚀 API de MediGestion funcionando en MODO PRUEBA (Sin DB)');
});

// --- GET: Obtener citas ---
app.get('/api/citas', (req, res) => {
  res.json(citas);
});

// --- DELETE: Eliminar cita ---
app.delete('/api/citas/:id', (req, res) => {
  const { id } = req.params;
  citas = citas.filter(c => c.id !== parseInt(id));
  res.json({ mensaje: 'Cita eliminada correctamente' });
});

// --- PUT: Editar cita ---
app.put('/api/citas/:id', (req, res) => {
  const { id } = req.params;
  const { paciente, fecha, hora, motivo } = req.body;
  
  const index = citas.findIndex(c => c.id === parseInt(id));
  if (index !== -1) {
    citas[index] = { id: parseInt(id), paciente, fecha, hora, motivo };
    res.json({ mensaje: 'Cita actualizada correctamente' });
  } else {
    res.status(404).json({ error: 'Cita no encontrada' });
  }
});

// --- Puerto para Railway ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor de PRUEBA listo en el puerto ${PORT}`);
});