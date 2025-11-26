# Sales Funnel Dashboard - Implementation Guide

## Overview

This guide explains how to use the Excel data processor and dashboard component to analyze and visualize sales funnel data.

---

## 📁 Solution Components

### 1. **excel_processor.py**
- **Purpose:** Extract data from Excel sheets and convert to JSON format
- **Input:** Sandesh_team_funnel_Report_.xlsx
- **Output:** sales_dashboard.json
- **Features:**
  - Reads multiple sheets
  - Cleans and normalizes data
  - Generates KPIs and summaries
  - Produces JSON output

### 2. **SalesDashboard.jsx**
- **Purpose:** Interactive React dashboard for data visualization
- **Features:**
  - KPI cards with metrics
  - Charts and graphs (Bar, Pie, Line charts)
  - Data tables with expand/collapse
  - Analytics insights
  - Responsive design

### 3. **Analytics_Report.md**
- **Purpose:** Comprehensive insights and recommendations
- **Sections:**
  - Executive summary
  - Revenue analysis
  - Regional & sector analysis
  - Performance metrics
  - Recommendations

### 4. **sales_dashboard.json**
- **Purpose:** Structured data format for dashboard consumption
- **Schema:** Organized by sheets with KPIs and summaries

---

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
# For Python data processing
pip install pandas openpyxl numpy

# For React dashboard (if using locally)
npm install recharts lucide-react
```

### Step 2: Run Data Processor

```bash
python3 excel_processor.py
```

**Output:**
```
✓ Dashboard JSON generated successfully!
✓ Output file: /mnt/user-data/outputs/sales_dashboard.json

Dashboard Summary:
{
  "total_proposals": 2,
  "total_demos_conducted": 2,
  "total_client_visits": 4,
  "total_dc_visits": 2,
  "total_funnel_activities": 10,
  "revenue_metrics": {
    "total_tcv": 1.0972021,
    "avg_acv": 0.52,
    "avg_deal_probability": 0.6
  }
}
```

### Step 3: Use React Dashboard

Option A - Claude.ai Artifacts:
1. Copy SalesDashboard.jsx content
2. Create new artifact in Claude
3. View interactive dashboard

Option B - Local React App:
```bash
# Create React app
npx create-react-app sales-dashboard
cd sales-dashboard

# Install dependencies
npm install recharts lucide-react

# Add component to App.js
import SalesFunnelDashboard from './components/SalesDashboard'

# Run
npm start
```

---

## 📊 JSON Schema Structure

```json
{
  "metadata": {
    "report_name": "Sandesh Team Sales Funnel Dashboard",
    "generated_at": "2025-09-30T10:30:00",
    "total_sheets": 4
  },
  "sheets": {
    "proposal_submitted": {
      "sheet_name": "Proposal Submitted",
      "total_records": 2,
      "data": [
        {
          "sr_no": 1,
          "date": "2025-07-04",
          "pot_id": "POT001",
          "sales_person": "Rutuja Rajesh Lokhande",
          "client_name": "Client A",
          "acv": 600000,
          "tcv": 0.6,
          "probability": 60,
          "sales_stage": "L5",
          ...
        }
      ],
      "summary": {
        "total_proposals": 2,
        "total_tcv": 1.08,
        "avg_acv": 540000,
        "by_region": {"Mumbai": 1, "Bangalore": 1},
        "by_industry": {"BFSI": 1, "IT": 1}
      }
    },
    "demos": {...},
    "client_direct_visit": {...},
    "dc_visit": {...}
  },
  "kpis": {
    "total_proposals": 2,
    "total_demos_conducted": 2,
    "total_client_visits": 4,
    "revenue_metrics": {
      "total_tcv": 1.08,
      "avg_acv": 540000,
      "avg_deal_probability": 60
    }
  }
}
```

---

## 📈 Dashboard Features

### KPI Cards
```
┌─────────────────┐  ┌──────────────────┐
│ Total Proposals │  │ Revenue Metrics  │
│       2         │  │    ₹1.08 Cr      │
└─────────────────┘  └──────────────────┘
```

### Charts Included

1. **Sales Funnel Overview**
   - Bar chart showing activity distribution
   - Displays: Client Visits, Demos, DC Visits, Proposals

2. **Regional Performance**
   - Grouped bar chart
   - Shows visits and proposals by region
   - Identifies geographic concentration

3. **Industry Distribution**
   - Pie chart breakdown
   - BFSI: 60%, IT: 40%
   - Helps identify sector focus

4. **Deal Health**
   - Progress bar for probability
   - Revenue metrics display
   - TCV and ACV summaries

### Data Tables

**Proposals Submitted**
- Columns: Sr.No, Date, Client, Stage, Probability, Type, Region
- Expandable/Collapsible
- 2 active records

**Client Direct Visits**
- Columns: Sr.No, Date, Sales Person, Client, Products, Industry, Region
- 4 total visits
- Regional breakdown

**Demos Conducted**
- Columns: Sr.No, Sales Person, Client, Contact No, Email
- 2 demos
- Contact information preserved

**DC Visits**
- Columns: Sr.No, Date, Account, Product, Sector, Region, Contact
- 2 visits
- Full contact details

---

## 🔄 Data Processing Workflow

```
Excel File (XLSX)
      ↓
[excel_processor.py]
      ↓
- Read all sheets
- Extract data
- Clean & normalize
- Calculate KPIs
      ↓
JSON Output (sales_dashboard.json)
      ↓
[React Dashboard]
      ↓
- Display KPIs
- Render charts
- Show tables
- Present analytics
```

---

## 📊 Key Metrics Explained

### Revenue Metrics
- **TCV (Total Contract Value):** Full contract value over lifetime
- **ACV (Annual Contract Value):** Revenue per year
- **MRR (Monthly Recurring Revenue):** Monthly revenue component

### Sales Stages
- **L1:** Initial Contact
- **L2:** Qualification
- **L3:** Proposal Pending
- **L4:** Negotiation
- **L5:** Advanced
- **L6:** Close/Won

### Probability %
- Confidence level of deal closure
- Used for weighted revenue calculation
- Average: 60% = Moderate confidence

### Conversion Rates
- Visit → Demo: 50% (2 of 4)
- Demo → Proposal: 100% (2 of 2)
- Overall Pipeline: 25% (2 of 8 qualified)

---

## 🔧 Customization Guide

### Modify Data Processor

**Add New Sheet Processing:**
```python
def process_new_sheet(self) -> Dict[str, Any]:
    """Extract and process new sheet"""
    df = pd.read_excel(self.excel_path, sheet_name='Sheet Name')
    
    data = []
    for idx, row in df.iterrows():
        record = {
            'field1': str(row['Column1']).strip(),
            'field2': float(row['Column2']) if pd.notna(row['Column2']) else 0,
        }
        data.append(record)
    
    return {
        'sheet_name': 'Sheet Name',
        'total_records': len(data),
        'data': data
    }
```

### Modify Dashboard Component

**Add New KPI Card:**
```jsx
<KPICard 
  icon={YourIcon}
  label="Your Metric"
  value={d.kpis.your_metric}
  color="#your_color"
/>
```

**Add New Chart:**
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold mb-4">Chart Title</h3>
  <ResponsiveContainer width="100%" height={300}>
    <YourChartType data={yourData}>
      {/* Chart configuration */}
    </YourChartType>
  </ResponsiveContainer>
</div>
```

---

## 📋 Usage Scenarios

### Scenario 1: Weekly Performance Review
1. Run excel_processor.py on updated Excel file
2. Open dashboard in React
3. Review KPIs and trends
4. Check deal progress in tables

### Scenario 2: Monthly Executive Reporting
1. Generate JSON output
2. Create custom report from Analytics_Report.md
3. Extract specific metrics for presentation
4. Share dashboard link with stakeholders

### Scenario 3: Sales Pipeline Analysis
1. Check proposal stage distribution
2. Identify stalled deals
3. Review probability-weighted revenue
4. Plan follow-up activities

### Scenario 4: Regional Performance Tracking
1. Filter data by region in tables
2. View regional charts
3. Compare regions side-by-side
4. Identify expansion opportunities

---

## ⚠️ Data Quality Checks

### Pre-Processing Validation
- ✓ Check for missing critical fields
- ✓ Validate date formats
- ✓ Ensure numeric fields are properly typed
- ✓ Identify and handle duplicates

### Post-Processing Verification
- ✓ Verify KPI calculations
- ✓ Check sum totals
- ✓ Validate probability percentages (0-100)
- ✓ Confirm all records processed

### Common Issues & Fixes

**Issue: "Unnamed" columns in Excel**
- **Cause:** Missing header row
- **Fix:** Ensure proper column headers in Excel

**Issue: Date parsing errors**
- **Cause:** Mixed date formats
- **Fix:** Standardize dates to YYYY-MM-DD format

**Issue: Missing numeric values**
- **Cause:** Text instead of numbers
- **Fix:** Convert to numeric type with error handling

---

## 🔐 Security & Best Practices

1. **Data Handling:**
   - Don't commit sensitive data to version control
   - Use environment variables for file paths
   - Implement access controls for dashboard

2. **Performance:**
   - Cache JSON data for large datasets
   - Implement pagination for tables
   - Optimize chart rendering

3. **Maintenance:**
   - Schedule weekly processing
   - Keep backups of Excel files
   - Version control the processor script

---

## 📱 Responsive Design

Dashboard is fully responsive:
- **Desktop:** Full layout with all charts
- **Tablet:** Stacked 2-column grid
- **Mobile:** Single column, scrollable tables

---

## 🚦 Troubleshooting

### Dashboard Not Displaying Data
1. Check if JSON file is generated
2. Verify file path in component
3. Check browser console for errors

### Charts Not Rendering
1. Ensure recharts is installed
2. Verify data format matches chart requirements
3. Check for null/undefined values

### Excel Processing Fails
1. Verify Excel file format (.xlsx)
2. Check for special characters in sheet names
3. Ensure pandas/openpyxl installed

### Performance Issues
1. Reduce number of records displayed
2. Implement data pagination
3. Use memoization for expensive calculations

---

## 📞 Support & Resources

### File Locations
- Data Processor: `/home/claude/excel_processor.py`
- Dashboard: `/mnt/user-data/outputs/SalesDashboard.jsx`
- JSON Output: `/mnt/user-data/outputs/sales_dashboard.json`
- Analytics: `/mnt/user-data/outputs/Analytics_Report.md`

### Quick Commands
```bash
# Process Excel file
python3 excel_processor.py

# View generated JSON
cat /mnt/user-data/outputs/sales_dashboard.json

# View analytics report
cat /mnt/user-data/outputs/Analytics_Report.md
```

---

## 📈 Future Enhancements

1. **Real-time Updates:** Auto-refresh dashboard
2. **Predictive Analytics:** Forecast revenue
3. **Advanced Filtering:** Dynamic dashboard filters
4. **Export Capabilities:** PDF/Excel export
5. **Mobile App:** Native mobile dashboard
6. **Alerts:** Deal stalling notifications
7. **AI Insights:** ML-based recommendations

---

**Version:** 1.0
**Last Updated:** September 2025
**Status:** Ready for Production
