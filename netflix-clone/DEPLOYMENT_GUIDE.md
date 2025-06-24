# 🚀 Netflix Clone - Deployment Guide

Complete guide to deploy your Netflix clone on your personal server using Docker and Git.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 10+
- **RAM**: Minimum 1GB (2GB+ recommended)
- **Storage**: 5GB free space
- **CPU**: 1 core minimum
- **Network**: Public IP or domain name

### Required Software
- Docker Engine 20.10+
- Docker Compose 2.0+
- Git 2.0+
- curl or wget

## 🛠 Step 1: Server Setup

### Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Verify Installation
```bash
docker --version
docker-compose --version
```

## 📁 Step 2: Git Repository Setup

### Option A: Clone from Your Repository
```bash
# If you have the code in a Git repository
git clone https://github.com/yourusername/netflix-clone.git
cd netflix-clone
```

### Option B: Initialize New Repository
```bash
# Create a new directory and initialize Git
mkdir netflix-clone
cd netflix-clone
git init

# Copy your Netflix clone files here
# Then add and commit
git add .
git commit -m "Initial commit: Netflix clone"

# Push to your remote repository
git remote add origin https://github.com/yourusername/netflix-clone.git
git branch -M main
git push -u origin main
```

## 🐳 Step 3: Docker Deployment

### Quick Start (Recommended)
```bash
# Navigate to your project directory
cd netflix-clone

# Build and run with Docker Compose
docker-compose up -d

# Check if running
docker-compose ps
```

### Manual Docker Build
```bash
# Build the Docker image
docker build -t netflix-clone .

# Run the container
docker run -d \
  --name netflix-clone-app \
  -p 80:80 \
  --restart unless-stopped \
  netflix-clone
```

### Verify Deployment
```bash
# Check container status
docker ps

# View logs
docker-compose logs -f netflix-clone

# Test the application
curl http://localhost
```

## 🌐 Step 4: Domain & SSL Setup (Optional)

### Configure Domain
1. Point your domain to your server's IP address
2. Update DNS A record: `your-domain.com → YOUR_SERVER_IP`

### Add SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Stop the container temporarily
docker-compose down

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Update docker-compose.yml for SSL
```

### SSL Docker Compose Configuration
```yaml
# Add to docker-compose.yml
services:
  netflix-clone:
    # ... existing configuration
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
```

## 🔧 Step 5: Production Optimizations

### Environment Variables
```bash
# Create .env file
cat > .env << EOF
NODE_ENV=production
DOMAIN=your-domain.com
HTTPS_ENABLED=true
EOF
```

### Resource Limits
```yaml
# Add to docker-compose.yml
services:
  netflix-clone:
    # ... existing configuration
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Monitoring & Logging
```bash
# View real-time logs
docker-compose logs -f

# Monitor resource usage
docker stats netflix-clone-app

# Set up log rotation
sudo cat > /etc/logrotate.d/docker << EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
```

## 🔄 Step 6: Updates & Maintenance

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup Strategy
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/netflix-clone"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/netflix-clone_$DATE.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  /path/to/netflix-clone/

# Keep only last 7 backups
find $BACKUP_DIR -name "netflix-clone_*.tar.gz" -mtime +7 -delete

echo "Backup completed: netflix-clone_$DATE.tar.gz"
EOF

chmod +x backup.sh

# Add to crontab for daily backups
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

## 🔒 Step 7: Security Hardening

### Firewall Configuration
```bash
# Ubuntu UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS Firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

### Docker Security
```bash
# Run with non-root user
echo 'USER node' >> Dockerfile

# Limit container capabilities
docker-compose.yml:
  security_opt:
    - no-new-privileges:true
  cap_drop:
    - ALL
  cap_add:
    - CHOWN
    - SETGID
    - SETUID
```

## 📊 Step 8: Monitoring & Troubleshooting

### Health Checks
```bash
# Application health
curl -f http://localhost/health || echo "Service down"

# Container health
docker inspect --format='{{.State.Health.Status}}' netflix-clone-app

# System resources
df -h
free -h
top
```

### Common Issues & Solutions

#### Port Already in Use
```bash
# Find process using port 80
sudo lsof -i :80
sudo kill -9 <PID>

# Or use different port
docker-compose down
# Edit docker-compose.yml: "8080:80"
docker-compose up -d
```

#### Permission Errors
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER /var/run/docker.sock
sudo chmod 666 /var/run/docker.sock
```

#### Out of Memory
```bash
# Clear Docker cache
docker system prune -f
docker image prune -f

# Increase swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🎯 Success Verification

Your Netflix clone is successfully deployed when:

✅ **Container is running**: `docker ps` shows netflix-clone-app  
✅ **Service responds**: `curl http://localhost` returns HTML  
✅ **Web interface loads**: Browser shows Netflix clone homepage  
✅ **Videos play**: Trailers and content load properly  
✅ **Search works**: Search functionality returns results  
✅ **Mobile responsive**: Site works on mobile devices  

## 🆘 Support & Troubleshooting

### Quick Diagnostics
```bash
# Complete system check
echo "=== Docker Status ==="
docker ps
echo "=== Container Logs ==="
docker-compose logs --tail=50 netflix-clone
echo "=== System Resources ==="
df -h / && free -h
echo "=== Network Test ==="
curl -I http://localhost
```

### Getting Help
- Check container logs: `docker-compose logs netflix-clone`
- Verify network connectivity: `curl -v http://localhost`
- Monitor system resources: `htop` or `top`
- Review nginx logs: `docker exec netflix-clone-app cat /var/log/nginx/error.log`

---

## 🎉 Congratulations!

Your Netflix clone is now running on your personal server! You can access it via:
- **Local**: http://localhost
- **Server IP**: http://YOUR_SERVER_IP
- **Domain**: http://your-domain.com (if configured)

For production use, remember to:
- Set up SSL certificates
- Configure proper backups
- Monitor resource usage
- Keep the system updated