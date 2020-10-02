---
title: "Test a failing Nginx configuration"
date: 2019-04-20
draft: true
---

Do you ever feel like restarting, reloading, or breathing on Nginx is a risk? It
can be difficult to diagnose what has gone wrong when Nginx outputs nothing but 
[fail].

sudo service nginx reload
(out)* Reloading nginx configuration nginx	           [fail]

You can debug your Nginx configuration with a quick and simple command.

sudo nginx -c /etc/nginx/nginx.conf -t
(out)nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
(out)nginx: configuration file /etc/nginx/nginx.conf test is successful

Or if you just want test the default Nginx configuration you can do this
instead:

sudo nginx -t
(out)nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
(out)nginx: configuration file /etc/nginx/nginx.conf test is successful
