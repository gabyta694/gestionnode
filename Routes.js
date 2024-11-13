var express = require('express');
var router = express.Router();
var controller = require('./Controller');
var authcontroller = require('./authController')
var authenticateToken = require('./auth');

// Ruta para registrar un nuevo usuario
router.post('/register', authcontroller.registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', authcontroller.Login);


// Rutas para la entidad Usuarios
router.post('/usuario', controller.AgregarUsuario); // Agregar un usuario
router.put('/usuario/:id', controller.ModificarUsuario); // Modificar un usuario por ID
router.delete('/usuario/:id', controller.EliminarUsuario); // Eliminar un usuario por ID
router.get('/usuarios', controller.ListarUsuarios); // Listar todos los usuarios
router.get('/usuario/:id', controller.VerUsuario); // Usuario unico

// Rutas para la entidad Proyectos
router.post('/proyecto', controller.AgregarProyecto); // Agregar un proyecto
router.put('/proyecto/:id', controller.ModificarProyecto); // Modificar un proyecto por ID
router.delete('/proyecto/:id', controller.EliminarProyecto); // Eliminar un proyecto por ID
router.get('/proyectos', controller.ListarProyectos); // Listar todos los proyectos
router.get('/proyecto/:id', controller.VerProyecto); // Proyecto unico

// Rutas para la entidad Contrapartes
router.post('/contraparte', controller.AgregarContraparte); // Agregar una contraparte
router.put('/contraparte/:id', controller.ModificarContraparte); // Modificar una contraparte por ID
router.delete('/contraparte/:id', controller.EliminarContraparte); // Eliminar una contraparte por ID
router.get('/contrapartes', controller.ListarContrapartes); // Listar todas las contrapartes
router.get('/contraparte/:id', controller.VerContraparte); // Contraparte unico

// Rutas para la entidad Tareas
router.post('/tarea', controller.AgregarTarea); // Agregar una tarea
router.put('/tarea/:id', controller.ModificarTarea); // Modificar una tarea por ID
router.delete('/tarea/:id', controller.EliminarTarea); // Eliminar una tarea por ID
router.get('/tareas', controller.ListarTareas); // Listar todas las tareas
router.get('/tarea/:id', controller.VerTarea); // Tarea unico

// Rutas para la entidad Evaluaciones
router.post('/evaluacion', controller.AgregarEvaluacion); // Agregar una evaluación
router.put('/evaluacion/:id', controller.ModificarEvaluacion); // Modificar una evaluación por ID
router.delete('/evaluacion/:id', controller.EliminarEvaluacion); // Eliminar una evaluación por ID
router.get('/evaluaciones', controller.ListarEvaluaciones); // Listar todas las evaluaciones
router.get('/evaluacion/:id', controller.VerEvaluacion); // Evaluacion unico

// Rutas para la entidad Historial
//router.post('/historial', controller.AgregarHistorial); // Agregar un historial
//router.put('/historial/:id', controller.ModificarHistorial); // Modificar un historial por ID
//router.delete('/historial/:id', controller.EliminarHistorial); // Eliminar un historial por ID
//router.get('/historiales', controller.ListarHistoriales); // Listar todas las historiales
//router.get('/historial/:id', controller.VerHistorial); // Historial unico

module.exports = router;
