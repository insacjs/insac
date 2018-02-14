const { errors } = require(global.INSAC)

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = async (req) => {
    // await app.AUTH.access('ADMIN', req)
  }

  MIDDLEWARE.obtener = async (req) => {
    const ID_CURSO = req.params.id_curso
    if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro del curso solicitado.`)
    }
  }

  MIDDLEWARE.crear = async (req) => {
    const NOMBRE = req.body.nombre
    if (await app.DAO.curso.buscar({ nombre: NOMBRE })) {
      throw new errors.PreconditionFailedError(`El nombre del curso ya se encuentra registrado.`)
    }
  }

  MIDDLEWARE.actualizar = async (req) => {
    const NOMBRE = req.body.nombre
    const CATEGORIA = req.body.categoria
    const ID_CURSO = req.params.id_curso
    if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro del curso que desea actualizar.`)
    }
    if (!NOMBRE && !CATEGORIA) {
      throw new errors.PreconditionFailedError(`Debe enviar al menos un dato válido, para actualizar el registro del curso.`)
    }
    if (NOMBRE && await app.DAO.curso.buscar({ nombre: NOMBRE }, { id_curso: ID_CURSO })) {
      throw new errors.PreconditionFailedError(`El nombre del curso ya se encuentra registrado.`)
    }
  }

  MIDDLEWARE.eliminar = async (req) => {
    const ID_CURSO = req.params.id_curso
    if (!await app.DAO.curso.buscar({ id_curso: ID_CURSO })) {
      throw new errors.PreconditionFailedError(`No se encuentra el registro del curso que desea eliminar.`)
    }
  }

  return MIDDLEWARE
}
