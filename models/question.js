var Question = sequelize.define('questions', {
  question: {
    type: Sequelize.TEXT
  },
  option1: {
    type: Sequelize.STRING
  }, option2: {
    type: Sequelize.STRING
  }, option3: {
    type: Sequelize.STRING
  }, option4: {
    type: Sequelize.STRING
  }, answer: {
    type: Sequelize.STRING
  }, cat_id: {
    type: Sequelize.INTEGER
  },

}, {
  freezeTableName: true // Model tableName will be the same as the model name
});