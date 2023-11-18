const https = require('node:https');
const fs = require('node:fs');

const client = {
  name: 'Clara',
  email: 'clarasroufe@gmail.com',
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
  start_time: '2023-11-17T23:00:00',
});

const request = {
  hostname: 'api.zoom.us',
  path: `/v2/users/me/meetings`,
  method: 'post',
  headers: {
    Authorization: `Bearer  eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImZmY2I3OGVmLWRlYzQtNDQzZC05NmJkLTJkNGY5YmIwZjFmYSJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJRazRFdnYycFFzQ2RhenRrNi1YdVZRIiwidmVyIjo5LCJhdWlkIjoiNzVhOWYwYTFkNWViZGI4NjdhOWQ3YjI0Mjc4YmUwOGQiLCJuYmYiOjE3MDAyODk5MTYsImNvZGUiOiJOMVV1YUVaclR0RzgzejE5dFZXb0lnejlUR3RNaWljdWUiLCJpc3MiOiJ6bTpjaWQ6aVBsb2FDdVNCSzVkYXNIdjFSb0lBIiwiZ25vIjowLCJleHAiOjE3MDAyOTM1MTYsInR5cGUiOjMsImlhdCI6MTcwMDI4OTkxNiwiYWlkIjoiR18tdmNzUEpUNHFJckdlRDJNRXhFdyJ9.eQPb6ivh4QFfSETnpPPvs8_f9nqSxvKzDvCNhHHj0jylERSRZLGWQ2Ld_siXw0nUJumTXkMLz47lVt1qQvAcjw`,
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
    fs.writeFileSync(
      process.cwd().concat('/artifacts/postMeetRes.json'),
      response,
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
