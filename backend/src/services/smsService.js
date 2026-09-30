/**
 * SMS Notification Service Abstraction
 * Supports configurable SMS gateways (e.g. Twilio) with a clean development mock logger.
 */

const sendSMS = async (phoneNumber, message) => {
  const provider = process.env.SMS_PROVIDER || 'mock';

  console.log(`[SMS NOTIFICATION] Provider: ${provider} | To: ${phoneNumber}`);
  console.log(`[SMS MESSAGE]: "${message}"`);

  if (provider === 'twilio' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const res = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      return { success: true, messageId: res.sid, provider: 'twilio' };
    } catch (err) {
      console.error('[SMS TWILIO ERROR]:', err.message);
      return { success: false, error: err.message, provider: 'twilio' };
    }
  }

  // Development safe mock implementation
  return {
    success: true,
    provider: 'mock',
    simulated: true,
    deliveredTo: phoneNumber,
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  sendSMS,
};
