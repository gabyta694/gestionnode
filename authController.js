const bcrypt = require('bcryptjs');

exports.registrarUsuario = (req, res) => {
    const { nombre_usuario, rut, dv, correo_usuario, password, rol } = req.body;
    console.log('Datos recibidos para el registro:', req.body);

    // Verificar si el usuario ya existe
    req.db.query('SELECT * FROM usuarios WHERE correo_usuario = ?', [correo_usuario], (err, results) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Error al hashear la contraseña:', err);
                return res.status(500).json({ error: 'Error al registrar el usuario' });
            }

            // Inserta el usuario en la base de datos
            const sql = `INSERT INTO usuarios (nombre_usuario, rut, dv, correo_usuario, password, rol) VALUES (?, ?, ?, ?, ?, ?)`;
            req.db.query(sql, [nombre_usuario, rut, dv, correo_usuario, hash, rol], (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    return res.status(500).json({ error: 'Error al registrar el usuario' });
                }
                console.log('Usuario registrado exitosamente:', result);
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    });
};


exports.Login = (req, res) => {
    const { correo_usuario, password } = req.body;

    req.db.query('SELECT * FROM usuarios WHERE correo_usuario = ?', [correo_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = results[0];

        // Compara la contraseña ingresada con la almacenada
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error al comparar las contraseñas' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar token y devolverlo junto con el rol del usuario
            //const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, 'tu_clave_secreta', { expiresIn: '1h' });
            //res.status(200).send({ token, rol: user.rol });

            // Aquí puedes continuar con la lógica de inicio de sesión
            res.json({ message: 'Login exitoso', user });
        });
    });
};
