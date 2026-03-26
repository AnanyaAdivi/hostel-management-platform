# Quickstart

This is the shortest reliable path for a teammate to run the project on localhost.

## 1. Clone and Open

```bash
git clone <repo-url>
cd hostel-platform
```

## 2. Install PostgreSQL

Install PostgreSQL if it is not already installed.

Use:

- user: `postgres`
- password: `postgres`
- port: `5432`

If PostgreSQL is already installed with different credentials, update:

```text
server/.env
```

## 3. Create Database

Create this database:

```sql
CREATE DATABASE hostel_platform;
```

## 4. Install Backend Dependencies

```bash
cd server
npm install
```

## 5. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 6. Check Environment Files

Make sure these exist:

- `server/.env`
- `client/.env`

## 7. Run Prisma Migration

From `server`:

```bash
cd ../server
npx prisma generate
npx prisma migrate dev --name init
```

## 8. Seed Demo Data

```bash
npx prisma db seed
```

## 9. Start Backend

```bash
npm run start:dev
```

Expected:

- API: `http://localhost:3001/api/v1`
- Swagger: `http://localhost:3001/api/docs`

## 10. Start Frontend

In a new terminal:

```bash
cd hostel-platform/client
npm run dev
```

Expected:

- frontend: `http://localhost:5173`

## 11. Login

Use:

- Admin: `admin@sau.ac.in` / `admin123`

Or:

- Warden: `warden@sau.ac.in` / `warden123`
- Student: `student@sau.ac.in` / `student123`

## 12. If Login Fails

Check these three things first:

1. Is PostgreSQL running on `5432`?
2. Did `npx prisma db seed` succeed?
3. Is backend reachable at `http://localhost:3001/api/v1`?

## Windows Notes

To check PostgreSQL service:

```powershell
Get-Service *postgres*
```

To check port `5432`:

```powershell
Get-NetTCPConnection -LocalPort 5432 -State Listen
```

To check backend port `3001`:

```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen
```

To check frontend port `5173`:

```powershell
Get-NetTCPConnection -LocalPort 5173 -State Listen
```
