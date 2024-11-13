const express = require('express');
const mysql = require('mysql');
var cors = require('cors');
const rutasGestion = require('./Routes'); 
const bodyParser = require('body-parser');

const app = express();

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// Configuración de la conexión a la base de datos MySQL
//const db = mysql.createConnection({
  //host: 'localhost',
  //user: 'examen',          // Cambia a tu usuario de MySQL
  //password: '12345678',  // Cambia a tu contraseña de MySQL
  //database: 'gestion'     // Nombre de tu base de datos
//});

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'wtsprc1cg7u91h7e',          // Cambia a tu usuario Hosting
  password: 'er5ghm9wyi5hdtw0',  // Cambia a tu contraseña Hosting
  database: 'sl6j6a0rrqq3sokd'     // Nombre de tu base de datos Hosting
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Hacer la conexión de la base de datos accesible globalmente
app.use((req, res, next) => {
  req.db = db; 
  next();
});

// Usa las rutas de tu proyecto
app.use('/api', rutasGestion);

// Puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
