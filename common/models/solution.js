/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
let uniqid = require('uniqid');

module.exports = function(Solution) {
  let app = require('../../server/server');

  Solution.add = function(body, cb) {
    let QuestionHub = app.models.QuestionHub;
    let Doctor = app.models.Doctor;
    let AnswerChoice = app.models.AnswerChoice;
    Solution.create(body, (err, solutions) => {
      QuestionHub.updateAll({id: body.hub_id}, {hasAnswer: true}, (err, info) => {
        Doctor.find({}, (err, Doctors) => {
          if (err) throw err;
          Doctors.forEach(Doctor => {
            AnswerChoice.create({
              id: uniqid(),
              doctor_id: Doctor.id,
              hub_id: body.hub_id,
              solution_id: body.id,
            });
          });
        });
        if (err) throw err;
        cb(null, 'updated the hub');
      });
    });
  };

  Solution.remoteMethod(
    'add', {
      http: {
        path: '/addNew',
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
