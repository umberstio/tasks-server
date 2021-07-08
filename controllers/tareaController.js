const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');


// Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req); // llena un array con los errores
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }



    try {

        // Extraer el proyecto y comprobar sie xiste
        const { proyecto } = req.body;

        const proyectoExistente = await Proyecto.findById(proyecto);
        if (!proyectoExistente) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (proyectoExistente.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });

        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();

        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }


}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {


    try {
        // Extraer el proyecto y comprobar sie xiste
        const { proyecto } = req.query;

        console.log(proyecto);

        const proyectoExistente = await Proyecto.findById(proyecto);
        if (!proyectoExistente) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (proyectoExistente.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });

        }

        // obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizar una tarea

exports.actualizarTarea = async (req, res) => {
    try {
        console.log("entre");
        // Extraer el proyecto y comprobar sie xiste
        const { proyecto, nombre, estado } = req.body;

        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea)
            return res.status(404).json({ msg: 'No existe esa tarea' });

        const proyectoExistente = await Proyecto.findById(proyecto);

        if (proyectoExistente.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Crear un objeto con la nueva informacion
        const nuevaTarea = {};

            nuevaTarea.nombre = nombre;
            nuevaTarea.estado = estado;
        
        

        console.log("obtengo la tarea");
        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });

        res.json({ tarea });

    } catch (error) {
        console.log(error);
    }
}

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {

        console.log("entre");
        // Extraer el proyecto y comprobar sie xiste
        const { proyecto } = req.query;
        console.log(proyecto);
        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea)
            return res.status(404).json({ msg: 'No existe esa tarea' });

        // obtener proyecto
        const proyectoExistente = await Proyecto.findById(proyecto);

        if (proyectoExistente.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: 'Tarea Eliminada' });


    } catch (error) {
        console.log(error);
    }
}