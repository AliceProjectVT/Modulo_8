const { users } = require('../models')
const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

//Cumple funcion de Registro.
exports.createUser = async (req, res = null) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    if (res) {
      res.status(201).json(user);
    }
    return user;
  } catch (error) {
    if (res) {
      res.status(500).json({ mensaje: error.message });
    }
    throw error;
  }
};

exports.findUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }],
    });

    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(`>> Error mientras se encontraba los usuarios: ${error}`);
    res.status(500).json({ mensaje: error.message });
  }
}

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
}

exports.updateUserById = async (req, res) => {
  try {
    const user = await User.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }, {
      where: {
        id: req.params.id
      }
    });

    if (user[0] === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    console.log(`>> Se ha actualizado el usuario: ${JSON.stringify(user, null, 4)}`)
    res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.log(`>> Error mientras se actualizaba el usuario: ${error}`);
    res.status(500).json({ mensaje: error.message });
  }
}

exports.deleteUserById = async (req, res) => {
  try {
    const result = await User.destroy({
      where: {
        id: req.params.id
      }
    });

    if (result === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    console.log(`>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`)
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.log(`>> Error mientras se eliminaba el usuario: ${error}`);
    res.status(500).json({ mensaje: error.message });
  }
}


exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña invalida"
      });
    }

    const token = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: 86400 }
    );

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
