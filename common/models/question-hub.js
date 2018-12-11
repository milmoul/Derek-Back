/* eslint-disable camelcase */
'use strict';

module.exports = function(Questionhub) {
  let app = require('../../server/server');

  Questionhub.fusion = function(body, cb) {
    let Question = app.models.Question;
    let Solution = app.models.Solution;
    let Choice = app.models.AnswerChoice;
    let newId = body.id_original;
    let oldId = body.id_copie;
    Question.updateAll({question_hub_id: oldId}, {question_hub_id: newId}, (err, info) => {
      if (err) throw err;
      console.log(info);
      Solution.updateAll({hub_id: oldId}, {hub_id: newId}, (err, info) => {
        if (err) throw err;
        console.log(info);
        Choice.updateAll({hub_id: oldId}, {hub_id: newId}, (err, info) => {
          if (err) throw err;
          console.log(info);
          Questionhub.destroyById(oldId, (err) => {
            if (err) throw err;
            console.log(info);
            console.log('Deleted the model: ', oldId);
            cb(null, 'Hub deleted');
          });
        });
      });
    });
  };

  Questionhub.remoteMethod(
    'fusion', {
      http: {
        path: '/fusion',
        verb: 'post',
      },
      accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
      returns: {
        arg: 'message',
        type: 'string',
      },
    }
  );
};
