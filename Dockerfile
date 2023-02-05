FROM node as builder

ADD . /app
RUN cd /app && npm config set registry https://registry.npm.taobao.org && npm install && npm run build

FROM nginx

COPY --from=builder /app/dist /app/dist

ADD src/nginx-nav.conf /etc/nginx/conf.d/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
