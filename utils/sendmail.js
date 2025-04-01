const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.SIB_KEY;

// Function to send email using the Brevo API
function sendEmail(toEmail, otp) {
  const data = {
    to: [
      {
        email: toEmail,
        name: "Devesh Singh"
      }
    ],
    templateId: 1,
    params: {
      otp: otp
    },
    headers: {
      "charset": "iso-8859-1"
    }
  };

  return axios.post('https://api.brevo.com/v3/smtp/email', data, {
    headers: {
      'Accept': 'application/json',
      'api-key': apiKey,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    // console.log(response.data);
    return response.data;
  })
  .catch(error => {
    // console.error(error.data);
    return error.data
    // throw error;
  });
}


// Exporting the sendEmail function
module.exports = sendEmail ;


