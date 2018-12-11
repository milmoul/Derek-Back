/* eslint-disable camelcase */
'use strict';
const request = require('request');
// eslint-disable-next-line max-len
const PAGE_ACCESS_TOKEN = 'EAADvFZA80kBIBAHmq7D3yk3RV9hTfnh90Yo1w2ZB1pZCyqEPjB6PbhOZA1USIYS94cC4ZBpFkRmOUv1maVkyidZB6j3hK9nyHrZABEdkZBS1ynwKU7CrQCZB6EXC7kZAJYRMeUSp3kZCIsqfeMeGfAvf8qGV6cJjQzoShUAoZC3S6domtQZDZD';

const callSendAPI = function(sender_psid, response) {
    // Construct the message body
  let request_body = {
    'messaging_type': 'RESPONSE',
    'recipient': {
      'id': sender_psid,
    },
    'message': {
      'text': response,
    },
  };
    // Send the HTTP request to the Messenger Platform
  request({
    'uri': 'https://graph.facebook.com/v2.6/me/messages',
    'qs': {'access_token': PAGE_ACCESS_TOKEN},
    'method': 'POST',
    'json': request_body,
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent! ', request_body.message.text);
    } else {
      console.error('Unable to send message:' + err);
    }
  });
};

module.exports = callSendAPI;
