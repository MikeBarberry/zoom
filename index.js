const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const { URLSearchParams } = require('node:url');

const artifactsPath = path.join(process.cwd(), 'artifacts');

const creds = {
  actid: process.env.ZOOM_ACCOUNT_ID,
  cliid: process.env.ZOOM_CLIENT_ID,
  clisec: process.env.ZOOM_CLIENT_SECRET,
};

const formData = new URLSearchParams([
  ['grant_type', 'account_credentials'],
  ['account_id', creds.actid],
]);

const request = {
  hostname: 'zoom.us',
  path: '/oauth/token'.concat(`?${formData.toString()}`),
  method: 'POST',
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${creds.cliid}:${creds.clisec}`
    ).toString('base64')}`,
  },
};

const makeRequest = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(request, (res) => {
      let data = '';

      // A chunk of data has been received.
      res.on('data', (chunk) => {
        //console.log(typeof chunk);
        data += chunk;
      });

      // The whole response has been received.
      res.on('end', () => {
        console.log(data);
        fs.writeFileSync(
          artifactsPath.concat('/token.txt'),
          data.concat('\n\n'),
          { flag: 'w' }
        );
        const { access_token } = JSON.parse(data);
        resolve(access_token);
      });
    });

    // Handle errors
    req.on('error', (e) => {
      reject(e.message);
    });

    req.end();
  });
};

(async () => {
  try {
    const access_token = await makeRequest();
    console.log('Access Token:', access_token);
    fs.writeFileSync(artifactsPath.concat('/token.txt'), access_token, {
      flag: 'a',
    });
  } catch (e) {
    console.log(`Error getting access token:\n${e}`);
  }
})();
