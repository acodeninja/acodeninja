---
title: "get a stream of tweets"
date: 2013-05-21
draft: false
aliases:
    - /get-a-stream-of-tweets/
---

The first part of the course I have been taking on data science deals with
analysis of Twitter data. This is aimed at discerning the overall sentiment of a
Tweet or collection of tweets.

To get this going the first thing you need is a big collection of tweets in a
format that is easy for a program to digest. Step in JSON, a text based output
that represents data in a collection of arrays. Once you have this data set you
can then start experimenting. Maybe try something simple first, like taking ten
minutes worth of samples every hour and mapping the twitter activity for an
average of how many tweets per country for that hour.

Twitter Stream
From "Introduction to Data Science" A coursera program with lectures from 
Bill Howe. You will need to edit the access and consumer credentials to make this
application work.

Run as follows: `python twitterstream.py > output.json`

```python
import oauth2 as oauth import urllib2 as urllib

accesstokenkey = "<Enter your access token key here>" 
accesstokensecret = "<Enter your access token secret here>"

consumerkey = "<Enter consumer key>" 
consumersecret = "<Enter consumer secret>"

_debug = 0

oauthtoken = oauth.Token(key=accesstokenkey, secret=accesstokensecret) 
oauthconsumer = oauth.Consumer(key=consumerkey, secret=consumersecret)

signaturemethodhmacsha1 = oauth.SignatureMethodHMAC_SHA1()

http_method = "GET"

httphandler = urllib.HTTPHandler(debuglevel=debug) 
httpshandler = urllib.HTTPSHandler(debuglevel=debug)

'''Construct, sign, and open a twitter request 
   using the hard-coded credentials above.''' 

def twitterreq(url, method, parameters): 
    req = oauth.Request.fromconsumerandtoken(oauthconsumer,
                                             token=oauthtoken,
                                             httpmethod=httpmethod, 
                                             httpurl=url, 
                                             parameters=parameters)

    req.signrequest(signaturemethodhmacsha1, oauthconsumer, oauthtoken)

    headers = req.to_header()

    if httpmethod == "POST":
        encodedpostdata = req.topostdata()
    else:
        encodedpostdata = None

    url = req.to_url()

    opener = urllib.OpenerDirector()
    opener.addhandler(httphandler) 
    opener.addhandler(httpshandler)

    response = opener.open(url, encodedpostdata)

    return response

def fetchsamples(): 
    url = "https://stream.twitter.com/1/statuses/sample.json"
    parameters = []
    response = twitterreq(url, "GET", parameters)
    
    for line in response:
        print line.strip()

if name  == 'main':
    fetchsamples()
```
