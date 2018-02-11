const { errors } = require('insac-response')

module.exports = (app) => {
  const MIDDLEWARE = {}

  MIDDLEWARE.listar = async (req) => {}

  MIDDLEWARE.obtener = async (req) => {
    const ID_USUARIO = req.params.id
    if (!await app.DAO.usuario.buscar({id_usuario: ID_USUARIO})) {
      throw new errors.PreconditionError([{
        path: 'params.id',
        value: ID_USUARIO,
        msg: `No se encuentra el registro del usuario solicitado.`
      }])
    }
  }

  MIDDLEWARE.crear = async (req) => {
    const USERNAME = req.body.username
    if (await app.DAO.usuario.buscar({ username: USERNAME })) {
      throw new errors.PreconditionError([{
        path: 'body.username',
        value: USERNAME,
        msg: `El nombre de usuario ya se encuentra registrado.`
      }])
    }
  }

  MIDDLEWARE.actualizar = async (req) => {
    const USERNAME = req.body.username
    const PASSWORD = req.body.password
    const ID_USUARIO = req.params.id
    if (!await app.DAO.usuario.buscar({ id_usuario: ID_USUARIO })) {
      throw new errors.PreconditionError([{
        path: 'params.id',
        value: ID_USUARIO,
        msg: `No se encuentra el registro del usuario que desea actualizar.`
      }])
    }
    if (!USERNAME && !PASSWORD) {
      throw new errors.PreconditionError([{
        path: 'body.username | body.password',
        value: `${USERNAME} | ${PASSWORD}`,
        msg: `Debe enviar al menos un dato válido, para actualizar el registro del usuario.`
      }])
    }
    if (USERNAME && await app.DAO.usuario.buscar({ username: USERNAME }, { id_usuario: ID_USUARIO })) {
      throw new errors.PreconditionError([{
        path: 'body.username',
        value: USERNAME,
        msg: `El nombre de usuario ya se encuentra registrado.`
      }])
    }
  }

  MIDDLEWARE.eliminar = async (req) => {
    const ID_USUARIO = req.params.id
    if (!await app.DAO.usuario.buscar({ id_usuario: ID_USUARIO })) {
      throw new errors.PreconditionError([{
        path: 'params.id',
        value: ID_USUARIO,
        msg: `No se encuentra el registro del usuario que desea eliminar.`
      }])
    }
  }

  return MIDDLEWARE
}