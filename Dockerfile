FROM python:3.11

WORKDIR /app

COPY ./requarments.txt .

RUN pip install --no-cache-dir -r ./requarments.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
