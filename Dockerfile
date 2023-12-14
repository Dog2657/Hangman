FROM node:hydrogen-alpine3.19 AS build
WORKDIR /client
COPY /client/package.json /client
COPY /client/package-lock.json /client
RUN npm install
COPY /client/ /client
RUN npm run build
#CMD top

FROM python:3.10
RUN apt-get -y update
COPY requirements.txt .
RUN pip install -r ./requirements.txt
COPY /server /server
COPY --from=build /client/dist /server/client
EXPOSE 8080
CMD ["uvicorn", "app.src.server:app", "--host", "0.0.0.0", "--port","8080"]