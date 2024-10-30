const { users, bootcamps } = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp
const createBootcamp = (req, res) => {
  const bootcamp = req.body || req; // Manejar ambos casos
  return Bootcamp.create({
      title: bootcamp.title,
      cue: bootcamp.cue,
      description: bootcamp.description,
    })
    .then(bootcamp => {
      console.log(`>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`)
      if (res) {
        res.status(201).json(bootcamp);
      } else {
        return bootcamp; // Devolver el objeto bootcamp cuando no hay res
      }
    })
    .catch(err => {
      console.log(`>> Error al crear el bootcamp: ${err}`)
      if (res) {
        res.status(500).json({ message: `>> Error al crear el bootcamp: ${err}` });
      } else {
        throw err; // Lanzar el error cuando no hay res
      }
    });
}

// Agregar un Usuario al Bootcamp
const addUser = (bootcampId, userId) => {
  return Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log("No se encontro el Bootcamp!");
        return null;
      }
      return User.findByPk(userId).then((user) => {
        if (!user) {
          console.log("Usuario no encontrado!");
          return null;
        }
        bootcamp.addUser(user);
        console.log('***************************')
        console.log(` Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`);
        console.log('***************************')
        return bootcamp;
      });
    })
    .catch((err) => {
      console.log(">> Error mientras se estaba agregando Usuario al Bootcamp", err);
    });
};

// obtener los bootcamp por id 
const findById = (req, res) => {
  const id = parseInt(req.params.id, 10); // Asegúrate de que el id sea un número
  return Bootcamp.findByPk(id, {
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName"],
        through: {
          attributes: [],
        }
      }, ],
    })
    .then(bootcamp => {
      if (!bootcamp) {
        return res.status(404).json({ message: "Bootcamp no encontrado" });
      }
      res.status(200).json(bootcamp);
    })
    .catch(err => {
      res.status(500).json({ message: `>> Error mientras se encontraba el bootcamp: ${err}` });
    });
}

// obtener todos los Bootcamps incluyendo los Usuarios
const findAll = (req, res) => {
  return Bootcamp.findAll({
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    }],
  })
  .then(bootcamps => {
    res.status(200).json(bootcamps);
  })
  .catch((err) => {
    res.status(500).json({ message: ">> Error Buscando los Bootcamps: " + err });
  });
}

const updateBootcampById = (req, res) => {
  const id = parseInt(req.params.id, 10); // Asegúrate de que el id sea un número
  const bootcamp = req.body;
  return Bootcamp.update(bootcamp, {
    where: { id: id }
  })
  .then(() => {
    return Bootcamp.findByPk(id);
  })
  .then(updatedBootcamp => {
    if (!updatedBootcamp) {
      return res.status(404).json({ message: "Bootcamp no encontrado" });
    }
    res.status(200).json(updatedBootcamp);
  })
  .catch(err => {
    res.status(500).json({ message: `>> Error mientras se actualizaba el bootcamp: ${err}` });
  });
}

const deleteBootcampById = (req, res) => {
  const id = parseInt(req.params.id, 10); // Asegúrate de que el id sea un número
  return Bootcamp.destroy({
    where: { id: id }
  })
  .then(deleted => {
    if (!deleted) {
      return res.status(404).json({ message: "Bootcamp no encontrado" });
    }
    res.status(200).json({ message: `>> Bootcamp con id=${id} eliminado` });
  })
  .catch(err => {
    res.status(500).json({ message: `>> Error mientras se eliminaba el bootcamp: ${err}` });
  });
}

module.exports = {
  createBootcamp,
  findAll,
  findById,
  addUser,
  updateBootcampById,
  deleteBootcampById
};