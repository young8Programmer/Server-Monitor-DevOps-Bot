# 🚀 OpsPulse AI - Installation Guide

## 📋 Talablar

- Node.js 18+ va npm/yarn
- Telegram Bot Token ([@BotFather](https://t.me/BotFather) dan olish)
- Linux/Unix based server (Windows uchun WSL)
- Database backup uchun: pg_dump, mysqldump, yoki mongodump

## 🔧 O'rnatish Qadamlari

### 1. Loyihani klonlash yoki yuklab olish

```bash
cd /path/to/your/project
```

### 2. Dependencies o'rnatish

```bash
npm install
```

### 3. Environment Variables sozlash

`.env` faylini yarating:

```bash
cp env.example .env
```

`.env` faylini tahrirlang va quyidagilarni to'ldiring:

```env
# Telegram Bot Token
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Telegram User ID (bir nechta bo'lsa vergul bilan ajratiladi)
ALLOWED_TELEGRAM_IDS=123456789,987654321

# Monitoring sozlamalari
MONITORING_INTERVAL=60000
RAM_THRESHOLD=90

# Log fayllari (vergil bilan ajratilgan)
LOG_PATHS=/var/log/app/error.log,/var/log/nginx/error.log

# Uptime URL lar (vergil bilan ajratilgan)
UPTIME_URLS=https://example.com,https://api.example.com/health

# Database sozlamalari
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database
```

### 4. Telegram Bot Token olish

1. Telegram'da [@BotFather](https://t.me/BotFather) ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomi va username ni kiriting
4. Berilgan token'ni `.env` fayliga qo'shing

### 5. Telegram User ID olish

1. Telegram'da [@userinfobot](https://t.me/userinfobot) ga yozing
2. U sizga User ID'ni yuboradi
3. Bu ID'ni `.env` faylida `ALLOWED_TELEGRAM_IDS` ga qo'shing

### 6. Build qilish

```bash
npm run build
```

### 7. Ishga tushirish

#### Development:

```bash
npm run start:dev
```

#### Production (PM2 bilan):

```bash
# PM2 o'rnatish (agar yo'q bo'lsa)
npm install -g pm2

# Ishga tushirish
pm2 start dist/main.js --name opspulse-ai

# PM2 bilan boshqarish
pm2 list          # Barcha protsesslarni ko'rish
pm2 logs opspulse-ai  # Loglarni ko'rish
pm2 restart opspulse-ai  # Qayta ishga tushirish
pm2 stop opspulse-ai  # To'xtatish
```

#### Production (Systemd bilan):

`/etc/systemd/system/opspulse-ai.service` faylini yarating:

```ini
[Unit]
Description=OpsPulse AI Server Monitoring Bot
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/opspulse-ai
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Keyin:

```bash
sudo systemctl daemon-reload
sudo systemctl enable opspulse-ai
sudo systemctl start opspulse-ai
sudo systemctl status opspulse-ai
```

## ✅ Tekshirish

1. Bot'ni Telegram'da toping va `/start` yuboring
2. Agar xabar kelsa, bot ishlayapti
3. `/status` buyrug'ini yuborib server holatini tekshiring

## 🔍 Troubleshooting

### Bot javob bermayapti

- `.env` faylida `TELEGRAM_BOT_TOKEN` to'g'ri ekanligini tekshiring
- `ALLOWED_TELEGRAM_IDS` da User ID'ingiz borligini tekshiring
- Bot loglarini ko'ring: `pm2 logs opspulse-ai`

### Database backup ishlamayapti

- Database credentials'lar to'g'ri ekanligini tekshiring
- `pg_dump`, `mysqldump`, yoki `mongodump` o'rnatilganligini tekshiring
- PATH'da database tools borligini tekshiring

### Log tracking ishlamayapti

- Log fayllari yo'lini tekshiring
- Fayl o'qish ruxsatlari borligini tekshiring: `chmod +r /path/to/log/file`

### Uptime checker ishlamayapti

- URL'lar to'g'ri ekanligini tekshiring
- Internet aloqasi borligini tekshiring

## 📚 Qo'shimcha Ma'lumot

Batafsil ma'lumot uchun [README.md](README.md) faylini ko'ring.

---

**Muvaffaqiyatli o'rnatish! 🎉**