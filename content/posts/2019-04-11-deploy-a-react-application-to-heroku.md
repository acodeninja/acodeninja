---
title: "Deploy a react application to Heroku"
date: 2019-04-11
draft: true
---

This article serves as a quick run through of how to go from create-react-app to
effective deployment of your application on Heroku [https://heroku.com].

create-react-app
In your terminal, go to whichever directory you generally put your projects.
Ensure you are running a recent version of nodejs (I tend to use NVM
[https://github.com/creationix/nvm#installation-and-update]  for managing nodejs
versions). Run npx create-react-app some-app-name to create the application.

This process sets up a package.json file and installs the required scripts. It
also creates the following directory structure.



$ tree -I node_modules 
.
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock

2 directories, 13 files



Now you have your app set up, let’s talk about what steps we need to take to
deploy this project.

GitHub commit
[https://github.com/lets-learn-how-to/deploy-a-react-app-to-heroku/commit/6ec02c1fc9a759c30b366ce182c7431e74394088]

yarn build
To compile our application from source to something that a web browser can
understand, we use yarn build. If you run that now, you’ll end up with some new
files in the project directory.


└── build
    ├── asset-manifest.json
    ├── favicon.ico
    ├── index.html
    ├── manifest.json
    ├── precache-manifest.917992c3fffaac511db892e8bc738acd.js
    ├── service-worker.js
    └── static
        ├── css
        │   ├── main.c152cfe6.chunk.css
        │   └── main.c152cfe6.chunk.css.map
        ├── js
        │   ├── 2.4b44abd2.chunk.js
        │   ├── 2.4b44abd2.chunk.js.map
        │   ├── main.c366419b.chunk.js
        │   ├── main.c366419b.chunk.js.map
        │   ├── runtime~main.c5541365.js
        │   └── runtime~main.c5541365.js.map
        └── media
            └── logo.5d5d9eef.svg


Now we can use a web server to serve the files under the build directory. To do
that we need to create a small server, that is the application Heroku serves.

static express server
Now we know where our built frontend application resides, let’s put together a
small nodejs application to serve the frontend. We’re going to use expressjs
[https://expressjs.com/]  to accomplish this, so let’s add it to the project
dependencies.


yarn add express


Now we have access to express we can create our application. Below is the
server.js file we use to serve the frontend



# pull in the expressjs library
const express = require('express');

# create the application server
const app = express();

# use expressjs static to serve files from a directory
app.use(express.static('build'));

# make the application listen on the port given by Heroku
app.listen(
    process.env.PORT,
    () => console.log(`listening on port ${process.env.PORT}`)
);


GitHub commit
[https://github.com/lets-learn-how-to/deploy-a-react-app-to-heroku/commit/45db1cecd532bba49f04e9b903e83a94ade8dca0]

deploying to Heroku
Now we have our application, let’s get it deployed to Heroku. If you’ve not
signed up yet, you can do that here [http://signup.heroku.com]  for free. Heroku
allows us to deploy directly from GitHub, so let’s get that setup.

From the Heroku dashboard, click on new, and select App. You then name your
application and select a region.

Clicking “Create app” creates the application, now accessible at 
https://deploy-a-react-app-to-heroku.herokuapp.com/  and we need to set up
deployment for the application.

On the “Deploy” tab, select GitHub as the deployment method. Then select the
user or organisation, and repository you want to deploy.

Click “Connect”, and you have the repository linked from GitHub to Heroku. Next,
we need to configure automatic deployments whenever we push new code to our
repository.

We’re not going to bother waiting on CI to pass before deploying as I’ve covered
that in another
[https://medium.com/lets-learn-how-to/continuous-everything-part-1-testing-bbaab938e41a] 
 article
[https://medium.com/lets-learn-how-to/continuous-everything-part-2-coverage-27e734893add]
. All we need to do now is deploy our application.

Ship it!
Below the automatic deploys section of the app configuration, we find the manual
deploy section. Give the “Deploy Branch” button a click now, and let’s see what
happens.

Now the application is shipped we can open it 
https://deploy-a-react-app-to-heroku.herokuapp.com/  and see the basic page
created by create-react-app . Let’s stop and take a look at what Heroku did for
us.

What just happened?
Below is a cut down version of the build log that Heroku gives us.

-----> Node.js app detected
       
-----> Creating runtime environment
       
-----> Installing binaries
       engines.node (package.json):  unspecified
       engines.npm (package.json):   unspecified (use default)
       engines.yarn (package.json):  unspecified (use default)
       
-----> Installing dependencies
       Installing node modules (yarn.lock)
       yarn install v1.15.2
       
-----> Build
       Running build (yarn)
       yarn run v1.15.2
       $ react-scripts build
       
-----> Caching build
       - node_modules
       
-----> Pruning devDependencies
       
-----> Build succeeded!

-----> Discovering process types
       Procfile declares types     -> (none)
       Default types for buildpack -> web

-----> Compressing...
       Done: 46.4M

-----> Launching...
       Released v3
       https://deploy-a-react-app-to-heroku.herokuapp.com/ deployed to Heroku

This build log shows that Heroku picks up that we have a nodejs application
(likely because we have a package.json file present). It creates a runtime
environment, being an environment in which node, npm, and yarn are set up.

Heroku’s buildpack then installs the application’s dependencies using yarn. The
buildpack then runs our build script, which produces the build directory from
which we serve the frontend application.

Always check the logs
Now it’s deployed let’s take a look at the application logs in Heroku to see how
our application is running. With Heroku CLI tools
[https://devcenter.heroku.com/articles/heroku-cli]  installed you need to run
the command heroku logs --app deploy-a-react-app-to-heroku to see the logs. If
you want to see the logs stream, you can add the -t option to show the logs as
they update, rather than dump out what currently exists.

 Starting process with command `npm start`
 > deploy-a-react-app-to-heroku@0.1.0 start /app
 > react-scripts start

Starting the development server...

Compiled successfully!

You can now view deploy-a-react-app-to-heroku in the browser.

Local:            http://localhost:20887/
 On Your Network:  http://172.18.220.66:20887/

Note that the development build is not optimized.
 To create a production build, use yarn build.

I’ve removed the timestamps to make the logs more legible, but we can see a
problem straight away. We don’t want to use the development server provided by
create-react-app, but our server.js application.

Enter Heroku’s Procfile [https://devcenter.heroku.com/articles/procfile], which
allows us to tell Heroku how to run our application. The format is
straightforward:

<process type>: <command>

We are running the server.js file using a web dyno.

web: node server.js

Let’s commit
[https://github.com/lets-learn-how-to/deploy-a-react-app-to-heroku/commit/c73d4f1fe5e63fabc9422b0e0f9176e79265ec2d] 
 this file, push to our repo, and take a look at the logs.

 Starting process with command `node server.js`
 listening on port 34916

Good, Heroku is now using our server.js file and not running the react dev
server to serve the frontend application.
