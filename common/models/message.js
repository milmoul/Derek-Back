/* eslint-disable max-len */
/* eslint-disable camelcase */
'use strict';

const {PythonShell} = require('python-shell');
const callSendAPI = require('../custom_functions/messenger_api');
const env = require('../../server/env');
const socketFunctions = require('../../server/socketFunctions.js');
const uniqid = require('uniqid');
// Se référer à la documentation de Facebook for Developers pour les fonctions utilisant l'API Messenfger : https://developers.facebook.com/docs/messenger-platform/send-messages

module.exports = function(Message) {
  let app = require('../../server/server');

  function handleMessage(message, patient, socket) {
    let QuestionHub = app.models.QuestionHub;
    let Question = app.models.Question;
    let Solution = app.models.Solution;
    let AnswerChoice = app.models.AnswerChoice;

    // Check if the message contains text
    QuestionHub.find({include: 'questions'}, (err, QuestionHubs) => {
      let hubs = [];
      QuestionHubs.forEach(hub => {
        let hubJSON = hub.toJSON();
        let usefullHub = {
          hub_id: hubJSON.id,
          questionList: hubJSON.questions,
        };
        hubs.push(usefullHub);
      });
      if (message.content) {
        // The arguments passed to the python script is the received message and all the hubs in the database
        let options = {
          mode: 'text',
          scriptPath: __dirname,
          args: [message.content, JSON.stringify(hubs)],
        };

        PythonShell.run('python_script.py', options, function(err, results) {
          if (err) throw err;
          // Results is an array consisting of objects: {hub_id:"id", match_percentage:0.3472}
          console.log('results: ', results);
          let best_hub = {hub_id: null, match_percent: 0};
          results.forEach(hub => {
            if (JSON.parse(hub).hub_match_percent > best_hub.match_percent && JSON.parse(hub).hub_match_percent > 0.5) {
              best_hub = JSON.parse(hub);
            }
          });
          console.log(best_hub);
          if (best_hub.hub_id) {
            console.log('Matched with hub: ', best_hub.hub_id);
            Question.create({
              id: uniqid(),
              content: message.content,
              question_hub_id: best_hub.hub_id,
              patient_psid: patient.id,
            }, (err, Questions) => {
              console.log('Added new question');
            });

            AnswerChoice.find({
              where: {
                hub_id: best_hub.hub_id,
                doctor_id: patient.doctor_id,
              },
              include: {
                relation: 'solution',
              },
            }, (err, AnswerChoices) => {
              console.log(AnswerChoices);
              if (AnswerChoices.length > 0) {
                let solution = AnswerChoices[0].toJSON().solution;
                console.log('Found a solution: ', solution);
                callSendAPI(message.senderPsid, solution.content);
                let response = {content: solution.content, senderPsid: message.senderPsid, id: message.id, username: 'Bot'};
                socketFunctions.publish(socket, response);
              } else {
                console.log('No solution');
              }
            });
          } else {
            console.log('No match found');
            QuestionHub.create({
              id: uniqid(),
              name: message.content,
              operation_id: 'fake_operation_id', // Il va falloir passer d'une facon ou d'une autre le type d'operation dans le message
              hasAnswer: false,
            }, (err, QuestionHubs) => {
              console.log(QuestionHubs);
              Question.create({
                id: uniqid(),
                content: message.content,
                question_hub_id: QuestionHubs.id,
                patient_psid: patient.id,
              }, (err, Questions) => {
                console.log('Added hub and question');
              });
            });
          }
        });
      }
    });
  };

  Message.receive = function(msg, cb) {
    let Patient = app.models.Patient;
    let socket = Message.app.io;
    let body = msg;
      // Checks this is an event from a page subscription
    if (body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
          // Gets the message. entry.messaging is an array, but
          // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
          // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log(webhook_event);
        if (webhook_event.message) {
          Message.create([{
            content: webhook_event.message.text,
            senderPsid: sender_psid,
          }], (err, Messages) => {
            if (sender_psid !== env.botPsid) {
              Patient.find({where: {psid: sender_psid}}, (err, patients) => {
                if (patients.length > 0) {
                  let response = Messages[0];
                  response.username = patients[0].lastname;
                  socketFunctions.publish(socket, response);
                  handleMessage(Messages[0], patients[0], socket);
                } else {
                  console.log('not known user');
                }
              });
            }
          });
        }
      });
      cb(null, 'EVENT_RECIEVED');
    } else {
      cb(404);
    }
  };

  Message.connection = function(req, cb) {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = 'letokendugentilbotdemarinetemile';
    console.log(req.query);
        // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
        // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        cb(null, parseInt(challenge));
      } else {
            // Responds with '403 Forbidden' if verify tokens do not match
        cb(null, 'unauthorized');
      }
    } else {
      cb(null, 'error in query');
    }
  };

  Message.remoteMethod(
      'receive', {
        http: {
          path: '/webhook',
          verb: 'post',
        },
        accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
        returns: {
          arg: 'message',
          type: 'string',
        },
      }
    );
  Message.remoteMethod(
        'connection', {
          http: {
            path: '/webhook',
            verb: 'get',
          },
          accepts: {arg: 'req', type: 'object', http: {source: 'req'}},
          returns: {arg: 'challenge', type: 'number', root: true},
        }
      );
};

