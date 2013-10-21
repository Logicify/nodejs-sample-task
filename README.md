# nodejs-sample-task
This is a sample application, providing a bookstorage-like functionality over the web, in order to
showcase and expose technical stack and techniquest to be used on larger projects.

Sample task for nodejs, extjs, mongodb, elasticSearch. The app is ready to be deployed to the Heroku
cloud hosting, however may also be easily ran locally.

Created and maintained by Logicify [http://logicify.com](http://logicify.com). We use it also as a kickstarter
app when we need to have a typical one started. It is released under MIT, and really not a rocket science - please
feel free to fork it and use. Pull requests with improvements and new features are also welcome.

You can see the app instance on [http://http://nodejs-sample-task.logicify.com/](http://nodejs-sample-task.logicify.com/)

## Prerequisites
 * Mongodb (2.x)
 * Elasticsearch (last version)
 * Node v0.10 with npm

 Details about installation of these can be found on [Prerequisites] page

## Building and installing
Prepare the data for the database. Look into the `config.json` for the database name which will be used by an
application. Connect to the database specified there with a mongo console, and get the `mongodb/mongo-sample-data.js`
to store first books.

Then, carry on to building application. First, run

 ```
 npm install
 ```

This will install the dependencies. Then,

```
node server.js
```

Which runs the server. On the command line where you ran the node, you will observe the notice with the URL the app is
accessible on. Visit that URL in browser, and you are in!

### Test project

First, make sure the project is built and running successfully.

Then simply run the
```
npm test
```
from within the project directory. This should result in the tests running and producing a specification-like
 output of the tests.

## Team
Thanks to everyone who contributed to this little sample application (originally created in 2 days by a team knowing
nothing of Node.js neither of any other technology used here:)

 * Pavel Knorr
 * Vadim Didenko
 * Igor Cherednichenko
 * Alex Cherednichenko
