# Cloudflare + Convex File Manager

[cloudflarebutton]

A production-ready full-stack file management application built with Cloudflare Workers, Convex backend, and React frontend. Users can securely upload, list, view, and delete files with robust authentication (email/password with OTP verification, anonymous access).

## Features

- **Secure Authentication**: Email/password sign-up/sign-in with OTP verification, password reset, and anonymous mode using Convex Auth.
- **File Management**: Upload files to Convex Storage, list user files with metadata, generate signed URLs, and delete files.
- **Responsive UI**: Modern shadcn/ui components, Tailwind CSS, dark/light theme toggle, sidebar navigation.
- **Real-time Queries**: Instant file listing and user state with Convex React client.
- **Production-Optimized**: Cloudflare Workers for edge deployment, Hono routing, CORS, error handling, and logging.
- **Developer-Friendly**: TypeScript end-to-end, hot-reload development, Bun-powered workflows.

## Tech Stack

- **Frontend**: React 18, Vite, React Router, TanStack Query, shadcn/ui, Tailwind CSS, Lucide Icons, Sonner Toasts
- **Backend**: Convex (queries/mutations/actions), Convex Auth, Convex Storage
- **Deployment**: Cloudflare Workers/Pages, Wrangler
- **Tools**: Bun (package manager), TypeScript, ESLint, Hono (API routing)
- **Other**: Immer, Framer Motion, Zod (validation-ready)

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - Cloudflare account with Workers enabled
   - Convex account (free tier works)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd <project-dir>
   bun install
   ```

3. **Environment Setup**:
   - Create `.dev.vars` with:
     ```
     VITE_CONVEX_URL=https://your-deployment.convex.cloud
     ANDROMO_SMTP_URL=https://your-smtp-service.com
     ANDROMO_SMTP_API_KEY=your-smtp-key
     ```
   - Run `bun run backend:deploy` to deploy Convex backend (prompts for login).
   - Update `wrangler.jsonc` and `convex/auth.config.ts` with your Cloudflare/Convex details if needed.

4. **Development**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `${PORT}`).

## Local Development

- **Frontend + Backend**: `bun dev` (starts Vite + Convex sync).
- **Type Generation**: `bun run cf-typegen` (Cloudflare bindings).
- **Lint**: `bun lint`.
- **Preview Build**: `bun preview`.
- **Backend Only**: `npx convex dev`.
- Access `/api/health` for worker status.

Hot-reload works for frontend. Convex functions auto-sync on changes.

## Usage Examples

- **Sign Up/In**: Use email/password flow with OTP verification.
- **Upload Files**:
  ```tsx
  // Example integration (extend HomePage)
  const { generateUploadUrl, saveFileMetadata } = useConvexAuth().actions;
  ```
- **List Files**: `useQuery(api.files.listFiles)`.
- **Delete File**: `useMutation(api.files.deleteFile)`.

API endpoints via Hono (`/api/*`): Extend `worker/userRoutes.ts`.

## Deployment

1. **Deploy Backend**:
   ```bash
   bun run backend:deploy
   ```
   Set `VITE_CONVEX_URL` from Convex dashboard.

2. **Deploy Frontend/Worker**:
   ```bash
   bun run deploy
   ```
   Or use the button below for one-click:

[cloudflarebutton]

3. **Custom Domain**: Update `wrangler.jsonc` and run `wrangler deploy`.
4. **Environment Variables**: Set in Cloudflare dashboard (Wrangler secrets: `wrangler secret put <KEY>`).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CONVEX_URL` | Convex deployment URL | Yes |
| `ANDROMO_SMTP_URL` | SMTP service base URL | Yes (email auth) |
| `ANDROMO_SMTP_API_KEY` | SMTP API key | Yes (email auth) |

## Project Structure

```
├── convex/          # Backend: Schema, auth, files
├── src/             # React frontend: Pages, components, hooks
├── worker/          # Cloudflare Worker: Hono API routing
├── shared/          # Shared types/utils
└── package.json     # Bun scripts
```

## Contributing

1. Fork & PR.
2. Use `bun dev` for testing.
3. Follow TypeScript/shadcn conventions.

## License

MIT. See [LICENSE](LICENSE) for details.