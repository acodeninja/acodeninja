---
title: "limit http requests with nginx"
date: 2019-04-21
draft: false
keywords:
    - nginx
    - request rate limits
aliases:
    - /limit-api-requests-with-nginx/
---

There are several ways that you can throttle the rate at which requests to your
web application are processed.

Rate limiting within your authentication mechanism is undoubtedly useful.
However, the chances are that this requires several calls to database and cache.
Database queries could become a costly operation when your application is
running under load.

To provide an extra layer of filtering, Nginx is capable of limiting request
rates using the `ngx_http_limit_req_module` module. 

## creating a memory zone
To limit requests, we first need to create a space in memory to store a running
log of requests. We need to decide which key on a request is used as a reference
in the memory zone. The obvious first contender is the remote IP address of the
requesting client.

```shell script
# /etc/nginx/conf.d/rate-limit-zones.conf
limit_req_zone $binary_remote_addr zone=ipaddr:10m rate=1r/s;
```

To declare a memory zone, we use the `limit_req_zone` directive. We tell Nginx
what we want to use as a key, in this case `$binary_remote_addr`, the remote IP
address of the requesting client. The zone is defined with the name `ipaddr`
and 10 Megabytes of memory assigned to the zone. Rate of requests is then
defined against the zone at 1 request per second.

## alternative zone keys
While the above example uses the IP address, there are a number of other keys we
can use.

 * `$server_name` is the domain name of the request, this would limit the number
   of requests per second a domain can serve to any client.
 * `$uri` is the URI being requested from the server. This would limit the number
   of client requests to a given URI, independent of domain name.

It is also worth noting that since Nginx version 1.7.6 you can use variables in
any combination.

 * "`$binary_remote_addr$uri`" limit requests by remote IP address and URI being
   accessed.
 * "`$server_name$uri`" limit requests by domain name and URI being accessed.

Configuring a limit against a server
A limit can be applied inside a server  block. The most straight forward way is
to apply a limit to a whole virtual server.

```shell script
# /etc/nginx/sites-enabled/default
server {
    limit_req zone=ipaddr burst=5 nodelay;
    ...
}
```

The limit is applied with the limit_req  directive which specifies which memory
zone to use for request limits. It also accepts optional burst  and delay 
settings.

The burst  parameter defaults to zero. It allows us to specify the number of
requests over the limit that should be delayed rather than receiving an error.
Delayed requests are processed at the rate configured in the limit_req_zone 
directive.

The delay  parameter can either give a limit of requests that should not be
delayed, or nodelay  to indicate that no requests should be delayed.

## advanced configuration
You could get a bit more fancy and only rate limit your API endpoints.

```shell script
# /etc/nginx/sites-enabled/default
server {
    ...
    location /api/ {
        limit_req zone=ipaddr burst=5;
    }
    ...
}
```

Or you can get even more fancy and not limit requests made to your API by local
services.

```shell script
# /etc/nginx/sites-enabled/default
geo $is_external_call {
    default         1;
    10.0.0.0/8      0;
    172.16.0.0/12   0;
    192.168.0.0/16  0;
    fd00::/8        0;
}

server {
    ...
    location /api/ {
        if ($is_external_call) {
            limit_req zone=ipaddr burst=5;
        }
        ...
    }
    ...
}
```
