'use strict'
const Model = require('../../../lib/core/Model')
const Field = require('../../../lib/fields/Field')
const Fields = require('../../../lib/tools/Fields')
const DataTypes = require('../../../lib/tools/DataTypes')
const Validators = require('../../../lib/tools/Validators')

describe('\n - Clase: Model\n', () => {

  describe(` Método: constructor`, () => {
    it('instanciando un objeto sin parámetros', () => {
      let model = new Model('usuario')
      expect(Object.keys(model.fields).length).to.equal(1)
      expect(model.fields.id instanceof Field).to.equal(true)
      expect(typeof model.options).to.equal('object')
      expect(model.options.singular).to.equal('usuario')
      expect(model.options.plural).to.equal('usuarios')
      expect(model.options.uniqueKeys.length).to.equal(0)
      expect(model.options.timestamps).to.equal(false)
      expect(model.options.createdAt).to.equal('_fecha_creacion')
      expect(model.options.updatedAt).to.equal('_fecha_modificacion')
      expect(model.options.associations.length).to.equal(0)
    })

    it('Instanciando un objeto con parámetros', () => {
      let data = {
        fields: {
          name: Fields.STRING(100),
          year: Fields.INTEGER()
        },
        options: {
          plural: 'autores',
          uniqueKeys: ['name'],
          timestamps: false
        }
      }
      let model = new Model('autor', data)
      expect(Object.keys(model.fields).length).to.equal(3)
      expect(model.fields.id instanceof Field).to.equal(true)
      expect(model.fields.name instanceof Field).to.equal(true)
      expect(model.fields.year instanceof Field).to.equal(true)
      expect(typeof model.options).to.equal('object')
      expect(model.options.singular).to.equal('autor')
      expect(model.options.plural).to.equal('autores')
      expect(model.options.uniqueKeys.length).to.equal(data.options.uniqueKeys.length)
      expect(model.options.uniqueKeys[0]).to.equal(data.options.uniqueKeys[0])
      expect(model.options.timestamps).to.equal(false)
      expect(model.options.createdAt).to.equal('_fecha_creacion')
      expect(model.options.updatedAt).to.equal('_fecha_modificacion')
      expect(model.options.associations.length).to.equal(0)
    })
  })

  describe(` Método: updateModels`, () => {
    it('Actualizando los modelos', () => {
      let usuario = new Model('usuario')
      let persona = new Model('persona',{
        fields: {
          id_usuario: Fields.ONE_TO_ONE(usuario)
        }
      })
      let estudiante = new Model('estudiante', {
        fields: {
          id_persona: Fields.ONE_TO_ONE(persona, {as:'persona_custom'})
        }
      })
      let models = []
      models['usuario'] = usuario
      models['persona'] = persona
      models['estudiante'] = estudiante
      expect(usuario.options.associations.length).to.equal(0)
      expect(persona.options.associations.length).to.equal(0)
      expect(estudiante.options.associations.length).to.equal(0)
      usuario.updateModels(models)
      expect(usuario.options.associations.length).to.equal(0)
      expect(persona.options.associations.length).to.equal(0)
      expect(estudiante.options.associations.length).to.equal(0)
      persona.updateModels(models)
      expect(usuario.options.associations.length).to.equal(1)
      expect(usuario.options.associations[0].model).to.equal('persona')
      expect(usuario.options.associations[0].as).to.equal('persona')
      expect(persona.options.associations.length).to.equal(0)
      expect(estudiante.options.associations.length).to.equal(0)
      estudiante.updateModels(models)
      expect(usuario.options.associations.length).to.equal(1)
      expect(usuario.options.associations[0].model).to.equal('persona')
      expect(usuario.options.associations[0].as).to.equal('persona')
      expect(persona.options.associations.length).to.equal(1)
      expect(persona.options.associations[0].model).to.equal('estudiante')
      expect(persona.options.associations[0].as).to.equal('estudiante')
      expect(estudiante.options.associations.length).to.equal(0)
      // Verificamos que de actualizarse otra vez el mismo modelo,
      // no se alteren los demas modelos
      estudiante.updateModels(models)
      expect(usuario.options.associations.length).to.equal(1)
      expect(usuario.options.associations[0].model).to.equal('persona')
      expect(usuario.options.associations[0].as).to.equal('persona')
      expect(persona.options.associations.length).to.equal(1)
      expect(persona.options.associations[0].model).to.equal('estudiante')
      expect(persona.options.associations[0].as).to.equal('estudiante')
      expect(estudiante.options.associations.length).to.equal(0)
    })
  })

  describe(` Método: sequelize`, () => {
    it('Verificando el objeto sequelize de un modelo', () => {
      let data = {
        fields: {
          name: Fields.STRING(100),
          year: Fields.INTEGER()
        },
        options: {
          plural: 'autores',
          uniqueKeys: ['name'],
          timestamps: true,
          createdAt: 'fecha_de_creacion',
          updatedAt: 'fecha_de_modificacion'
        }
      }
      let model = new Model('autor', data)
      let define = model.sequelize()
      expect(define.name).to.equal('autor')
      expect(typeof define.attributes).to.equal('object')
      expect(Object.keys(define.attributes).length).to.equal(5)
      expect(typeof define.options).to.equal('object')
      expect(define.options.singular).to.equal('autor')
      expect(define.options.plural).to.equal('autores')
      expect(define.options.timestamps).to.equal(true)
      expect(define.options.uniqueKeys.length).to.equal(1)
      expect(define.options.uniqueKeys[0].fields.length).to.equal(1)
      expect(define.options.uniqueKeys[0].fields[0]).to.equal('name')
      expect(define.options.createdAt).to.equal('fecha_de_creacion')
      expect(define.options.updatedAt).to.equal('fecha_de_modificacion')
      expect(define.options.freezeTableName).to.equal(true)
    })
  })

  describe(` Método: getModelOfProperty`, () => {
    it('Devolviendo el resultado de campos válidos e inválidos', () => {
      let usuario = new Model('usuario')
      let persona = new Model('persona',{
        fields: {
          id_usuario: Fields.ONE_TO_ONE(usuario)
        }
      })
      let estudiante = new Model('estudiante', {
        fields: {
          id_persona: Fields.ONE_TO_ONE(persona, {as:'persona_custom'})
        }
      })
      let proyecto = new Model('proyecto', {
        fields: {
          id_estudiante1: Fields.ONE_TO_MANY(estudiante),
          id_estudiante2: Fields.ONE_TO_MANY(estudiante)
        }
      })
      let models = []
      models['usuario'] = usuario
      models['persona'] = persona
      models['estudiante'] = estudiante
      models['proyecto'] = proyecto
      usuario.updateModels(models)
      persona.updateModels(models)
      estudiante.updateModels(models)
      proyecto.updateModels(models)

      let usuarioResult = usuario.getModelOfProperty('persona', models)
      expect(typeof usuarioResult).to.equal('object')
      expect(usuarioResult.model instanceof Model).to.equal(true)
      expect(usuarioResult.model.name).to.equal('persona')
      expect(usuarioResult).to.have.property('isArray', false)
      usuarioResult = usuario.getModelOfProperty('other')
      expect(typeof usuarioResult).to.equal('object')
      expect(usuarioResult).to.have.property('model', undefined)
      expect(usuarioResult).to.have.property('isArray', false)

      let personaResult = persona.getModelOfProperty('estudiante', models)
      expect(typeof personaResult).to.equal('object')
      expect(personaResult.model instanceof Model).to.equal(true)
      expect(personaResult.model.name).to.equal('estudiante')
      expect(personaResult).to.have.property('isArray', false)
      personaResult = persona.getModelOfProperty('usuario', models)
      expect(typeof personaResult).to.equal('object')
      expect(personaResult.model instanceof Model).to.equal(true)
      expect(personaResult.model.name).to.equal('usuario')
      expect(personaResult).to.have.property('isArray', false)

      let estudianteResult = estudiante.getModelOfProperty('persona', models)
      expect(typeof estudianteResult).to.equal('object')
      expect(estudianteResult.model instanceof Model).to.equal(true)
      expect(estudianteResult.model.name).to.equal('persona')
      expect(estudianteResult).to.have.property('isArray', false)

      // Como es de 1 a N, el nombre del campo debe estar en plural
      estudianteResult = estudiante.getModelOfProperty('proyecto', models)
      expect(typeof estudianteResult).to.equal('object')
      expect(estudianteResult).to.have.property('model', undefined)
      expect(estudianteResult).to.have.property('isArray', false)
      estudianteResult = estudiante.getModelOfProperty('proyectos', models)
      expect(typeof estudianteResult).to.equal('object')
      expect(estudianteResult.model instanceof Model).to.equal(true)
      expect(estudianteResult.model.name).to.equal('proyecto')
      expect(estudianteResult).to.have.property('isArray', true)
    })
  })

})