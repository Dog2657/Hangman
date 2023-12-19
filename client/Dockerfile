FROM node:14-alpine AS build
WORKDIR /app
RUN echo ls
COPY /client/package*.json .
RUN npm install
COPY /client/ .
RUN npm run build

#FROM python:3.10
#COPY --from=build /app/dist app/src/client
#RUN apt-get -y update
#COPY requirements.txt .
#RUN pip install -r ./requirements.txt
#EXPOSE 8080
#ADD . .
#WORKDIR .
#CMD ["uvicorn", "app.src.server:app", "--host", "0.0.0.0", "--port","8080"]