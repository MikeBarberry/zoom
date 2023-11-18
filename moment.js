const moment = require('moment-timezone');

// Set the target date and time
const targetDateTime = moment.tz('2023-11-17T20:15:00', 'America/Los_Angeles'); // Adjust the time zone as needed

// Format the date and time
const formattedDateTime = targetDateTime.format('YYYY-MM-DDTHH:mm:ss');

console.log('Formatted Date and Time:', formattedDateTime);
