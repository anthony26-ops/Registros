const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const TXT_FILE_PATH = path.join(__dirname, 'registros.txt');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Phone validation regex (basic pattern to allow digits, spaces, dashes, parentheses and a leading plus)
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,15}$/;

// Route to handle registration
app.post('/api/register', (req, res) => {
  const { name, phone, consent } = req.body;

  // Validation checks
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Por favor, ingrese un nombre válido.' });
  }

  if (!phone || !PHONE_REGEX.test(phone.trim())) {
    return res.status(400).json({ success: false, error: 'Por favor, ingrese un número de teléfono válido (entre 7 y 15 dígitos).' });
  }

  if (consent !== true && consent !== 'true' && consent !== 'on') {
    return res.status(400).json({ success: false, error: 'Debe aceptar los términos de contacto para continuar.' });
  }

  // Save to plain text file (Notepad / Bloc de notas format)
  const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'America/Guatemala' });
  const logEntry = 
`=========================================
Fecha y Hora: ${timestamp}
Nombre: ${name.trim()}
Teléfono: ${phone.trim()}
Consentimiento WhatsApp/SMS: Aceptado
=========================================\n\n`;

  // Append new text block
  fs.appendFile(TXT_FILE_PATH, logEntry, 'utf8', (err) => {
    if (err) {
      console.error('Error al escribir en el archivo de texto:', err);
      return res.status(500).json({ success: false, error: 'Error del servidor al guardar el registro.' });
    }
    
    return res.status(200).json({ success: true, message: 'Registro guardado con éxito.' });
  });
});

// Fallback to index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
