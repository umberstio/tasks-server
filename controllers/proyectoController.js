const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req); // llena un array con los errores
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }


    try {
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        // guardamos el proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}




// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos })

    } catch (error) {
        console.log('Error en el controller', error);
        res.status(500).send('Hubo un error');
    }
}


// Actualiza un proyecto

exports.actualizarProyecto = async (req, res) => {


    // revisar si hay errores
    const errores = validationResult(req); // llena un array con los errores
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }



    try {

        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        console.log(proyecto);

        // si el proyecto existe o no
        if (!proyecto)
            res.status(404).json({ msg: 'proyecto no encontrado' });

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: 'No autorizado' });
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: nuevoProyecto },
            { new: true });

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor');
    }

}




// Eliminar un proyecto 
exports.eliminarProyecto = async (req, res) => {
    try {

        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        console.log(proyecto);

        // si el proyecto existe o no
        if (!proyecto)
            res.status(404).json({ msg: 'proyecto no encontrado' });

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar el Proyecto
        await Proyecto.findOneAndRemove({_id:  req.params.id});

        res.json({msg: 'Proyecto eliminado'});


    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}