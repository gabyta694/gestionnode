const mysql = require('mysql');
const bcrypt = require('bcryptjs');

//-----------------------------USUARIO-------------------------------------------
// Agregar un usuario-
exports.AgregarUsuario = (req, res) => {
  const { nombre_usuario, rut, dv, correo_usuario, password, rol } = req.body;

    // Verificar si el usuario ya existe
    req.db.query('SELECT * FROM usuarios WHERE correo_usuario = ?', [correo_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }

            // Inserta el usuario en la base de datos
            req.db.query('INSERT INTO usuarios (nombre_usuario, rut, dv, correo_usuario, password, rol) VALUES (?, ?, ?, ?, ?, ?)', 
            [nombre_usuario, rut, dv, correo_usuario, hash, rol], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al registrar el usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });
};

  
    // Actualizar usuario
    exports.ModificarUsuario = (req, res) => {

      console.log("Cuerpo de la solicitud:", req.body);
      
      const id = req.params.id; // Accede al id desde la URL
      const { nombre_usuario, rut, dv, correo_usuario, password, rol } = req.body;
    
      console.log('ID recibido:', id);  // Verifica que el ID se esté recibiendo correctamente
    
      if (!nombre_usuario) return res.status(400).json({ error: 'El campo nombre_usuario es obligatorio' });
      if (!rut) return res.status(400).json({ error: 'El campo rut es obligatorio' });
      if (!dv) return res.status(400).json({ error: 'El campo dv es obligatorio' });
      if (!correo_usuario) return res.status(400).json({ error: 'El campo correo_usuario es obligatorio' });
      if (!rol) return res.status(400).json({ error: 'El campo rol es obligatorio' });

    
      // Verificar si el id existe en la base de datos
      req.db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
    
        if (results.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    
        // Si el usuario existe, proceder con la actualización
        let updateFields = [
          `nombre_usuario = '${nombre_usuario}'`,
          `rut = '${rut}'`,
          `dv = '${dv}'`,
          `correo_usuario = '${correo_usuario}'`,
          `rol = '${rol}'`
        ];
    
        if (password) {
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              return res.status(500).json({ error: 'Error al encriptar la contraseña' });
            }
    
            // Añadir la contraseña encriptada al conjunto de campos a actualizar
            updateFields.push(`password = '${hashedPassword}'`);
    
            // Realizar la actualización en la base de datos
            const sql = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`;
            req.db.query(sql, [id], (err, result) => {
              if (err) {
                return res.status(500).json({ error: 'Error al actualizar el usuario' });
              }
    
              if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Usuario modificado exitosamente' });
              } else {
                res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
              }
            });
          });
        } else {
          // Si no se envió una nueva contraseña, solo actualizamos los otros campos
          const sql = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`;
          req.db.query(sql, [id], (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Error al actualizar el usuario' });
            }
    
            if (result.affectedRows > 0) {
              res.status(200).json({ message: 'Usuario modificado exitosamente' });
            } else {
              res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
            }
          });
        }
      });
    };
    
  
  // Eliminar un usuario
  exports.EliminarUsuario = (req, res) => {
    const usuarioId = req.params.id;
    console.log('ID de usuario recibido para eliminación:', usuarioId);
    
    const sql = `DELETE FROM usuarios WHERE id_usuario = ?`;
  
    req.db.query(sql, [usuarioId], (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err); 
        return res.status(500).send({ error: 'Error al eliminar el usuario' });
      }
      console.log('Resultado de la eliminación:', result);

      if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).send({ message: 'Usuario no encontrado' });
    }
    });
  };
  

  // Listar todos los usuarios
  exports.ListarUsuarios = (req, res) => {
    const sql = `SELECT * FROM usuarios`;
  
    req.db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Error al obtener los usuarios' });
      }
      res.status(200).send(result);
    });
  };


  // Ver un solo usuario
exports.VerUsuario = (req, res) => {
  const usuarioId = req.params.id;

  const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
  req.db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener el usuario' });
    }
    if (results.length === 0) {
      return res.status(404).send({ error: 'Usuario no encontrado' });
    }
    res.status(200).send(results[0]);
  });
};


//-----------------------------CONTRAPARTE-------------------------------------------
// Agregar una contraparte
exports.AgregarContraparte = (req, res) => {
    const { nombre_contraparte, rut_contraparte, dv_contraparte, correo_contraparte, telefono } = req.body;
    
    if (!nombre_contraparte || !rut_contraparte || !dv_contraparte || !correo_contraparte || !telefono ) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const sql = `INSERT INTO contrapartes (nombre_contraparte, rut_contraparte, dv_contraparte, correo_contraparte, telefono) VALUES (?, ?, ?, ?, ?)`;
  
    req.db.query(sql, [nombre_contraparte, rut_contraparte, dv_contraparte, correo_contraparte, telefono], (err, result) => {
      if (err) {
        console.error('Error al insertar la contraparte:', err);
        return res.status(500).send({ error: 'Error al agregar la contraparte', details:err });
      }
      res.status(201).send({ message: 'Contraparte agregada exitosamente' });
    });
  };
  

  // Modificar una contraparte
  exports.ModificarContraparte = (req, res) => {
    const contraparteId = req.params.id;
    const { nombre_contraparte, rut_contraparte, dv_contraparte, correo_contraparte, telefono } = req.body;
    const sql = `UPDATE contrapartes SET nombre_contraparte = ?, rut_contraparte = ?, dv_contraparte = ?, correo_contraparte = ?, telefono = ? WHERE id_contraparte = ?`;
  
    req.db.query(sql, [nombre_contraparte, rut_contraparte, dv_contraparte, correo_contraparte, telefono, contraparteId], (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Error al modificar la contraparte' });
      }
      res.status(200).send({ message: 'Contraparte modificada exitosamente' });
    });
  };
  

  // Eliminar una contraparte
  exports.EliminarContraparte = (req, res) => {
    const contraparteId = req.params.id;
    const sql = `DELETE FROM contrapartes WHERE id_contraparte = ?`;
  
    req.db.query(sql, [contraparteId], (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Error al eliminar la contraparte' });
      }
      res.status(200).send({ message: 'Contraparte eliminada exitosamente' });
    });
  };
  

  // Listar todas las contraparte
  exports.ListarContrapartes = (req, res) => {
    const sql = `SELECT * FROM contrapartes`;
  
    req.db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send({ error: 'Error al obtener las contrapartes' });
      }
      res.status(200).send(result);
    });
  };


   // Ver una sola contraparte
  exports.VerContraparte = (req, res) => {
  const contraparteId = req.params.id;

  const sql = 'SELECT * FROM contrapartes WHERE id_contraparte = ?';
  req.db.query(sql, [contraparteId], (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener la contraparte' });
    }
    if (results.length === 0) {
      return res.status(404).send({ error: 'Contraparte no encontrado' });
    }
    res.status(200).send(results[0]);
  });
};
 

//-----------------------------PROYECTO-------------------------------------------
// Agregar un proyecto
exports.AgregarProyecto = (req, res) => {
  const { nombre_proyecto, descripcion, fecha_inicio, fecha_fin, estado, relevancia } = req.body;
  
  if (!nombre_proyecto || !descripcion || !fecha_inicio || !fecha_fin || !estado || !relevancia) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  
  const sql = `INSERT INTO proyectos (nombre_proyecto, descripcion, fecha_inicio, fecha_fin, estado, relevancia) VALUES (?, ?, ?, ?, ?, ?)`;

  req.db.query(sql, [nombre_proyecto, descripcion, fecha_inicio, fecha_fin, estado, relevancia], (err, result) => {
    if (err) {
      console.error('Error al insertar el proyecto:', err);
      return res.status(500).send({ error: 'Error al agregar el proyecto', details:err });
    }
    res.status(201).send({ message: 'Proyecto agregado exitosamente' });
  });
};


// Modificar un proyecto
exports.ModificarProyecto = (req, res) => {
  const proyectoId = req.params.id;
  const { nombre_proyecto, descripcion, fecha_inicio, fecha_fin, estado, relevancia } = req.body;
  const sql = `UPDATE proyectos SET nombre_proyecto = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, relevancia = ? WHERE id_proyecto = ?`;

  req.db.query(sql, [nombre_proyecto, descripcion, fecha_inicio, fecha_fin, estado, relevancia, proyectoId], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al modificar el proyecto' });
    }
    res.status(200).send({ message: 'Proyecto modificado exitosamente' });
  });
};


// Eliminar un proyecto
exports.EliminarProyecto = (req, res) => {
  const proyectoId = req.params.id;
  const sql = `DELETE FROM proyectos WHERE id_proyecto = ?`;

  req.db.query(sql, [proyectoId], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al eliminar el proyecto' });
    }
    res.status(200).send({ message: 'Proyecto eliminado exitosamente' });
  });
};


// Listar todos los proyectos
exports.ListarProyectos = (req, res) => {
  const sql = `SELECT * FROM proyectos`;

  req.db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener los proyectos' });
    }
    res.status(200).send(result);
  });
};


 // Ver un solo proyecto
exports.VerProyecto = (req, res) => {
const proyectoId = req.params.id;

const sql = 'SELECT * FROM proyectos WHERE id_proyecto = ?';
req.db.query(sql, [proyectoId], (err, results) => {
  if (err) {
    return res.status(500).send({ error: 'Error al obtener el proyecto' });
  }
  if (results.length === 0) {
    return res.status(404).send({ error: 'Proyecto no encontrado' });
  }
  res.status(200).send(results[0]);
});
};

 // Ver Todos los Proyectos de 1 usuario
exports.VerProyectosPorUsuario = (req, res) => {
  const usuarioId = req.params.id;
  console.log('ID de Usuario recibido:', usuarioId);

  const sql = `
    SELECT DISTINCT p.*
    FROM proyectos p
    JOIN tareas t ON p.id_proyecto = t.id_proyecto
    WHERE t.id_usuario_asignado = ?
  `;

  req.db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).send({ error: 'Error al obtener los proyectos'});
    }

    //console.log('Resultados de la consulta:', results);

    if (results.length === 0) {
      return res.status(404).send({ error: 'Proyectos no encontrados para este usuario' });
    }

    res.status(200).send(results); // Enviar la respuesta al cliente
  });
};


//-----------------------------TAREA-------------------------------------------
// Agregar una tarea
exports.AgregarTarea = (req, res) => {
  const { nombre_tarea, descripcion_tarea, fecha_inicio, fecha_fin, estado, id_proyecto, id_usuario_asignado, id_contraparte_tarea } = req.body;
  
  // Verificar si se proporcionan todos los campos
  if (!nombre_tarea || !fecha_inicio || !estado || !id_proyecto || !id_usuario_asignado || !id_contraparte_tarea) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Verificar que las claves foráneas existan (opcional)
  const checkForeignKeys = `
    SELECT EXISTS(SELECT 1 FROM proyectos WHERE id_proyecto = ?) AS proyecto_exists,
           EXISTS(SELECT 1 FROM usuarios WHERE id_usuario = ?) AS usuario_exists,
           EXISTS(SELECT 1 FROM contrapartes WHERE id_contraparte = ?) AS contraparte_exists
  `;

  req.db.query(checkForeignKeys, [id_proyecto, id_usuario_asignado, id_contraparte_tarea], (err, results) => {
    if (err) {
      console.error('Error al verificar claves foráneas:', err);
      return res.status(500).json({ error: 'Error al verificar claves foráneas', details: err });
    }

    // Revisar si existen los registros de las claves foráneas
    const { proyecto_exists, usuario_exists, contraparte_exists } = results[0];
    if (!proyecto_exists || !usuario_exists || !contraparte_exists) {
      return res.status(400).json({ error: 'Una o más claves foráneas no existen' });
    }

    // Consulta de inserción
    const sql = `INSERT INTO tareas (nombre_tarea, descripcion_tarea, fecha_inicio, fecha_fin, estado, id_proyecto, id_usuario_asignado, id_contraparte_tarea)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    req.db.query(sql, [nombre_tarea, descripcion_tarea, fecha_inicio, fecha_fin, estado, id_proyecto, id_usuario_asignado, id_contraparte_tarea], (err, result) => {
      if (err) {
        console.error('Error al insertar la tarea:', err);
        return res.status(500).json({ error: 'Error al agregar la tarea', details: err });
      }
      res.status(201).json({ message: 'Tarea agregada exitosamente', tareaId: result.insertId });
    });
  });
};


// Modificar una tarea
exports.ModificarTarea = (req, res) => {
  const tareaId = req.params.id;
  const { nombre_tarea, descripcion_tarea, fecha_inicio, fecha_fin, estado, id_proyecto, id_usuario_asignado, id_contraparte_tarea } = req.body;
  const sql = `UPDATE tareas SET nombre_tarea = ?, descripcion_tarea = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, id_proyecto = ?, id_usuario_asignado = ?, id_contraparte_tarea = ? WHERE id_tarea = ?`;

  req.db.query(sql, [nombre_tarea, descripcion_tarea, fecha_inicio, fecha_fin, estado, id_proyecto, id_usuario_asignado, id_contraparte_tarea, tareaId], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al modificar la tarea' });
    }
    res.status(200).send({ message: 'Tarea modificada exitosamente' });
  });
};


// Eliminar una tarea
exports.EliminarTarea= (req, res) => {
  const tareaId = req.params.id;
  const sql = `DELETE FROM tareas WHERE id_tarea = ?`;

  req.db.query(sql, [tareaId], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al eliminar la tarea' });
    }
    res.status(200).send({ message: 'Tarea eliminada exitosamente' });
  });
};


// Listar todas las tareas
// Backend - Controlador de ListarTareas
exports.ListarTareas = (req, res) => {
  const sql = `
    SELECT 
      tareas.id_tarea,
      tareas.nombre_tarea,
      tareas.descripcion_tarea,
      tareas.fecha_inicio,
      tareas.fecha_fin,
      tareas.estado,
      proyectos.nombre_proyecto AS nombre_proyecto,
      usuarios.nombre_usuario AS nombre_usuario_asignado,
      contrapartes.nombre_contraparte AS nombre_contraparte_tarea
    FROM tareas
    LEFT JOIN proyectos ON tareas.id_proyecto = proyectos.id_proyecto
    LEFT JOIN usuarios ON tareas.id_usuario_asignado = usuarios.id_usuario
    LEFT JOIN contrapartes ON tareas.id_contraparte_tarea = contrapartes.id_contraparte;
  `;

  req.db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener tareas:', err);
      return res.status(500).send({ error: 'Error al obtener las tareas', details: err.message });
    }
    res.status(200).send(result);
  });
};


 // Ver una sola tarea
exports.VerTarea = (req, res) => {
const tareaId = req.params.id;

const sql = 'SELECT * FROM tareas WHERE id_tarea = ?';
req.db.query(sql, [tareaId], (err, results) => {
  if (err) {
    return res.status(500).send({ error: 'Error al obtener la tarea' });
  }
  if (results.length === 0) {
    return res.status(404).send({ error: 'Tarea no encontrada' });
  }
  res.status(200).send(results[0]);
});
};


exports.VerTareasPorUsuario = (req, res) => {
  const usuarioId = req.params.id;

  const sql = 'SELECT * FROM tareas WHERE id_usuario_asignado = ?';
  req.db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Error al obtener las tareas' });
    }
    if (results.length === 0) {
      return res.status(404).send({ error: 'No se encontraron tareas para este usuario' });
    }
    res.status(200).send(results);
  });
};


//-----------------------------EVALUACION-------------------------------------------
// Agregar una evaluacion
exports.AgregarEvaluacion = (req, res) => {
  const { id_usuario, id_proyecto, id_tarea, estado, desempeño, comentarios, fecha_evaluacion } = req.body;
  
  // Verificar si se proporcionan todos los campos
  if (!id_usuario || !id_proyecto || !id_tarea || !estado || !desempeño || !comentarios || !fecha_evaluacion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Verificar que las claves foráneas existan (opcional)
  const checkForeignKeys = `
    SELECT EXISTS(SELECT 1 FROM proyectos WHERE id_proyecto = ?) AS proyecto_exists,
           EXISTS(SELECT 1 FROM usuarios WHERE id_usuario = ?) AS usuario_exists,
           EXISTS(SELECT 1 FROM tareas WHERE id_tarea = ?) AS tarea_exists
  `;

  req.db.query(checkForeignKeys, [id_proyecto, id_usuario, id_tarea], (err, results) => {
    if (err) {
      console.error('Error al verificar claves foráneas:', err);
      return res.status(500).json({ error: 'Error al verificar claves foráneas', details: err });
    }

    // Revisar si existen los registros de las claves foráneas
    const { proyecto_exists, usuario_exists, tarea_exists } = results[0];
    if (!proyecto_exists || !usuario_exists || !tarea_exists) {
      return res.status(400).json({ error: 'Una o más claves foráneas no existen' });
    }

    // Consulta de inserción
    const sql = `INSERT INTO evaluaciones (id_usuario, id_proyecto, id_tarea, estado, desempeño, comentarios, fecha_evaluacion)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    req.db.query(sql, [id_usuario, id_proyecto, id_tarea, estado, desempeño, comentarios, fecha_evaluacion], (err, result) => {
      if (err) {
        console.error('Error al insertar la evaluacion:', err);
        return res.status(500).json({ error: 'Error al agregar la evaluacion', details: err });
      }
      res.status(201).json({ message: 'Evaluacion agregada exitosamente', evaluacionId: result.insertId });
    });
  });
};


// Modificar una evaluacion
exports.ModificarEvaluacion = (req, res) => {
  const evaluacionId = req.params.id;
  const { id_evaluacion, id_usuario, id_proyecto, id_tarea, estado, desempeño, comentarios, fecha_evaluacion } = req.body;
  const sql = `UPDATE evaluaciones SET id_evaluacion = ?, id_usuario = ?, id_proyecto = ?, id_tarea = ?, estado = ?, desempeño = ?, comentarios = ?, fecha_evaluacion = ? WHERE id_evaluacion = ?`;

  req.db.query(sql, [id_evaluacion, id_usuario, id_proyecto, id_tarea, estado, desempeño, comentarios, fecha_evaluacion, evaluacionId], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al modificar la evaluacion' });
    }
    res.status(200).send({ message: 'Evaluacion modificada exitosamente' });
  });
};


// Eliminar una evaluacion
exports.EliminarEvaluacion= (req, res) => {
  const evaluacionId = req.params.id;
  const sql = `DELETE FROM evaluaciones WHERE id_evaluacion = ?`;

  req.db.query(sql, [evaluacionId], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Error al eliminar la evaluacion' });
    }
    res.status(200).send({ message: 'Evaluacion eliminada exitosamente' });
  });
};


// Listar todas las evaluacion
exports.ListarEvaluaciones = (req, res) => {
  const sql = `
    SELECT e.id_evaluacion, e.id_usuario, u.nombre_usuario, e.estado, e.desempeño, e.comentarios, e.fecha_evaluacion, 
           p.nombre_proyecto, t.nombre_tarea
    FROM evaluaciones e
    JOIN usuarios u ON e.id_usuario = u.id_usuario
    JOIN proyectos p ON e.id_proyecto = p.id_proyecto
    JOIN tareas t ON e.id_tarea = t.id_tarea
  `;

  req.db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener las evaluaciones:', err);
      return res.status(500).send({ error: 'Error al obtener las evaluaciones', details: err });
    }
    res.status(200).json(results);
  });
};


 // Ver una sola evaluacion
exports.VerEvaluacion = (req, res) => {
const evaluacionId = req.params.id;

const sql = 'SELECT * FROM evaluaciones WHERE id_evaluacion = ?';
req.db.query(sql, [evaluacionId], (err, results) => {
  if (err) {
    return res.status(500).send({ error: 'Error al obtener la evaluacion' });
  }
  if (results.length === 0) {
    return res.status(404).send({ error: 'Evaluacion no encontrada' });
  }
  res.status(200).send(results[0]);
});
};


//-----------------------------HISTORIAL-------------------------------------------

//----------------------------RUTAS ADICIONALES------------------------------------
//ContarTareasPorUsuario
exports.ContarTareasPorUsuario = (req, res) => {
  //const db = req.db; // Obtenemos la conexión de MySQL del middleware global
  const usuarioAsignado = req.params.id; // ID del usuario recibido en la URL

  // Llamar al procedimiento almacenado
  req.db.query('CALL ContarTareasPorUsuario(?)', [usuarioAsignado], (err, results) => {
    if (err) {
      console.error('Error ejecutando el procedimiento:', err);
      return res.status(500).json({ error: 'Error ejecutando el procedimiento' });
    }

    // Enviar los resultados al cliente
    res.json({
      total_tareas: results[0], // Total de tareas
      tareas_por_usuario: results[1], // Tareas por usuario
    });
  });
};

