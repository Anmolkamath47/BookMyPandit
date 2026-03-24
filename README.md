# BookMyPandit
Booking Pandit for event in one click
npm run build
npm start
```

## Deployment on Vercel

This project is ready to be deployed on Vercel.

### Option 1: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to deploy your application.

## Demo Credentials

- **Email**: user@demo.com
- **Password**: demo123
- **Role**: User (looking for Pandit)

## Project Structure

```
pandit-booking-app/
├── components/
│   └── App.jsx           # Main application component
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   └── index.js         # Home page
├── styles/
│   └── globals.css      # Global styles
├── next.config.js       # Next.js configuration
├── vercel.json          # Vercel deployment configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Technology Stack

- **Frontend**: React 18
- **Framework**: Next.js 14
- **Styling**: CSS-in-JS (inline styles)
- **State Management**: React Hooks
- **Deployment**: Vercel

## Features by Role

### Users
- Search for pandits by city and service type
- View pandit profiles with pricing and bio
- Book ceremonies with specific dates
- Track booking requests and their status
- Mark completed bookings

### Pandits
- Create and update professional profiles
- Set availability and pricing
- View incoming booking requests
- Accept or reject requests
- Track booking history

## Environment Variables

Currently, the application uses in-memory storage. No environment variables are required for basic functionality.

For future enhancements with backend integration:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
>>>>>>> 40797b8 (Initial commit)
