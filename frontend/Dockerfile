FROM node:20-alpine AS build

WORKDIR /app
RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build --configuration=production

FROM nginx:alpine AS runtime
EXPOSE 80
COPY --from=build /app/dist/dashboard-realtime /usr/share/nginx/html