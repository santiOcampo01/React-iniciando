const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mysql = require('mysql');

const upload = multer({ dest: 'public/uploads/' });

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manchas01',
  database: 'compartir',
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/imagen/:nombre', (req, res) => {
  const nombreImagen = req.params.nombre;
  const rutaImagen = path.join(__dirname, 'public', 'uploads', nombreImagen);
  res.sendFile(rutaImagen);
});

app.post('/upload', upload.single('archivo'), (req, res) => {
  const archivoPath = req.file.path;
  const nombre = req.file.filename;
  const archivoData = fs.readFileSync(archivoPath);

  const sql = 'INSERT INTO archivos (nombre, archivo) VALUES (?, ?)';
  connection.query(sql, [nombre, archivoData], (err, result) => {
    if (err) {
      console.error('Error al guardar el archivo en la base de datos:', err);
      res.status(500).send('Error al guardar el archivo');
      return;
    }

    fs.unlinkSync(archivoPath); // Elimina el archivo del sistema de archivos del servidor
    res.send('Archivo subido correctamente');
  });
});

app.post('/uploadmult', upload.array('archivos'), (req, res) => {
  const archivos = req.files.map((file) => ({
    nombre: file.filename,
    archivo: fs.readFileSync(file.path),
  }));

  const sql = 'INSERT INTO archivos (nombre, archivo) VALUES ?';
  connection.query(sql, [archivos.map((archivo) => [archivo.nombre, archivo.archivo])], (err, result) => {
    if (err) {
      console.error('Error alguardar los archivos en la base de datos:', err);
      res.status(500).send('Error al guardar los archivos');
      return;
    }

    req.files.forEach((file) => {
      fs.unlinkSync(file.path); // Elimina los archivos del sistema de archivos del servidor
    });

    res.send('Archivos subidos correctamente');
  });
});

app.get('/download/:nombre', (req, res) => {
  const nombreArchivo = req.params.nombre;
  const rutaArchivo = path.join(__dirname, 'public', 'uploads', nombreArchivo);
  res.download(rutaArchivo);
});

app.get('/ver/:nombre', (req, res) => {
  const nombreImagen = req.params.nombre;
  const rutaImagen = path.join(__dirname, 'public', 'uploads', nombreImagen);
  res.sendFile(rutaImagen);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
