# 🚀 Quick Start - Deploy Netflix Clone on Your Server

## One-Command Deployment

```bash
# Clone or copy your Netflix clone files to your server
# Then run the automated deployment script:

chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment (3 Steps)

### 1. Prerequisites
```bash
# Install Docker & Docker Compose (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### 2. Deploy
```bash
# Navigate to your Netflix clone directory
cd netflix-clone

# Build and run
docker-compose up -d

# Check status
docker-compose ps
```

### 3. Access
- **Local**: http://localhost
- **Server**: http://YOUR_SERVER_IP
- **Domain**: http://your-domain.com (if configured)

## Git Workflow

### Initial Setup
```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit: Netflix clone"

# Push to GitHub/GitLab
git remote add origin https://github.com/yourusername/netflix-clone.git
git push -u origin main
```

### Deploy Updates
```bash
# Pull latest changes
git pull origin main

# Redeploy
docker-compose down
docker-compose up -d --build
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Restart services
docker-compose restart

# Update application
git pull && docker-compose up -d --build

# Clean up Docker resources
docker system prune -f
```

## Troubleshooting

### Port 80 Already in Use
```bash
# Use different port
# Edit docker-compose.yml: change "80:80" to "8080:80"
# Access via http://localhost:8080
```

### Permission Denied
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
# Logout and login again
```

### Container Won't Start
```bash
# Check logs
docker-compose logs netflix-clone

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## File Structure

```
netflix-clone/
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Multi-container setup
├── nginx.conf              # Web server configuration
├── deploy.sh               # Automated deployment script
├── DEPLOYMENT_GUIDE.md     # Comprehensive deployment guide
├── src/                    # React application source
├── public/                 # Static assets
└── dist/                   # Built application (auto-generated)
```

## Success Indicators

✅ `docker ps` shows netflix-clone-app container running  
✅ `curl http://localhost` returns HTML content  
✅ Browser loads Netflix clone homepage  
✅ Videos play and search works  

## Next Steps

1. **Domain Setup**: Point your domain to server IP
2. **SSL Certificate**: Use Let's Encrypt for HTTPS
3. **Monitoring**: Set up logging and health checks
4. **Backups**: Implement automated backup strategy

📖 **Full Documentation**: See `DEPLOYMENT_GUIDE.md` for complete instructions!