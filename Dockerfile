FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .

# Force complete cache invalidation
RUN --mount=type=cache,target=/root/.cache/pip,source=cache --mount=type=cache,target=/var/cache/apt,source=cache \
    echo "Cache invalidated at $(date)" && \
    rm -rf /root/.cache/pip/* /var/cache/apt/* 2>/dev/null || true && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn GameZoneBuild.wsgi:application --bind 0.0.0.0:8000"]
