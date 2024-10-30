const db = require('./app/models');
const userController = require('./app/controllers/user.controller');
const bootcampController = require('./app/controllers/bootcamp.controller');
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./app/router/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`El servidor se está ejecutando en el puerto: ${PORT}.`);
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Función para inicializar datos en la base de datos
const initializeData = async () => {
  // Crear Usuarios
  const user1 = await userController.createUser({
    body: {
      firstName: 'Mateo',
      lastName: 'Díaz',
      email: 'mateo.diaz@correo.com',
      password: 'password123'
    }
  });

  console.log(`Usuario 1 creado con contraseña hasheada: ${user1.password}`);

  const user2 = await userController.createUser({
    body: {
      firstName: 'Santiago',
      lastName: 'Mejias',
      email: 'santiago.mejias@correo.com',
      password: 'password123'
    }
  });

  console.log(`Usuario 2 creado con contraseña hasheada: ${user2.password}`);

  const user3 = await userController.createUser({
    body: {
      firstName: 'Lucas',
      lastName: 'Rojas',
      email: 'lucas.rojas@correo.com',
      password: 'password123'
    }
  });

  console.log(`Usuario 3 creado con contraseña hasheada: ${user3.password}`);

  const user4 = await userController.createUser({
    body: {
      firstName: 'Facundo',
      lastName: 'Fernández',
      email: 'facundo.fernandez@correo.com',
      password: 'password123'
    }
  });

  console.log(`Usuario 4 creado con contraseña hasheada: ${user4.password}`);

  // Crear Bootcamps
  const bootcamp1 = await bootcampController.createBootcamp({
    title: 'Introduciendo El Bootcamp De React',
    cue: 10,
    description: 'React es la librería más usada en JavaScript para el desarrollo de interfaces',
  });

  const bootcamp2 = await bootcampController.createBootcamp({
    title: 'Bootcamp Desarrollo Web Full Stack',
    cue: 12,
    description: 'Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares como JavaScript, nodeJS, Angular, MongoDB, ExpressJS',
  });

  const bootcamp3 = await bootcampController.createBootcamp({
    title: 'Bootcamp Big Data, Inteligencia Artificial & Machine Learning',
    cue: 12,
    description: 'Domina Data Science todo el ecosistema de lenguajes y herramientas de Big Data e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning',
  });

  // Agregar Usuarios a los Bootcamps
  await bootcampController.addUser(bootcamp1.id, user1.id);
  await bootcampController.addUser(bootcamp1.id, user2.id);
  await bootcampController.addUser(bootcamp2.id, user1.id);
  await bootcampController.addUser(bootcamp3.id, user1.id);
  await bootcampController.addUser(bootcamp3.id, user2.id);
  await bootcampController.addUser(bootcamp3.id, user3.id);
  await bootcampController.addUser(bootcamp3.id, user4.id);
};

// Sincronización de la base de datos y llamada a la inicialización de datos
const startServer = async () => {
  await db.sequelize.sync({ force: true });
  console.log('Eliminando y resincronizando la base de datos.');
  await initializeData(); // Llamar a la función de inicialización de datos
};

startServer().catch(error => {
  console.error('Error al iniciar el servidor:', error);
});
