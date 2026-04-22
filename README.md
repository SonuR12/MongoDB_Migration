# MongoDBMigrate

A secure, web-based MongoDB migration tool built with Next.js. Migrate data between MongoDB organizations and clusters without touching the terminal — no `mongodump`, no `mongorestore`.

## 🚀 Why I Built This

After receiving a Vercel security incident email requiring environment variable rotation (including MongoDB credentials), I realized how complex and risky database migrations can be. This tool was born from the need for a simple, secure, and user-friendly solution for MongoDB cluster migrations.

## ✨ Features

### Core Functionality
- **Zero Data Storage** - Connection strings are never stored, used only in-memory per request
- **One-Click Migration** - Preview all databases and collection counts before migrating
- **Real-time Progress Tracking** - Database-by-database migration with live progress bars (0-100% per database)
- **Smart Database Selection** - Choose exactly which databases to migrate with conflict detection
- **Flexible Connection Strings** - Works with or without database names in connection strings

### Security & Safety
- **Same Cluster Protection** - Prevents accidental migrations to the same cluster with visual warnings
- **IP Allowlist Guidance** - Built-in instructions for 0.0.0.0 setup and removal
- **Security Reminders** - Post-migration prompts to remove IP access and rotate passwords
- **Connection Validation** - Real-time connection string validation and error handling

### User Experience
- **Responsive Design** - Mobile and desktop optimized layouts
- **Database Conflict Detection** - Shows which databases already exist in destination
- **Progress Visualization** - Individual database progress with completion counters
- **Error Recovery** - Detailed error messages with troubleshooting guidance
- **Whitespace Handling** - Automatic trimming of pasted connection strings

## 🛠️ Tech Stack

- **[Next.js 16](https://nextjs.org)** — App Router + API Routes for full-stack functionality
- **[MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)** — Direct database access without external tools
- **[Tailwind CSS v4](https://tailwindcss.com)** — Modern utility-first styling
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety and better developer experience
- **[Vercel](https://vercel.com)** — Seamless deployment and hosting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas clusters (source and destination)
- Network access configured (see Security Setup below)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mongodb-migrate.git
cd mongodb-migrate

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

### Step 1: Security Setup
1. Go to your MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** or manually enter `0.0.0.0/0`
5. Apply this to **both source and destination clusters**

### Step 2: Migration Process
1. **Paste Source Connection String** - Your existing MongoDB cluster
2. **Click Preview Data** - See all databases and collection counts
3. **Paste Destination Connection String** - Your target MongoDB cluster
4. **Select Databases** - Choose which databases to migrate (shows conflicts)
5. **Click Migrate** - Watch real-time progress for each database
6. **Review Results** - See detailed migration statistics

### Step 3: Post-Migration Security
1. **Remove 0.0.0.0 IP** from both clusters' Network Access
2. **Rotate MongoDB passwords** for additional security
3. **Update your applications** with new connection strings

## 🔧 Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/databaseName
```

**Note:** The database name at the end is optional. If omitted, all databases on the cluster will be discovered and available for migration.

## 🛡️ Security Features

### Built-in Protections
- **Same Cluster Detection** - Visual warnings and disabled migration when source equals destination
- **Connection String Validation** - Real-time validation with helpful error messages
- **Memory-Only Processing** - No persistent storage of sensitive credentials
- **IP Access Reminders** - Prominent warnings about 0.0.0.0 security implications

### Best Practices
- Never commit real connection strings to version control
- Always remove 0.0.0.0 IP access after migration
- Rotate MongoDB Atlas passwords if they were ever exposed
- Use environment-specific clusters for different deployment stages

## 📊 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/preview` | POST | Lists all databases and collection counts from source cluster |
| `/api/migrate` | POST | Migrates selected databases from source to destination |
| `/api/check-destination` | POST | Checks which databases already exist in destination cluster |

## 🚀 Deploy on Vercel

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js — no configuration needed
4. Your migration tool is live!

## 🔄 Migration Process Details

### Real-time Progress Tracking
- **Individual Database Progress** - 0-100% completion per database
- **Current Database Display** - Shows which database is currently being migrated
- **Completion Counter** - Tracks completed vs total databases
- **Error Handling** - Graceful failure recovery with detailed error messages

### Database Selection
- **Conflict Detection** - Shows "Already exists" badges for existing databases
- **Smart Button Text** - Dynamic text showing "Migrate X databases" or "Overwrite Y databases"
- **Responsive Layout** - Mobile-friendly database selection with truncated names

## 🐛 Troubleshooting

### Common Issues

**SSL Connection Failed**
- Ensure 0.0.0.0/0 is added to Network Access in MongoDB Atlas
- Check that both source and destination clusters allow the IP
- Verify connection strings are correctly formatted

**Same Cluster Error**
- Ensure source and destination connection strings point to different clusters
- Check cluster hostnames in your connection strings

**Migration Timeout**
- Large databases may take significant time
- Check your internet connection stability
- Consider migrating databases individually for very large datasets

## 📝 Changelog

### v2.0 — Security & UX Overhaul
- Added same cluster detection and prevention
- Implemented real-time database-by-database progress tracking
- Enhanced security warnings and post-migration reminders
- Improved responsive design for mobile devices
- Added connection string whitespace handling
- Enhanced error messages with troubleshooting guidance

### v1.5 — Preview & Bug Fixes
- Fixed duplicate key warnings in database list
- Fixed crash when `docs` field was undefined on stale state
- Preview now shows database-level summary only (no internal collections)

### v0.2 — Database Auto-Discovery
- Connection strings without a database name now work (like MongoDB Compass)
- Auto-discovers all databases via `listDatabases()`
- Added `/api/preview` route for pre-migration data inspection

### v0.1 — Initial Release
- Basic migration form with source + destination inputs
- MongoDB-inspired dark UI with green accents
- Per-collection migration results panel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If this tool helped you with your MongoDB migrations, please give it a star! It helps others discover the project.

---

**Built with ❤️ for the developer community**