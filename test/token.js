const https = require('node:https');

const getZoomToken = async () => {
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

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const { access_token } = JSON.parse(data);
          resolve(access_token);
        });
      });

      req.on('error', (e) => {
        reject(e.message);
      });

      req.end();
    });
  };

  let accessToken = null;
  try {
    accessToken = await makeRequest();
    return accessToken;
  } catch (e) {
    console.log(`Error getting Zoom access token: ${e}`);
  } finally {
    return accessToken;
  }
};

(async () => {
  const accessToken = await getZoomToken();
  console.log(accessToken);
})();
