FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Force cache invalidation
RUN echo "Cache invalidated at $(date)" && rm -rf /var/cache/apt/* /root/.cache/pip/* 2>/dev/null || true

COPY backend/ .

CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn GameZoneBuild.wsgi:application --bind 0.0.0.0:8000"]
