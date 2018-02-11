module.exports = (app) => {
  const CONTROLLER = {}

  CONTROLLER.listar = async (req, success) => {
    const OPTIONS = req.options
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario.listar(OPTIONS)
    })
    success(RESULT.rows, 'La lista de usuarios ha sido obtenida con éxito.', RESULT.count)
  }

  CONTROLLER.obtener = async (req, success) => {
    const OPTIONS = req.options
    OPTIONS.where = { id_usuario: req.params.id }
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario.obtener(OPTIONS)
    })
    success(RESULT, 'La información del usuario ha sido obtenida con éxito.')
  }

  CONTROLLER.crear = async (req, success) => {
    const USERNAME = req.body.username
    const PASSWORD = req.body.password
    const ROL = req.body.rol
    const RESULT = await app.DB.sequelize.transaction(async () => {
      const USUARIO = {
        username: USERNAME,
        password: PASSWORD,
        rol: ROL
      }
      return app.DAO.usuario.crear(USUARIO)
    })
    success(RESULT, 'El usuario ha sido creado con éxito.')
  }

  CONTROLLER.actualizar = async (req, success) => {
    const USUARIO = req.body
    const ID_USUARIO = req.params.id
    const RESULT = await app.DB.sequelize.transaction(async () => {
      await app.DAO.usuario.actualizar(USUARIO, ID_USUARIO)
    })
    success(RESULT, 'Los datos del usuario han sido actualizados con éxito.')
  }

  CONTROLLER.eliminar = async (req, success) => {
    const ID_USUARIO = req.params.id
    const RESULT = await app.DB.sequelize.transaction(async () => {
      return app.DAO.usuario.eliminar(ID_USUARIO)
    })
    success(RESULT, 'Los datos del usuario han sido eliminados con éxito.')
  }

  return CONTROLLER
}