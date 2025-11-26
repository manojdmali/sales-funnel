# Installation & Setup Guide

## Prerequisites

- Python 3.8+ (for data processor)
- Node.js 14+ (for React dashboard)
- Git (optional)

## Quick Installation (5 minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

### Option 2: Manual Setup

#### For Data Processing (Python)

```bash
# Install dependencies
pip install -r requirements.txt

# Run processor
python3 excel_processor.py

# Output: sales_dashboard.json
```

#### For Dashboard (React)

```bash
# Install Node dependencies
npm install

# Start development server
npm start

# Opens on http://localhost:3000
```

#### For Production Build

```bash
# Build optimized version
npm run build

# Output: build/ directory ready for deployment
```

## Docker Setup (Advanced)

### Build Docker Image

```bash
docker build -t sales-dashboard:1.0 .
```

### Run Container

```bash
docker run -v $(pwd)/output:/app/output sales-dashboard:1.0
```

## File Structure

```
project/
├── excel_processor.py          # Data extraction script
├── SalesDashboard.jsx          # React component
├── requirements.txt            # Python dependencies
├── package.json               # Node.js dependencies
├── Dockerfile                 # Container configuration
├── setup.sh                   # Automated setup
├── data/
│   └── Sandesh_team_funnel_Report_.xlsx
├── output/
│   └── sales_dashboard.json
├── docs/
│   ├── 00_START_HERE.md
│   ├── README.md
│   ├── Analytics_Report.md
│   ├── Implementation_Guide.md
│   ├── QUICK_REFERENCE.txt
│   └── INSTALLATION.md
└── src/
    ├── components/
    │   └── SalesDashboard.jsx
    ├── App.js
    └── index.js
```

## Verification

### Check Python Installation

```bash
python3 --version
pip list | grep pandas
```

### Check Node Installation

```bash
node --version
npm --version
```

### Verify Data Processing

```bash
python3 excel_processor.py

# Expected output:
# ✓ Dashboard JSON generated successfully!
# ✓ Output file: output/sales_dashboard.json
```

### Verify Dashboard

```bash
npm start

# Expected output:
# Compiled successfully!
# You can now view sales-funnel-dashboard in the browser.
```

## Troubleshooting

### Python Dependencies Issue

```bash
# Clear cache and reinstall
pip cache purge
pip install --no-cache-dir -r requirements.txt
```

### Node Dependencies Issue

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Use different port
PORT=3001 npm start
```

### Excel File Not Found

```bash
# Ensure file exists in data/ directory
ls -la data/Sandesh_team_funnel_Report_.xlsx

# Update path in excel_processor.py if needed
```

## Deployment Options

### Option 1: Local Development

```bash
# Terminal 1: Data processor
python3 excel_processor.py

# Terminal 2: React app
npm start
```

### Option 2: Production Build

```bash
# Build for production
npm run build

# Serve with any HTTP server
npx serve -s build
```

### Option 3: Docker Container

```bash
# Build image
docker build -t sales-dashboard .

# Run container
docker run -p 3000:3000 sales-dashboard
```

### Option 4: Cloud Deployment

#### AWS Lambda
```bash
# Zip project
zip -r dashboard.zip .

# Deploy via AWS console or CLI
aws lambda create-function --function-name sales-dashboard ...
```

#### Heroku
```bash
# Deploy via Git
git push heroku main
```

#### Google Cloud
```bash
# Deploy
gcloud run deploy sales-dashboard --source .
```

## Configuration

### Update Excel File Path

Edit `excel_processor.py`:
```python
input_file = 'path/to/your/excel/file.xlsx'
```

### Change Output Directory

Edit `excel_processor.py`:
```python
output_file = 'path/to/output/sales_dashboard.json'
```

### Customize Dashboard

Edit `SalesDashboard.jsx` to modify:
- Colors and styling
- Chart types
- Table columns
- KPI metrics
- Analytics insights

## Performance Tuning

### For Large Datasets (>1000 records)

1. Enable pagination in tables
2. Implement data virtualization
3. Add memoization in React
4. Use production build

### For Slow Networks

1. Compress JSON output
2. Enable gzip compression
3. Use CDN for static assets
4. Implement lazy loading

## Security

### API Keys & Credentials

- Never commit `.env` files
- Use environment variables
- Store secrets in secure vault

### Data Protection

- Validate all inputs
- Sanitize data before display
- Use HTTPS in production
- Implement access controls

## Maintenance

### Regular Updates

```bash
# Update Python packages
pip install --upgrade -r requirements.txt

# Update Node packages
npm update
```

### Monitoring

- Set up error logging
- Monitor performance metrics
- Track user usage
- Review analytics

### Backups

```bash
# Backup data
cp data/Sandesh_team_funnel_Report_.xlsx data/backup/

# Backup configuration
cp -r config/ config_backup/
```

## Support & Help

### Check Logs

```bash
# Python logs
python3 excel_processor.py 2>&1 | tee logs/processor.log

# React app logs
npm start 2>&1 | tee logs/app.log
```

### Debug Mode

```bash
# Python debug
DEBUG=1 python3 excel_processor.py

# React debug
REACT_APP_DEBUG=true npm start
```

### Documentation

- See: `00_START_HERE.md`
- Technical: `Implementation_Guide.md`
- Analytics: `Analytics_Report.md`

## Next Steps

1. ✅ Install dependencies
2. ✅ Run setup script
3. ✅ Generate JSON data
4. ✅ Start React dashboard
5. ✅ View in browser
6. ✅ Share with team

---

**Version:** 1.0
**Last Updated:** 2025-11-25
**Status:** Production Ready
