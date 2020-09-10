FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /var/www/html
ADD . / /var/www/html/
