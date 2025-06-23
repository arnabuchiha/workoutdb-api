# 🏋️ WorkoutDB API

A high-performance, open-source API for managing workouts, muscle activations, equipment, and body parts. Built for developers, trainers, and fitness platforms that want to build powerful, flexible, and cost-effective exercise recommendation systems.

This API powers smart workout search, alternative exercise suggestions based on actual muscle activation data, and lets you manage detailed fitness metadata across exercises.

Website: [WorkoutDB API](https://workoutdb.is-app.in)

## 📦 **Data Model**

The API includes endpoints for:

- **Workouts**: with names, instructions, muscles, equipment, and YouTube demos
- **Muscles**: including grouped muscle codes and activation levels
- **Muscle Activations**: scientifically grounded values (0.0–1.0)
- **Equipment** and **Body Parts** metadata
- **Smart Alternatives**: Get similar workouts based on activation profiles

Muscle activation values are grounded in biomechanical and sports science literature. They're used to compare and recommend exercises based on how much a particular muscle is engaged.

---

## ⚙️ **Tech Stack**

WorkoutDB is optimized for performance and affordability using a modern serverless stack:

- **Backend**: [Hono](https://hono.dev) (fast, minimal web framework)
- **Runtime**: [Cloudflare Workers](https://developers.cloudflare.com/workers/) (ultra-fast global edge compute via V8 isolates)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (type-safe database access)
- **Database**: [Supabase](https://supabase.com/) PostgreSQL (hosted with relational schema)
- **Infrastructure**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for deploying to Cloudflare
- **Environment**: Built with TypeScript, ESM-first, ESLint, Prettier, and Husky for linting and formatting

This stack allows API calls to return in **milliseconds**, even under load, while keeping infra **costs low**.

---

## 🚀 Running the Project Locally

To get started with WorkoutDB locally:

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/workout-db-api.git
cd workout-db-api
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Create Environment Variables

Create a `.dev.vars` file in the root directory and fill in the following:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
DATABASE_URL=
DIRECT_URL=
VERSION=
ENVIRONMENT=development
API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
RAPID_API_SECRET=
ADMIN_KEY=
```

### 4. Start the Dev Server

```bash
bun run dev
```

This uses Cloudflare Workers + Wrangler to run the project locally.

### 5. Database Setup

Use the Drizzle ORM CLI to manage your database:

```bash
bun run db:push   # Apply schema
bun run db:pull   # Sync with remote
```

---

## 🔍 **Key Features of the WorkoutDB API**

### 🧠 Smart Exercise Recommendations

Get scientifically-backed **alternate workouts** using real **muscle activation data**. Whether your users are avoiding injury, training different muscles, or need variety, our algorithm provides alternatives based on actual activation levels—not guesswork.

### 🔎 Intelligent Search Autocomplete

Search is smooth and intuitive. The API supports **autocomplete** for exercise names, body parts, equipment, and muscle groups, helping users find the exact workout they’re looking for—fast.

### ⚡ Fast & Lightweight

The API is optimized for **high performance and low latency**. Responses are paginated, cache-safe (on your end), and can handle bulk updates efficiently—ideal for mobile apps and frontend dashboards.

### 💰 Cost-Effective

Built for scale without burning a hole in your budget. WorkoutDB offers **developer-friendly pricing**, so you can build powerful fitness applications while keeping costs low.

### 🏋️ Comprehensive Database

Access a rich and curated collection of:

- 1500+ workouts
- Detailed muscle mappings
- Equipment and body part breakdowns
- Step-by-step instructions for each exercise

### 📈 Activation-Based Training Insights

Beyond names and categories, each workout entry includes:

- **Primary and secondary muscle activations**
- **Activation scores (0.0 – 1.0)** for precision
- Great for visual analytics, charts, and adaptive workout planning

---

## **Terms of Use**

<details>
<summary>📜 Expand to Read</summary>

### 1. Ownership of Data and Content

All data and content served by the **WorkoutDB API**—including but not limited to workouts, exercises, muscle information, equipment details, and body part metadata—are the exclusive property of the WorkoutDB API team. You are not permitted to claim ownership of the underlying data, structure, or compiled datasets.

### 2. Usage Rights

By subscribing to or accessing the WorkoutDB API, you are granted a **non-exclusive, non-transferable, and revocable license** to access and use the API content during your active subscription period. This license is subject to these Terms of Use and may be terminated at any time upon violation of any term herein.

### 3. Termination of Access

Upon the expiration, cancellation, or non-payment of a subscription, all rights to use the WorkoutDB API are **immediately revoked**. Users must cease accessing the API and **delete any locally stored or cached data** retrieved from the API, including all JSON responses, linked content, and derivative datasets.

### 4. Caching and Data Storage

Caching or storing WorkoutDB API responses is **strictly prohibited**, unless explicitly permitted through a separate licensing agreement. Clients are expected to make live API calls for each data retrieval. You may not create a shadow database or offline copy of the API data.

### 5. Prohibited Uses

The following activities are strictly forbidden:

- **Redistributing, reselling, or sublicensing** the data served through the API.
- **Scraping** the API or any of its endpoints.
- Using the API data to build a competing service or derivative dataset that mimics WorkoutDB functionality or structure.
- Using the API content in violation of any **local, national, or international laws**.

### 6. YouTube Links Disclaimer

Some workout entries may include links to publicly available **YouTube videos**. These videos are:

- **Not owned or controlled** by WorkoutDB.
- Provided **solely for convenience and demonstration purposes**.
- The responsibility for ensuring proper usage of these links and any content therein rests entirely with the user.

WorkoutDB does not host or distribute any video files directly.

### 7. Changes to the Terms

WorkoutDB reserves the right to **modify these Terms of Use at any time**. Continued use of the API following any changes constitutes your acceptance of the updated terms. You are encouraged to review this page periodically.

### 8. Contact Information

For inquiries, license extensions, or reporting violations, please reach out to the API support team at:

**Email:** [ad733943@gmail.com](mailto:ad733943@gmail.com)

</details>
