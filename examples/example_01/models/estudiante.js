'use strict'

module.exports = (insac, Field, DataType, Validator, Reference) => {

  return insac.createModel('estudiante', {
    fields: {
      id: Field.ID,
      ru: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        defaultValue: 9999,
        description: 'Registro Universitario'
      },
      id_persona: {
        type: DataType.INTEGER,
        allowNull: false,
        validator: Validator.INTEGER(1),
        reference: {
          model: 'persona',
          key: 'id',
          type: Reference.ONE_TO_ONE
        },
        description: 'Identificador único de la persona'
      }
    },
    options: {
      uniqueKeys: [
        {fields: ['ru']},
        {fields: ['id_persona']}
      ],
      timestamps: true
    }
  })

}
