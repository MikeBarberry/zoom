const https = require('node:https');
const fs = require('node:fs');

/*
const client = {
  name: 'Clara',
  email: 'clarasroufe@gmail.com',
};
*/

const client = {
  name: 'Mouse',
  email: 'mbarberry20@outlook.com',
};

const topic = `${client.name} & Mike Meeting`;

const requestData = JSON.stringify({
  agenda: topic,
  topic,
  type: 2,
  duration: 30,
  settings: {
    waiting_room: false,
    email_notification: true,
    join_before_host: true,
    meeting_authentication: false,
    meeting_invitees: [
      {
        email: client.email,
      },
    ],
  },
  timezone: 'America/Los_Angeles',
  start_time: '2024-02-03T13:00:00',
});

const request = {
  hostname: 'api.zoom.us',
  path: `/v2/users/me/meetings`,
  method: 'post',
  headers: {
    Authorization: `Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6Ijk3ZTY3MWQyLTliYTgtNDdkZi1hOTM3LWQzYTFiMWQyZWU4YyJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJRazRFdnYycFFzQ2RhenRrNi1YdVZRIiwidmVyIjo5LCJhdWlkIjoiNzVhOWYwYTFkNWViZGI4NjdhOWQ3YjI0Mjc4YmUwOGQiLCJuYmYiOjE3MDY5MjIwNDAsImNvZGUiOiIxS1c4VW1ERVFOT1pnRUhHZ3ZOWXNnOVMwUzZZSU1tQWwiLCJpc3MiOiJ6bTpjaWQ6aVBsb2FDdVNCSzVkYXNIdjFSb0lBIiwiZ25vIjowLCJleHAiOjE3MDY5MjU2NDAsInR5cGUiOjMsImlhdCI6MTcwNjkyMjA0MCwiYWlkIjoiR18tdmNzUEpUNHFJckdlRDJNRXhFdyJ9.uwIaqHvxXBIfECet6zCRY6isVWQDmdkapy7kRefXDQjKFH54tAAV11qfpHP3S_0xMurssWiScFd17XRa2o4Naw`,
    'Content-Type': 'application/json',
  },
};

const makeRequest = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(request, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    // Handle errors
    req.on('error', (e) => {
      reject(e.message);
    });

    req.write(requestData);

    req.end();
  });
};

(async () => {
  try {
    const response = await makeRequest();
    console.log(response, typeof response);
    fs.writeFileSync(
      process.cwd().concat('/artifacts/postMeetRes.json'),
      JSON.stringify(response),
      {
        flag: 'w',
      }
    );
    const { topic, start_url, join_url, password, start_time } = response;
    console.log(topic, start_url, join_url, password, start_time);
    fs.writeFileSync(
      process.cwd().concat('/artifacts/postMeetRes.txt'),
      `Start URL ${start_url}\nJoin URL ${join_url}\nPassword ${password}`,
      {
        flag: 'w',
      }
    );
  } catch (e) {
    console.log(`Error creating meeting:\n${e}`);
  }
})();
