# Heroku Deployment Guide

This guide will help you deploy the AI Maturity Mapping application to Heroku.

## Prerequisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. Git repository with your code
3. Heroku account

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a Heroku App
```bash
heroku create your-app-name
# Replace 'your-app-name' with your desired app name
```

### 3. Configure Environment Variables
```bash
# Set MongoDB connection string (required)
heroku config:set MONGODB_URI="your-mongodb-connection-string"

# Set Node environment to production
heroku config:set NODE_ENV=production

# Optional: Set custom port (Heroku sets this automatically)
# heroku config:set PORT=5000
```

### 4. Deploy to Heroku
```bash
# Ensure you're in the project root directory
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 5. Open Your App
```bash
heroku open
```

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Set to 'production' for production builds | Yes |
| `PORT` | Port for the application (auto-set by Heroku) | No |

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Set it as `MONGODB_URI` in Heroku

Example connection string:
```
mongodb+srv://username:password@cluster0.mongodb.net/ai-maturity-db?retryWrites=true&w=majority
```

### Option 2: Heroku MongoDB Add-ons
```bash
# Add MongoDB Atlas add-on (has free tier)
heroku addons:create mongolab:sandbox

# Or add mLab MongoDB add-on
heroku addons:create heroku-mongodb:sandbox
```

## Build Process

The app is configured with:
- `Procfile`: Tells Heroku how to start the app
- `heroku-postbuild`: Automatically builds the React frontend
- Production serving: Backend serves React build files

## Troubleshooting

### Check Logs
```bash
heroku logs --tail
```

### Common Issues

1. **Build Failures**: 
   - Check Node.js version in `engines` field of package.json
   - Ensure all dependencies are in `dependencies`, not `devDependencies`

2. **MongoDB Connection Issues**:
   - Verify `MONGODB_URI` is set correctly
   - Check if your MongoDB allows connections from Heroku IPs

3. **Frontend Not Loading**:
   - Ensure `homepage: "."` is set in frontend/package.json
   - Check that build files are being served correctly

### Environment Variables Check
```bash
heroku config
```

### Restart App
```bash
heroku restart
```

## Local Testing with Production Build

Test your production build locally:

```bash
# Build the frontend
npm run build

# Set environment variables
export NODE_ENV=production
export MONGODB_URI="your-local-or-remote-mongodb-url"

# Start the app
npm start
```

## Scaling

Scale your app dynos:
```bash
# Scale to 1 web dyno (free tier)
heroku ps:scale web=1

# Scale to multiple dynos (paid tiers)
heroku ps:scale web=2
```

## Custom Domain (Optional)

Add a custom domain:
```bash
heroku domains:add yourdomain.com
```

## Continuous Deployment

Set up automatic deployments from GitHub:
1. Go to your Heroku app dashboard
2. Connect to GitHub repository
3. Enable automatic deploys from main branch

## Cost Optimization

- **Free Tier**: Use hobby dynos and free MongoDB Atlas tier
- **Paid Tier**: Scale based on usage and performance needs
- **Sleep Mode**: Free dynos sleep after 30 minutes of inactivity

## Security Notes

- Never commit `.env` files with sensitive data
- Use Heroku config vars for all environment variables
- Enable SSL/HTTPS (automatic with Heroku)
- Keep dependencies updated

## Monitoring

- Use Heroku metrics dashboard
- Set up log drains for advanced monitoring
- Monitor MongoDB usage and performance 