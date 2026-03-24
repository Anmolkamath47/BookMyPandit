export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { userId, profileData } = req.body;

  if (!userId || !profileData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // In production, save to database
  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
  });
}
