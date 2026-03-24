// Mock database
const users = [
  {
    id: 'u1',
    email: 'user@demo.com',
    password: 'demo123',
    name: 'Arjun Sharma',
    role: 'user',
    city: 'Bengaluru',
  },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      city: user.city,
      profilePhoto: user.profilePhoto || null,
      profileComplete: user.profileComplete || false,
    },
  });
}
