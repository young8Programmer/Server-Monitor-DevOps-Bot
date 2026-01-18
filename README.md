# 🛡️ OpsPulse AI - Server Monitoring & Remote Control Bot

Professional server monitoring and DevOps automation bot built with NestJS. This bot provides real-time server monitoring, remote terminal access, log tracking, uptime monitoring, and database backup capabilities through Telegram.

## ✨ Features

### 📊 Real-time Monitoring
- **CPU, RAM, Disk Usage**: Monitor system resources in real-time
- **Automated Alerts**: Get notified when RAM usage exceeds threshold (default: 90%)
- **System Stats**: Detailed system information including uptime and load average
- **Live Updates**: WebSocket support for real-time status updates

### 💻 Remote Terminal
- **Secure Command Execution**: Execute commands remotely through Telegram bot
- **Safety First**: Dangerous commands are blocked (rm -rf, format, etc.)
- **Timeout Protection**: Commands automatically timeout after 30 seconds
- **Output Formatting**: Command outputs are formatted for easy reading

### 📝 Log Tracker
- **Error Detection**: Automatically monitors log files for errors
- **Real-time Alerts**: Sends notifications when errors are detected
- **Multiple Files**: Support for monitoring multiple log files simultaneously
- **Smart Filtering**: Filters logs for errors, exceptions, fatal, and critical messages

### 🌐 Uptime Checker
- **Website Monitoring**: Monitor multiple websites/APIs for availability
- **Status Alerts**: Get notified when sites go down or recover
- **Response Time Tracking**: Monitor response times for performance insights
- **Error Detection**: Detects 500 errors and connection failures

### 💾 Database Backups
- **On-Demand Backups**: Create database backups with a single command
- **Multiple Databases**: Support for PostgreSQL, MySQL, and MongoDB
- **Compressed Archives**: Backups are automatically compressed
- **Telegram Delivery**: Backups are sent directly to Telegram
- **Auto Cleanup**: Old backups are automatically cleaned up (keeps last 10)

### 🔒 Security
- **Telegram ID Whitelist**: Only authorized Telegram IDs can use the bot
- **Command Safety**: Dangerous system commands are blocked
- **Environment Variables**: Sensitive data stored in environment variables

### 🔌 WebSocket Gateway
- **Live Status**: Real-time system status updates via WebSocket
- **Web Dashboard Support**: Ready for web dashboard integration
- **5-Second Updates**: Status updates every 5 seconds

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Telegram Bot Token (get from [@BotFather](https://t.me/BotFather))
- Database tools (pg_dump, mysqldump, or mongodump) for backup feature

### Setup Steps

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
ALLOWED_TELEGRAM_IDS=your_telegram_user_id
RAM_THRESHOLD=90
LOG_PATHS=/var/log/app/error.log
UPTIME_URLS=https://yourwebsite.com
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database
```

4. **Get your Telegram User ID**
   - Start a conversation with [@userinfobot](https://t.me/userinfobot) on Telegram
   - It will reply with your user ID
   - Add this ID to `ALLOWED_TELEGRAM_IDS` in `.env`

5. **Build the project**
```bash
npm run build
```

6. **Start the application**
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## 📖 Usage

### Telegram Bot Commands

- `/start` - Start the bot and see welcome message
- `/status` - Get current server status (CPU, RAM, Disk)
- `/stats` - Get detailed system statistics
- `/terminal` - Execute terminal commands remotely
- `/backup` - Create database backup
- `/help` - Show help message

### Examples

**Check server status:**
```
/status
```

**Execute a command:**
```
df -h
docker ps
pm2 list
```

**Create database backup:**
```
/backup
```

## 🏗️ Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── config/
│   └── config.service.ts      # Configuration service
├── telegram/
│   ├── telegram-bot.module.ts
│   ├── telegram-bot.service.ts
│   ├── telegram-bot.update.ts # Bot command handlers
│   └── guards/
│       └── telegram-security.guard.ts
├── monitoring/
│   ├── monitoring.module.ts
│   ├── monitoring.service.ts
│   └── monitoring-scheduler.service.ts
├── terminal/
│   ├── terminal.module.ts
│   └── terminal.service.ts
├── log-tracker/
│   ├── log-tracker.module.ts
│   ├── log-tracker.service.ts
│   └── log-tracker-scheduler.service.ts
├── uptime/
│   ├── uptime.module.ts
│   ├── uptime.service.ts
│   └── uptime-scheduler.service.ts
├── backup/
│   ├── backup.module.ts
│   └── backup.service.ts
└── websocket/
    ├── websocket.module.ts
    └── websocket.gateway.ts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | Yes | - |
| `ALLOWED_TELEGRAM_IDS` | Comma-separated list of allowed Telegram user IDs | Yes | - |
| `MONITORING_INTERVAL` | Monitoring check interval in milliseconds | No | 60000 |
| `RAM_THRESHOLD` | RAM usage percentage threshold for alerts | No | 90 |
| `LOG_PATHS` | Comma-separated list of log file paths | No | - |
| `UPTIME_URLS` | Comma-separated list of URLs to monitor | No | - |
| `DB_TYPE` | Database type (postgres, mysql, mongodb) | No | postgres |
| `DB_HOST` | Database host | No | localhost |
| `DB_PORT` | Database port | No | 5432 |
| `DB_USER` | Database user | No | - |
| `DB_PASSWORD` | Database password | No | - |
| `DB_NAME` | Database name | No | - |
| `PORT` | Application port | No | 3000 |

## 🛡️ Security Considerations

1. **Telegram ID Whitelist**: Always configure `ALLOWED_TELEGRAM_IDS` in production
2. **Environment Variables**: Never commit `.env` file to version control
3. **Database Credentials**: Store database credentials securely in environment variables
4. **Command Execution**: Be cautious with terminal commands - dangerous commands are blocked but not foolproof
5. **Backup Security**: Database backups contain sensitive data - ensure secure storage

## 🔌 WebSocket API

The WebSocket server runs on the same port as the HTTP server and is available at:

```
ws://localhost:3000/status
```

### Events

**Client → Server:**
- `requestStatus` - Request current system status

**Server → Client:**
- `systemStatus` - System status update (sent every 5 seconds)
- `alert` - Alert notifications

### Example Client Connection

```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:3000/status');

socket.on('systemStatus', (status) => {
  console.log('CPU:', status.cpu.usage);
  console.log('RAM:', status.mem.used);
  console.log('Disk:', status.disk.used);
});

socket.on('alert', (alert) => {
  console.log('Alert:', alert.message);
});
```

## 🧪 Development

```bash
# Run in development mode
npm run start:dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Build the project: `npm run build`
3. Start with: `npm run start:prod`
4. Use a process manager like PM2 for production:
```bash
pm2 start dist/main.js --name opspulse-ai
```

## 🤝 Contributing

This is a professional DevOps tool designed for production use. When contributing:

1. Maintain code quality and security standards
2. Add tests for new features
3. Update documentation
4. Follow TypeScript best practices

## 📝 License

MIT License - feel free to use this in your projects!

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Telegraf](https://telegraf.js.org/) - Telegram bot framework
- [systeminformation](https://systeminformation.io/) - System and OS information
- [Socket.io](https://socket.io/) - Real-time bidirectional event-based communication

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**⚠️ Important**: This bot has access to your server's terminal and system resources. Use it responsibly and ensure proper security measures are in place!

**🚀 Ready to monitor your servers like a pro!**