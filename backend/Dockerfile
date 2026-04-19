FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["sh", "-c", "python manage.py migrate && python create_admin.py && python manage_sample_data.py && python manage.py collectstatic --noinput && gunicorn GameZoneBuild.wsgi:application --bind 0.0.0.0:8000"]