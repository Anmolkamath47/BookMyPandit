// Mock database - in production, use Firebase or your own database
const users = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { email, password, userData } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    email,
    password, // In production, hash this!
    ...userData,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  return res.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      city: newUser.city,
    },
  });
}
