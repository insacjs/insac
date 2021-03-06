const Sequelize = require('sequelize')
const Field     = require('../../../lib/libs/FieldCreator')
const _         = require('lodash')

let config
let DB_CONFIG

describe('\n - Prueba de integración - FieldCreator.\n', () => {
  before(() => {
    config    = _.cloneDeep(require('../../test.config'))
    DB_CONFIG = config.DATABASE.postgres
  })
  describe(` Validadores por defecto`, () => {
    it('Validador de tipo STRING', () => {
      const FIELD = Field.STRING()
      expect(FIELD.validate).to.have.property('len')
      expect(FIELD.validate.len).to.be.an('object')
      expect(FIELD.validate.len).to.have.property('args')
      expect(FIELD.validate.len.args).to.be.an('array').to.have.lengthOf(2)
      expect(FIELD.validate.len.args[0]).to.equal(0)
      expect(FIELD.validate.len.args[1]).to.equal(255)

      const FIELD2 = Field.STRING(50)
      expect(FIELD2.validate).to.have.property('len')
      expect(FIELD2.validate.len).to.be.an('object')
      expect(FIELD2.validate.len).to.have.property('args')
      expect(FIELD2.validate.len.args).to.be.an('array').to.have.lengthOf(2)
      expect(FIELD2.validate.len.args[0]).to.equal(0)
      expect(FIELD2.validate.len.args[1]).to.equal(50)
    })
    it('Validador de tipo INTEGER', () => {
      const FIELD = Field.INTEGER()
      expect(FIELD.validate).to.have.property('isInt')
      expect(FIELD.validate.isInt).to.be.an('boolean', true)
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate.min).to.be.an('object')
      expect(FIELD.validate.min.args[0]).to.equal(0)
      expect(FIELD.validate).to.have.property('max')
      expect(FIELD.validate.max.args).to.equal(2147483647)
    })
    it('Validador de tipo FLOAT', () => {
      const FIELD = Field.FLOAT()
      expect(FIELD.validate).to.have.property('isFloat')
      expect(FIELD.validate.isFloat).to.be.an('boolean', true)
      expect(FIELD.validate).to.have.property('min')
      expect(FIELD.validate.min).to.be.an('object')
      expect(FIELD.validate.min.args[0]).to.equal(0)
      expect(FIELD.validate).to.have.property('max')
      expect(FIELD.validate.max.args).to.equal(1E+308)
    })
    it('Validador de tipo ENUM', () => {
      const VALUES = ['A', 'B', 'C']
      const FIELD = Field.ENUM(VALUES)
      expect(FIELD.validate).to.have.property('isIn')
      expect(FIELD.validate.isIn).to.be.an('object')
      expect(FIELD.validate.isIn).to.have.property('args')
      expect(FIELD.validate.isIn.args).to.be.an('array').to.have.lengthOf(1)
      expect(FIELD.validate.isIn.args[0]).to.deep.equal(VALUES)
    })
    it('Validador de tipo BOOLEAN', () => {
      const FIELD = Field.BOOLEAN()
      expect(FIELD.validate).to.have.property('isBoolean')
      expect(FIELD.validate.isBoolean).to.be.an('boolean', true)
    })
    it('Validador de tipo DATE', () => {
      const FIELD = Field.DATE()
      expect(FIELD.validate).to.have.property('isDate')
      expect(FIELD.validate.isDate).to.be.an('boolean', true)
    })
    it('Validador de tipo DATEONLY', () => {
      const FIELD = Field.DATEONLY()
      expect(FIELD.validate).to.have.property('isDate')
      expect(FIELD.validate.isDate).to.be.an('boolean', true)
    })
    it('Validador de tipo TIME', () => {
      const FIELD = Field.TIME()
      expect(FIELD.validate).to.have.property('isTime')
      expect(FIELD.validate.isTime).to.be.an('function')
    })
    it('Validador de tipo JSON', () => {
      const FIELD = Field.JSON()
      expect(FIELD.validate).to.have.property('isJson')
      expect(FIELD.validate.isJson).to.be.an('function')
    })
    it('Validador de tipo JSONB', () => {
      const FIELD = Field.JSONB()
      expect(FIELD.validate).to.have.property('isJson')
      expect(FIELD.validate.isJson).to.be.an('function')
    })
    it('Validador de tipo UUID', () => {
      const FIELD = Field.UUID()
      expect(FIELD.validate).to.have.property('isUUID')
      expect(FIELD.validate.isUUID).to.be.an('object')
      expect(FIELD.validate.isUUID).to.have.property('args')
      expect(FIELD.validate.isUUID.args).to.be.an('number', 4)
    })
    it('Validador de tipo ARRAY de STRING', () => {
      const FIELD = Field.ARRAY(Field.STRING())
      expect(FIELD.validate).to.have.property('isArray')
      expect(FIELD.validate.isArray).to.be.an('function')
    })
  })
  describe(` Todos los validadores`, () => {
    it('STRING is',             async () => { await verificarValidate('is',             ['^[a-z]+$', 'i'], 'abc',                 '123') })
    it('STRING is',             async () => { await verificarValidate('is',             /^[a-z]+$/i,       'abc',                 '123') })
    it('STRING not',            async () => { await verificarValidate('not',            ['[a-z]', 'i'],    '123',                 'abc') })
    it('STRING isEmail',        async () => { await verificarValidate('isEmail',        true,              'admin@gmail.com',     'mail') })
    it('STRING isUrl',          async () => { await verificarValidate('isUrl',          true,              'http://example.com',  'other') })
    it('STRING isIP',           async () => { await verificarValidate('isIP',           true,              '127.0.0.1',           '1234.56') })
    it('STRING isIPv4',         async () => { await verificarValidate('isIPv4',         true,              '127.0.0.1',           '2001:db8::2:1') })
    it('STRING isIPv6',         async () => { await verificarValidate('isIPv6',         true,              '2001:db8::2:1',       '127.0.0.1') })
    it('STRING isAlpha',        async () => { await verificarValidate('isAlpha',        true,              'abc',                 '123') })
    it('STRING isAlphanumeric', async () => { await verificarValidate('isAlphanumeric', true,              'abc123',              '123-*12') })
    it('STRING isNumeric',      async () => { await verificarValidate('isNumeric',      true,              '123',                 'abc123') })
    it('STRING isInt',          async () => { await verificarValidate('isInt',          true,              '123',                 '1234567891234567834c234234234234234234239') })
    it('STRING isFloat',        async () => { await verificarValidate('isFloat',        true,              '11.99',               'C21') })
    it('STRING isDecimal',      async () => { await verificarValidate('isDecimal',      true,              '11.234',              '11.5A') })
    it('STRING isLowercase',    async () => { await verificarValidate('isLowercase',    true,              'abc',                 'ABC') })
    it('STRING isUppercase',    async () => { await verificarValidate('isUppercase',    true,              'ABC',                 'abc') })
    it('STRING isNull',         async () => { await verificarValidate('isNull',         true,              null,                  'otherValue') })
    it('STRING notEmpty',       async () => { await verificarValidate('notEmpty',       true,              'abc',                 '') })
    it('STRING equals',         async () => { await verificarValidate('equals',         'ABC123',          'ABC123',              'XYZ') })
    it('STRING contains',       async () => { await verificarValidate('contains',       'def',             'abcdefghi',           'xyz') })
    it('STRING notContains',    async () => { await verificarValidate('notContains',    'def',             'xyz',                 'abcdefghi') })
    it('STRING notIn',          async () => { await verificarValidate('notIn',          [['A', 'B']],      'Z',                   'A') })
    it('STRING isIn',           async () => { await verificarValidate('isIn',           [['A', 'B']],      'A',                   'Z') })
    it('STRING len',            async () => { await verificarValidate('len',            [2, 5],            'alfa',                'diamante') })
    it('STRING isUUID',         async () => { await verificarValidate('isUUID',         4,                 '15dab328-07dc-4400-a5ea-55f836c40f31',  'CODIGO') })
    it('STRING isDate',         async () => { await verificarValidate('isDate',         true,              '2015-05-30',          '30/05/2015') })
    it('STRING isAfter',        async () => { await verificarValidate('isAfter',        '2010-05-30',      '2020-05-30',          '2000-05-30') }) // ????
    it('STRING isBefore',       async () => { await verificarValidate('isBefore',       '2020-05-30',      '2010-05-30',          '2050-05-30') }) // ????
    it('STRING min',            async () => { await verificarValidate('min',            0,                 24,                    -4) })
    it('STRING max',            async () => { await verificarValidate('max',            0,                 -4,                     24) })
    it('STRING isCreditCard',   async () => { await verificarValidate('isCreditCard',   true,              '4024007111739206',    'abcd1234wxyz0000') })
  })
})

/**
* Verifica un tipo de validador
*/
async function verificarValidate (key, args, datoValido, datoInvalido) {
  const FIELDS    = []
  const msg       = 'CUSTOM_MESSAGE'
  const validate1 = {}
  const validate2 = {}
  const validate3 = {}
  validate1[key] = args
  validate2[key] = { args }
  validate3[key] = { args, msg }
  FIELDS.push(Field.STRING({ validate: validate1 }))
  FIELDS.push(Field.STRING({ validate: validate2 }))
  FIELDS.push(Field.STRING({ validate: validate3 }))
  for (let i = 0; i < 3; i++) {
    const FIELD = FIELDS[i]
    Object.keys(FIELD.validate).forEach(valKey => {
      if (valKey !== key) delete FIELD.validate[valKey]
    })
    expect(FIELD.validate).to.have.property(key)
    expect(['object', 'boolean'].includes(typeof FIELD.validate[key])).to.equal(true)
    if ((typeof FIELD.validate[key] === 'object') && (typeof FIELD.validate[key].args !== 'undefined')) {
      if (args === 0 || args === 1) {
        expect(FIELD.validate[key].args).to.be.an('array').to.have.lengthOf(1)
        expect(FIELD.validate[key].args[0]).to.equal(args)
      } else {
        expect(FIELD.validate[key].args).to.deep.equal(args)
      }
    }
    if (i === 2) { expect(FIELD.validate[key]).to.have.property('msg', msg) }
    await verificarConSequelize(FIELD, key, datoValido, datoInvalido)
  }
}

/**
* Verifica con una instancia Sequelize.
*/
async function verificarConSequelize (FIELD, key, datoValido, datoInvalido) {
  const sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.username, DB_CONFIG.password, DB_CONFIG.params)
  const MODEL     = sequelize.define('model', { custom: FIELD })
  const instance  = MODEL.build()
  try {
    instance.dataValues.custom = datoValido
    await instance.validate({ fields: ['custom'] })
  } catch (e) { throw e }
  try {
    instance.dataValues.custom = datoInvalido
    await instance.validate({ fields: ['custom'] })
    throw new Error('Debió haber ocurrido un error')
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      for (let i = 0; i < e.errors.length; i++) {
        const errorItem = e.errors[i]
        if (errorItem.validatorKey) {
          expect(errorItem).to.have.property('validatorKey').to.be.a('string').to.equal(key)
        }
        expect(errorItem).to.have.property('type')
        expect(errorItem).to.have.property('path', 'custom')
        expect(errorItem).to.have.property('value')
        expect(errorItem.value).to.deep.equal(datoInvalido)
      }
      return
    }
    throw e
  }
}
