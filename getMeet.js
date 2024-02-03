const https = require('node:https');

const request = {
  hostname: 'api.zoom.us',
  path: `/v2/users/me/meetings`,
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjliN2I1NzNiLTJkOGQtNGE0Yi1hMDRlLTU3MWYwYTUzNDUzMyJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJRazRFdnYycFFzQ2RhenRrNi1YdVZRIiwidmVyIjo5LCJhdWlkIjoiNzVhOWYwYTFkNWViZGI4NjdhOWQ3YjI0Mjc4YmUwOGQiLCJuYmYiOjE3MDY5MjE3OTgsImNvZGUiOiI3blVMZzZPV1NwZXBZTGpGVEdWWC1BVzQwd0RrU0o0dzEiLCJpc3MiOiJ6bTpjaWQ6aVBsb2FDdVNCSzVkYXNIdjFSb0lBIiwiZ25vIjowLCJleHAiOjE3MDY5MjUzOTgsInR5cGUiOjMsImlhdCI6MTcwNjkyMTc5OCwiYWlkIjoiR18tdmNzUEpUNHFJckdlRDJNRXhFdyJ9.u35xuQlukIK69Z3Rk0M4WVXzzrQj8scXPlz7-gGFCJNBFjMFrQpCqJCSIJXeylAL7yxvq97T8VdVFD3RZR2GPw`,
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
