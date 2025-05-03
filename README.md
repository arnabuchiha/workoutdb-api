# My Workout SaaS

A SaaS platform for workout management with premium features powered by workoutdb-premium.

## Features

- Authentication (login/register)
- Rate limiting and API key protection
- Workout search with premium features
- Autocomplete suggestions
- Exercise alternatives

## Setup

1. Clone the repository with submodules:

```bash
git clone --recursive https://github.com/yourusername/my-workout-saas.git
cd my-workout-saas
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```
API_KEY=your-api-key
VERSION=1.0.0
```

## Development

Run the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- POST `/auth/login` - Login with email and password
- POST `/auth/register` - Register a new user

### Health Check

- GET `/health` - Check API status

### Protected Endpoints (requires API key)

- GET `/api/workouts/search?q=query` - Search workouts
- GET `/api/workouts/autocomplete?q=query` - Get autocomplete suggestions
- GET `/api/workouts/alternates/:id` - Get exercise alternatives

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## License

MIT

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```
