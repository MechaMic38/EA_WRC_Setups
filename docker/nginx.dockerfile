ARG NGINX_VERSION

FROM nginx:${NGINX_VERSION}-alpine

RUN rm /etc/nginx/conf.d/default.conf

ADD ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/html
