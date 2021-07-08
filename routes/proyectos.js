const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// api/proyectos

// Crea Proyectos
router.post('/',
    auth,
    [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
    proyectoController.crearProyecto
);

// Obtiene los proyectos del usuario
router.get('/',
    auth,
    proyectoController.obtenerProyectos
)


// Actualizar proyecto via ID
router.put('/:id',
    auth,
    [check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()],
    proyectoController.actualizarProyecto
);

// Eliminar un proyecto por ID

router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)


module.exports = router;
