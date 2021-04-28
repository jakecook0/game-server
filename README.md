# Node server for playable javascript demos

## Purpose
This server was built for two primary reasons:
1. Learn and practice node.js and Express for server-side code and static file serving
1. Deploy a platform that anyone can quickly access fun, small games built for a game development course at Utah State University

## Running
This application runs on a simple free heroku dyno.
Running in the server is automatically managed as configured in the Procfile. This can be run locally with the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) tool via the command

```sh
heroku local web
```
Alternatively a local dev server could be run with nodemon:
```sh
npx nodemon index
```