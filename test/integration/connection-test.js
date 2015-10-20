'use strict';
const Connection = require('../../src/api/common/connection');

const request1 = {
  command: 'server_info'
};

const request2 = {
  command: 'account_info',
  account: 'r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59'
};

const request3 = {
  command: 'account_info'
};

const request4 = {
  command: 'account_info',
  account: 'invalid'
};

function makeRequest(connection, request) {
  return connection.request(request).then((response) => {
    console.log(request);
    console.log(JSON.stringify(response, null, 2));
  }).catch((error) => {
    console.log(request);
    console.log(error);
  });
}

function main() {
  const connection = new Connection('wss://s1.ripple.com');
  connection.connect().then(() => {
    console.log('Connected');
    Promise.all([
      makeRequest(connection, request1),
      makeRequest(connection, request2),
      makeRequest(connection, request3),
      makeRequest(connection, request4)
    ]).then(() => {
      console.log('Done');
      process.exit();
    });
  });
}

main();