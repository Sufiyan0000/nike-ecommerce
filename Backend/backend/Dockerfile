FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install

COPY . .

CMD [ "python","manage.py","runserver" ]