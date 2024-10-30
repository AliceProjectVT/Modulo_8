module.exports = (sequelize, DataTypes) => {
  const Bootcamp = sequelize.define('bootcamp', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "El campo nombre (title) es requerido"
        },
      },
    },
    cue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Números de CUE es necesario, mínimo 5 y máximo 20"
        },
        isInt: {
          args: true,
          msg: "Debes introducir un número entero"
        },
        max: {
          args: 20,
          msg: "El valor máximo es 20"
        },
        min: {
          args: 5,
          msg: "El valor mínimo es 5"
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Se debe introducir una descripción"
        },
      },
    }
  });

  return Bootcamp;
}