FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose FastAPI default port
EXPOSE 5001


# Run FastAPI app with gunicorn
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:5001"]