const { THIS } = require(global.INSAC)

module.exports = (app) => {
  const INPUT = {}

  INPUT.listar = {
    headers: { authorization: THIS('auth') },
    query: {
      fields: THIS('query'),
      order: THIS('query'),
      limit: THIS('query'),
      page: THIS('query')
    }
  }

  INPUT.obtener = {
    params: { id_curso: THIS({ allowNull: false }) }
  }

  INPUT.crear = {
    body: {
      nombre: THIS({ allowNull: false }),
      categoria: THIS({ allowNull: false })
    }
  }

  INPUT.actualizar = {
    params: { id_curso: THIS({ allowNull: false }) },
    body: {
      nombre: THIS({ allowNull: true }),
      categoria: THIS({ allowNull: true })
    }
  }

  INPUT.eliminar = {
    params: { id_curso: THIS({ allowNull: false }) }
  }

  return INPUT
}
