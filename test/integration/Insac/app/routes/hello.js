'use strict'
const { Route, Fields } = require(INSAC)

module.exports = (insac, models, db) => {

  return new Route('GET', '/hello', {
    output: {
      msg: Fields.STRING({description:'Mensaje de bienvenida'})
    },
    middlewares: ['adminMiddleware'],
    controller: (req) => {
      return { msg: `Bienvenido al mundo real`, token: req.token }
    }
  })

}
