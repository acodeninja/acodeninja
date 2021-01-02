---
title: "nginx ssl only configuration"
date: 2013-01-08
draft: false
aliases:
    - /nginx-ssl-only-configuration/
---

Configuring Nginx with SSL can be a bit of a nightmare to do properly.
Here is a handy config file I use as a starting base for it.

```nginx
#HTTP Redirect
server {
    # Set up the port listener
    listen 80; 
    listen [IPV6]:80 default ipv6only=on;
    
    # Set the hostname to be served
    server_name SITE www.SITE;

    # Set up access and error logs
    accesslog /var/www/SITE/logs/nginx.access.log;
    errorlog /var/www/SITE/logs/nginx.error.log;

    # Redirect all requests on http to https
    location / {
        rewrite ^ https://$servername$requesturi? permanent;
    }
}

HTTPS
server {

    # Set up the port listener
    listen 443;
    listen [IPv6]:443 default ipv6only=on;

    # Set the hostname to be served
    server_name SITE www.SITE;

    # Set up SSL
    ssl on;
    sslcertificate /var/www/SITE/certs/ssl.crt;
    sslcertificatekey /var/www/SITE/certs/ssl.key;
    sslsessiontimeout 5m;
    sslpreferserverciphers on;
    
    # Set up access and error logs
    accesslog /var/www/SITE/logs/nginx.access.log;
    errorlog /var/www/SITE/logs/nginx.error.log;
    
    # Set up the root of public html folders 
    root /var/www/SITE/www; 
    index index.php index.htm index.html;

    # Set up the php system 
    location ~ .php$ {
        fastcgipass 127.0.0.1:9000; 
        fastcgiindex index.php; 
        fastcgiparam SCRIPTFILENAME /var/www/SITE/www$fastcgiscriptname; 
        include fastcgi_params;
    }
} 
```

Looking through the config file you can see a number of parts, the two most
important parts are as follows:

 * rewrite ^ https://$server_name$request_uri? permanent;  This allows any
   requests made to the http service to be redirected to the https
 * ssl on;  This tells the server to use SSL on port 443 to server https
   encrypted pages.

I hope that this short article helps get you up and running with SSL on Nginx.
