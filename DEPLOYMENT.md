# AI Business Analytics SaaS - Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB of free RAM
- Ports 3000, 5000, and 27017 available

### 1. Clone and Configure

```bash
git clone <repository-url>
cd The-million-dollar-idea
```

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-very-secure-random-jwt-secret-here-change-this
NODE_ENV=production
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Build and Run

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Frontend on port 3000

### 4. Verify Deployment

```bash
# Check all containers are running
docker-compose ps

# Check backend health
curl http://localhost:5000/health

# Access the application
# Open http://localhost:3000 in your browser
```

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## Cloud Deployment

### AWS Deployment (Elastic Beanstalk)

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init -p docker ai-analytics-saas
```

3. **Create Environment**
```bash
eb create production-env
```

4. **Deploy**
```bash
eb deploy
```

### Heroku Deployment

1. **Create apps**
```bash
heroku create ai-analytics-backend
heroku create ai-analytics-frontend
```

2. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox -a ai-analytics-backend
```

3. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your-secret -a ai-analytics-backend
heroku config:set NODE_ENV=production -a ai-analytics-backend
```

4. **Deploy**
```bash
git subtree push --prefix backend heroku main
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Backend: `cd backend && npm run build`
   - Frontend: `cd frontend && npm run build`
3. Set environment variables in the dashboard
4. Deploy

### Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests (coming soon).

## Production Checklist

### Security
- [ ] Change default JWT_SECRET
- [ ] Use strong MongoDB credentials
- [ ] Enable SSL/TLS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular security audits

### Monitoring
- [ ] Set up application monitoring (e.g., New Relic, DataDog)
- [ ] Configure log aggregation (e.g., ELK stack)
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Database backup automation

### Performance
- [ ] Enable CDN for static assets
- [ ] Configure caching (Redis)
- [ ] Database indexing
- [ ] Load balancing
- [ ] Auto-scaling configuration

### Backup
- [ ] Automated database backups
- [ ] Backup retention policy
- [ ] Disaster recovery plan
- [ ] Regular backup testing

## Scaling

### Horizontal Scaling

1. **Database Replica Set**
```yaml
# MongoDB replica set configuration
mongodb:
  replication:
    replSetName: "rs0"
```

2. **Load Balancer**
```nginx
upstream backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

3. **Redis Cache**
```yaml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
```

### Vertical Scaling

Increase resources in docker-compose:
```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 4G
      reservations:
        cpus: '1'
        memory: 2G
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs <service-name>
docker-compose down
docker-compose up --build
```

### Database connection issues
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Test connection
docker exec -it ai-analytics-mongodb mongo
```

### Port conflicts
```bash
# Check what's using the port
lsof -i :5000
lsof -i :3000

# Stop the process or change port in docker-compose.yml
```

## Maintenance

### Update Application
```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

### Backup Database
```bash
docker exec ai-analytics-mongodb mongodump --out /backup
docker cp ai-analytics-mongodb:/backup ./backup
```

### Restore Database
```bash
docker cp ./backup ai-analytics-mongodb:/backup
docker exec ai-analytics-mongodb mongorestore /backup
```

## Support

For deployment issues:
- Check logs first: `docker-compose logs`
- Review documentation
- Contact support team

---

**Happy Deploying! 🚀**
