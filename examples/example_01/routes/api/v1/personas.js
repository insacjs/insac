'use strict'

module.exports = (insac, models, Field, Data, Validator, Util) => {

  let routes = []

  routes.push(insac.createRoute('GET', '/api/v1/personas', {
    model: models.persona,
    output: {
      isArray: true,
      metadata: true,
      data: {
        id: models.persona.fields.id,
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci,
        _fecha_creacion: models.persona._fecha_creacion,
        _fecha_modificacion: models.persona._fecha_modificacion
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsQUERY(opt, req)
      models.persona.seq.findAndCountAll(options).then((result) => {
        let metadata = Util.metadata(result, options)
        let data = Util.output(opt, result.rows)
        res.success200(data, metadata)
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('GET', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: models.persona.fields.id
      }
    },
    output: {
      data: {
        id: models.persona.fields.id,
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci,
        _fecha_creacion: models.persona._fecha_creacion,
        _fecha_modificacion: models.persona._fecha_modificacion
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(opt, req)
      models.persona.seq.findOne(options).then((result) => {
        if (result) {
          let data = Util.output(opt, result)
          return res.success200(data)
        }
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
      }).catch(function (err) {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('POST', '/api/v1/personas', {
    model: models.persona,
    input: {
      body: {
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci
      }
    },
    controller: (req, res, opt, next) => {
      let persona = opt.input.body
      models.persona.seq.create(persona).then((result) => {
        res.success201(result)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('PUT', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: models.persona.fields.id
      },
      body: {
        nombre: models.persona.fields.nombre,
        direccion: models.persona.fields.direccion,
        ci: models.persona.fields.ci
      }
    },
    controller: (req, res, opt, next) => {
      let persona = opt.input.body
      let options = Util.optionsID(opt, req)
      models.persona.seq.update(persona, options).then((result) => {
        let nroRowAffecteds = result[0];
        if (nroRowAffecteds > 0) {
          return res.success200()
        }
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  routes.push(insac.createRoute('DELETE', '/api/v1/personas/:id', {
    model: models.persona,
    input: {
      params: {
        id: models.persona.fields.id
      }
    },
    controller: (req, res, opt, next) => {
      let options = Util.optionsID(opt, req)
      models.persona.seq.destroy(options).then((result) => {
        if (result > 0) {
          return res.success200()
        }
        let msg = `No existe el registro '${opt.model.name}' con el campo (id)=(${req.params.id})`
        res.error422(msg)
      }).catch((err) => {
        res.error(err)
      })
    }
  }))

  return routes

}
