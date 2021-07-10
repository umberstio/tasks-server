const express = require('express');
const conectarDB = require('./config/db');
const cors = require ('cors');



// crear el servidor 
const app = express();

// conectar a la base de datos
conectarDB();

// Habilitar cors 
app.use(cors());


//habilitar express.json... antes se usaba body parser
app.use(express.json({ extended: true }));



const PORT = process.env.PORT || 4000;

// Importar rutas (Middleware)
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));





// arranca la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})