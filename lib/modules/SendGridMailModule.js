/** @ignore */ const handlebars = require('handlebars')
/** @ignore */ const sgMail     = require('@sendgrid/mail')
/** @ignore */ const path       = require('path')
/** @ignore */ const Module     = require('../core/Module')
/** @ignore */ const util       = require('../tools/util')

/**
* Módulo optimizado para gestionar el envío de emails.
*/
class SendGridMailModule extends Module {
  /**
  * Crea una instancia de la clase ResourceModule.
  * @param {Object} config - Configuración del módulo.
  */
  constructor (config = {}) {
    super(config, 'SENDGRID_MAIL')
    sgMail.setApiKey(this.config.sendGridApiKey)
    /**
    * Configuracion.
    * @type {Object}
    */
    this.config.sendPath = this.config.sendPath || path.resolve(this.config.modulePath, 'send')
  }

  /**
  * Función que se ejecuta cuando se inicializa la aplicación.
  * @param {Function} app - Instancia del servidor express.
  * @return {Promise}
  */
  async onStart (app) {
    await super.onStart(app)
    await this._loadSend(app, this)
  }

  /**
  * Función encargada de cargar todos los archivos que contienen funciones para enviar emails.
  * @param {Function}       app    - Instancia del servidor express
  * @param {ResourceModule} MODULE - Instancia del módulo.
  */
  _loadSend (app, MODULE) {
    MODULE.send = {}
    util.find(MODULE.config.sendPath, '.html', ({ filePath, fileName, dirPath }) => {
      const MAIL_PATH  = path.resolve(dirPath, `${fileName}.mail.js`)
      const getContent = require(MAIL_PATH)(app)
      const template   = handlebars.compile(util.readFile(filePath))
      MODULE.send[fileName] = (...args) => {
        const CONTENT = getContent(...args)
        const MSG     = {
          from    : CONTENT.from,
          to      : CONTENT.to,
          subject : CONTENT.subject,
          html    : template(CONTENT.data)
        }
        return this._sendMail(MSG, MODULE.config.logger)
      }
      app.log(`\x1b[2m - [send] ${fileName}\x1b[0m\n`)
    })
  }

  /**
  * Función que permite cargar todos los archivos de un recurso.
  * @param {Function} msg - Objeto que contiene los datos del email.
  * @return {Promise}
  */
  _sendMail (msg) {
    return new Promise((resolve, reject) => {
      return sgMail.send(msg).then(() => {
        resolve(` - Email enviado a: ${msg.to} \u2713`)
      }).catch(err => { reject(err) })
    })
  }
}

module.exports = SendGridMailModule