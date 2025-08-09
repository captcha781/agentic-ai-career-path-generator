FROM python:3.12.3-alpine

WORKDIR /app

COPY pyproject.toml /app
COPY poetry.lock /app
COPY README.md /app
COPY *.env /app

RUN pip install poetry
RUN poetry install

EXPOSE 5001

COPY . /app

ENV ENVIRONMENT=LOCAL

CMD [ "poetry", "run", "server" ]
