# Troubleshooting

This file covers the most likely local setup failures.

## 1. Prisma Error `P1001`

Example:

```text
P1001: Can't reach database server at localhost:5432
```

Meaning:

- PostgreSQL is not running
- or the port is wrong
- or the credentials in `server/.env` do not match the local database

Fix:

1. Start PostgreSQL
2. Verify port `5432`
3. Verify `DATABASE_URL` in `server/.env`

## 2. Prisma Migration Fails

Possible causes:

- database does not exist
- bad DB credentials
- old failed migration state

Fix:

1. Ensure database `hostel_platform` exists
2. Run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

If migration history is broken on a disposable local DB, reset it:

```bash
npx prisma migrate reset
```

Warning:

- this deletes local database data

## 3. Seed Fails

Possible causes:

- migration was not applied
- database connection failed
- Prisma client not generated

Fix:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## 4. Frontend Opens But Login Fails

Possible causes:

- backend is not running
- database was not seeded
- demo users do not exist

Check:

- `http://localhost:3001/api/v1`
- `http://localhost:3001/api/docs`

If backend is down, start it:

```bash
cd server
npm run start:dev
```

## 5. Backend Builds But API Is Not Reachable

Possible causes:

- backend process crashed on startup
- Prisma connection failed at boot
- port `3001` is already used

Check terminal output from:

```bash
npm run start:dev
```

Then verify port:

```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen
```

## 6. Frontend Builds But Page Is Blank

Possible causes:

- frontend dev server not running
- runtime API failure
- auth state mismatch in browser storage

Fix:

1. restart frontend
2. clear browser local storage
3. log in again

## 7. Upload Feature Fails

Possible causes:

- Cloudinary keys missing
- invalid file type
- file too large

Check these values in `server/.env`:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Allowed file types:

- jpeg
- png
- webp

## 8. Chatbot Fails

Possible causes:

- invalid `ANTHROPIC_API_KEY`
- backend is running but third-party request fails

Check:

- `ANTHROPIC_API_KEY` in `server/.env`

## 9. Notifications Not Reaching Frontend

Possible causes:

- backend socket gateway not running
- frontend socket token missing
- auth token expired

Check:

- user is logged in
- backend is up
- frontend uses `VITE_SOCKET_URL=http://localhost:3001`

## 10. Demo Users Missing

If admin login does not work, seed may not have run.

Run:

```bash
cd server
npx prisma db seed
```

Expected users:

- `admin@sau.ac.in`
- `warden@sau.ac.in`
- `student@sau.ac.in`

## 11. Suggested Recovery Flow

If a teammate is stuck and wants the cleanest local reset:

From `server`:

```bash
npx prisma migrate reset
npx prisma db seed
npm run start:dev
```

Then from `client`:

```bash
npm run dev
```

## 12. Before Asking For Help

Send these details to the team:

- OS
- Node version
- npm version
- PostgreSQL version
- exact command run
- exact error message
- whether `server/.env` was changed
