// Mock database for pandits
const pandits = [
  {
    id: 'p1',
    name: 'Pandit Rajesh Kumar',
    email: 'rajesh@demo.com',
    city: 'Bengaluru',
    service: 'Satyanarayan Puja',
    price: 5000,
    bio: '25 years of experience in Vedic rituals',
    profilePhoto: '👨‍🧑‍🦱',
    profileComplete: true,
    createdAt: new Date().toISOString(),
  },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(400).json({ error: 'Only GET allowed' });
  }

  const { city, service } = req.query;

  let results = pandits.filter(p => p.profileComplete && p.city === city);
  
  if (service) {
    results = results.filter(p => p.service === service);
  }

  return res.status(200).json({ pandits: results });
}
