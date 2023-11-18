const https = require('node:https');

const request = {
  hostname: 'api.zoom.us',
  path: `/v2/users/me/meetings`,
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjAzZTA5ZDk0LWUxYTEtNGYyOS1hMjM4LWRhODljMWVjN2ZjZSJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJRazRFdnYycFFzQ2RhenRrNi1YdVZRIiwidmVyIjo5LCJhdWlkIjoiNzVhOWYwYTFkNWViZGI4NjdhOWQ3YjI0Mjc4YmUwOGQiLCJuYmYiOjE3MDAyNjgxODUsImNvZGUiOiJuRWFDQTF6RFJSQ1pUWEVBZWF1ZGVnSEo3VFNLU3BOaHAiLCJpc3MiOiJ6bTpjaWQ6aVBsb2FDdVNCSzVkYXNIdjFSb0lBIiwiZ25vIjowLCJleHAiOjE3MDAyNzE3ODUsInR5cGUiOjMsImlhdCI6MTcwMDI2ODE4NSwiYWlkIjoiR18tdmNzUEpUNHFJckdlRDJNRXhFdyJ9.N8YT1LgGbOkryPHwOT8sfLevmyD_Xh4_m4fQuxZTdFDI-IGPqhzaqrIt9QJ4HnwStih7UrWOY5HoVOQkUDG47Q`,
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
        resolve(data);
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
    const response = await makeRequest();
    console.log(response);
  } catch (e) {
    console.log(`Error creating meeting:\n${e}`);
  }
})();
