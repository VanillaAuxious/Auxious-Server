const messaging = require('./firebaseInit');

async function sendNotificationToClient(tokens, data) {
  try {
    const response = await messaging.sendMulticast({ tokens, data });

    const successes = response.responses.filter(
      (res) => res.success === true,
    ).length;

    const failures = response.responses.filter(
      (res) => res.success === false,
    ).length;

    console.log(
      'Notifications sent:',
      `${successes} successful, ${failures} failed`,
    );
  } catch {
    console.log('Error sending message:', error);
  }
}

module.exports = {
  sendNotificationToClient,
};
