const bookings = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { userId, panditId, service, date, userName, panditName } = req.body;

  if (!userId || !panditId || !service || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const booking = {
    id: 'booking_' + Date.now(),
    userId,
    panditId,
    service,
    date,
    status: 'pending',
    userName,
    panditName,
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);

  return res.status(201).json({ booking });
}
