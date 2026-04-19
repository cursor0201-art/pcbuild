FROM python:3.11-slim

WORKDIR /app

# копируем requirements именно из backend
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# копируем сам backend
COPY backend/ .

CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn GameZoneBuild.wsgi:application --bind 0.0.0.0:8000"]
