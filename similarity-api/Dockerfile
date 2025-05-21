FROM python:3.11-slim

WORKDIR /app

# Evita problemes de locale
ENV PYTHONUNBUFFERED=1 \
    LANG=C.UTF-8

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5000

CMD ["python", "app.py"]
