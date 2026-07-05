const cron = require('node-cron');
const Trip = require('../models/Trip');
const sendEmail = require('./sendEmail');

// Runs every day at 8:00 AM server time
const startReminderJob = () => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const now = new Date();
      const threeDaysFromNow = new Date(now);
      threeDaysFromNow.setDate(now.getDate() + 3);

      // Trips starting within the next 3 days, reminder not yet sent
      const trips = await Trip.find({
        startDate: { $gte: now, $lte: threeDaysFromNow },
        reminderSent: { $ne: true },
      })
        .populate('userId', 'name email')
        .populate('destinationId', 'name');

      for (const trip of trips) {
        if (!trip.userId?.email) continue;

        const destinationName = trip.destinationId?.name || trip.title;
        const daysLeft = Math.ceil((new Date(trip.startDate) - now) / (1000 * 60 * 60 * 24));

        await sendEmail({
          to: trip.userId.email,
          subject: `✈️ Your trip "${trip.title}" is almost here!`,
          html: `
            <div style="font-family: Georgia, serif; background: #FFF8F5; padding: 32px; border-radius: 12px; max-width: 520px;">
              <h1 style="color: #D85A30; margin-top: 0;">Wander<span style="color:#3D1A0E">Wise</span></h1>
              <h2 style="color: #3D1A0E;">Hi ${trip.userId.name}! 🌴</h2>
              <p style="color: #993C1D; font-size: 15px;">
                Your trip <strong>"${trip.title}"</strong> to <strong>${destinationName}</strong> starts in
                <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong>!
              </p>
              <p style="color: #993C1D; font-size: 14px;">
                Don't forget to check your itinerary, budget, and travel checklist before you go.
              </p>
              <p style="color: #3D1A0E; font-size: 13px; margin-top: 24px;">
                roam smart. go far. — WanderWise
              </p>
            </div>
          `,
        });

        trip.reminderSent = true;
        await trip.save();
      }

      if (trips.length) console.log(`📧 Sent ${trips.length} trip reminder(s)`);
    } catch (err) {
      console.error('Reminder job error:', err.message);
    }
  });

  console.log('⏰ Trip reminder job scheduled (daily 8:00 AM)');
};

module.exports = startReminderJob;