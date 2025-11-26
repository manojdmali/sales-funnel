FROM python:3.10-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY excel_processor.py .
COPY Sandesh_team_funnel_Report_.xlsx ./data/

# Create output directory
RUN mkdir -p output

# Run the processor
CMD ["python3", "excel_processor.py"]
