'use strict'
const { Model, Fields } = require(INSAC)

module.exports = (insac, models) => {

  return new Model('carrera', {
    description: 'Modelo que representa a una carrera universitaria',
    fields: {
      nombre: Fields.STRING({
        description: 'Nombre',
        allowNull: false
      })
    },
    options: {
      uniqueKeys: ['nombre']
    }
  })

}