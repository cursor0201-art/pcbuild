FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt

RUN echo "force rebuild v2" && pip install --no-cache-dir -r requirements.txt --upgrade

COPY backend/ .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
