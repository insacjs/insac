const _      = require('lodash')
const util   = require('../tools/util')
const stdout = require('../tools/stdout')

let config = {}
util.find(process.cwd(), 'app.config.js', ({ filePath, fileName }) => { if (fileName === '') config = require(filePath) })

// |=============================================================|
// |------------ CONFIGURACIÓN DE LA BASE DE DATOS --------------|
// |=============================================================|

config.DATABASE = _.merge({
  username : process.env.DB_USER || 'postgres',
  password : process.env.DB_PASS || 'postgres',
  database : process.env.DB_NAME || 'postgres',
  params   : {
    dialect          : 'postgres',
    host             : process.env.DB_HOST_NAME || '127.0.0.1',
    port             : process.env.DB_HOST_PORT || '5432',
    timezone         : '-04:00',
    lang             : 'es',
    logging          : (process.env.SQL_LOG && process.env.SQL_LOG === 'true') ? stdout.sql : false,
    operatorsAliases : false,
    define           : {
      underscored     : true,
      freezeTableName : true,
      timestamps      : true,
      paranoid        : true,
      createdAt       : '_fecha_creacion',
      updatedAt       : '_fecha_modificacion',
      deletedAt       : '_fecha_eliminacion'
    }
  }
}, config.DATABASE || {})

// |=============================================================|
// |------------ CONFIGURACIÓN DEL SERVIDOR ---------------------|
// |=============================================================|

config.SERVER = _.merge({
  port : process.env.PORT     || 4000,
  env  : process.env.NODE_ENV || 'development',
  cors : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },
  ssl: {
    key  : undefined,
    cert : undefined
  },
  https: false
}, config.SERVER || {})

module.exports = config