/* eslint-disable max-len */
/* eslint-disable camelcase */
// eslint-disable-next-line strict
let faker = require('faker');

module.exports = function(app) {
  let lbTables = ['Message', 'OperationType', 'Operation', 'Patient', 'QuestionHub', 'Question', 'Solution', 'Doctor', 'AnswerChoice'];
  app.dataSources.postGre.automigrate(lbTables, function(er) {
    if (er) throw er;
    app.models.Doctor.create([{
      id: 'fake_doctor_id',
      firstname: 'fake_doctor',
      lastname: 'fake_doctor_lastname',
    }], (err, Doctors) =>  {
      if (err) throw err;
      app.models.OperationType.create([{
        id: 'fake_operation2_id',
        name: 'Appendicite',
      }, {
        id: 'fake_operation_id',
        name: 'Chirugie du pied',
      }], function(err, OperationTypes) {
        if (err) throw err;
        app.models.Patient.create([{
          id: 'fake_patient_id',
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          psid: 'fake_patient_psid',
          doctor_id: 'fake_doctor_id',
        }, {
          id: 'marin_id',
          firstname: 'Marin',
          lastname: 'Merlin',
          psid: '1907097259403451',
          doctor_id: 'fake_doctor_id',
        }], (err, Patients) =>  {
          if (err) throw err;
          app.models.Operation.create([{
            id: 'fake_operation_instance_id',
            operation_type: 'fake_operation_id',
            patient_id: 'fake_patient_id',
            date: '2018-11-23',
            info: 'fake_info',
          }], (err, Operations) =>  { if (err) throw err; });
          app.models.QuestionHub.create([{
            id: 'fake_hub_id',
            name: "J'ai mal au pied",
            operation_id: 'fake_operation_id',
            hasAnswer: false,
          }, {
            id: 'test_id',
            name: "L'alcool est interdit?",
            operation_id: 'fake_operation_id',
            hasAnswer: false,
          }, {
            id: 'fake_hub3_id',
            name: 'Alcool',
            operation_id: 'fake_operation_id',
            hasAnswer: false,
          }, {
            id: 'fake_hub4_id',
            name: "J'ai des nausées",
            operation_id: 'fake_operation_id',
            hasAnswer: false,
          }], (err, QuestionHubs) =>  {
            if (err) throw err;
            app.models.Question.create([{
              id: 'fake_question_id',
              content: "J'ai parfois mal au pied",
              question_hub_id: 'fake_hub_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question2_id',
              content: 'Mon pied me fait mal',
              question_hub_id: 'fake_hub_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question3_id',
              content: "L'alcool est-il interit ?",
              question_hub_id: 'test_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question4_id',
              content: "J'ai une douleur au pied",
              question_hub_id: 'fake_hub_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question5_id',
              content: 'Mon pied me fait souffrir',
              question_hub_id: 'fake_hub_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question6_id',
              content: "Ai-je le droit de boire de l'alcool ?",
              question_hub_id: 'test_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question7_id',
              content: 'Je peux prendre une bière ?',
              question_hub_id: 'test_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question8_id',
              content: 'Je peux aller au bar?',
              question_hub_id: 'fake_hub3_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question9_id',
              content: "Est-ce possible de boire de l'alcool ?",
              question_hub_id: 'fake_hub3_id',
              patient_psid: 'fake_patient_psid',
            }, {
              id: 'fake_question10_id',
              content: "J'ai des nausées",
              question_hub_id: 'fake_hub4_id',
              patient_psid: 'fake_patient_psid',
            }], (err, Questions) =>  {
              app.models.Solution.create([{
                id: 'fake_solution_id',
                content: 'Prenez un doliprane',
                hub_id: 'fake_hub_id',
                author_id: 'fake_doctor_id',
              }, {
                id: 'fake_solution2_id',
                content: 'Prenez 2 doliprane tout les 4 heures',
                hub_id: 'fake_hub_id',
                author_id: 'fake_doctor_id',
              }, {
                id: 'test_solution_id',
                content: "Vous ne pouvez pas boire d'alcool pendant les deux semaines suivant l'opération",
                hub_id: 'test_id',
                author_id: 'fake_doctor_id',
              }, {
                id: 'fake_solution3_id',
                content: "L'alcool est interdit",
                hub_id: 'fake_hub3_id',
                author_id: 'fake_doctor_id',
              }], (err, Solutions) =>  {
                if (err) throw err;
                app.models.AnswerChoice.create([{
                  id: 'fake_answerchoice_id',
                  doctor_id: 'fake_doctor_id',
                  hub_id: 'fake_hub_id',
                  solution_id: 'fake_solution_id',
                }, {
                  id: 'fake_answerchoice3_id',
                  doctor_id: 'fake_doctor_id',
                  hub_id: 'test_id',
                  solution_id: 'test_solution_id',
                }, {
                  id: 'fake_answerchoice2_id',
                  doctor_id: 'fake_doctor_id',
                  hub_id: 'fake_hub3_id',
                  solution_id: 'fake_solution3_id',
                }], (err, AnswerChoices) => {
                  app.models.QuestionHub.updateAll({id: Solutions[0].hub_id}, {hasAnswer: true}, (err, info) => {
                    if (err) throw err;
                    app.models.QuestionHub.updateAll({id: Solutions[1].hub_id}, {hasAnswer: true}, (err, info) => {
                      if (err) throw err;
                      app.models.QuestionHub.updateAll({id: Solutions[2].hub_id}, {hasAnswer: true}, (err, info) => {
                        if (err) throw err;
                        console.log('Loopback tables [' + lbTables + '] created in ', app.dataSources.postGre.adapter.name);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

