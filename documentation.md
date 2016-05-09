# William Tuner Documentation

The Application is a remedy for a turner-syndrom. It translates William Turner input into turned sentences. For the story behind this see [README.md](./README.md) in the root of this repo.

###Workflow:
**Starting the application in a web-browser.**
A picture of a pirate and an input field for text should be visible. 
In the background the client sends a GET-request to the nodeJs server, which fetches the 5 most recent turner-texts from the cassandra database (DB) and sends them as a json-respose. If there are no entries in the DB, "No entries in the DB." is sent and shown on the client side.

**Sending an input through the form-field.**
The turned response text should be visible.
In the background the client sends a POST-request to the nodeJs server, which applies the turnerLogic on the input and returns it immediately to the client. The input and the modified texts are stored with a current date and timestamp in the DB.

###Structure
- Frontend based on AngularJs
- Backend running on nodeJs
- Database Cassandra connected to backend

The application and the database run on different servers, thus the CORS settings and urls are important. (see [node/index.js](./node/index.js)  and [node/app/scripts/controllers/main.js](./node/app/scripts/controllers/main.js)). For the frontend I used a xampp/lampp Apache Web Server and for the backend a nodeJs instance connected to the cassandra database. 

It would be easier to use [node/server/routes.js](./node/server/routes.js), but on the other hand different 'client'-servers can use the same 'database'-server through this server separation.

Directories:
> - api/turner/controller/  (**NOT USED** php-API)
> - node/api/
>  - turnerApi.js (REST-Action and BD-Controller)
>  - turnerLogic.js (calculates the turned text) 
> - node/app/ (contains frontend in angularjs) 
> - node/config (contains DB-configuration)
> - node/server/routes.js/ (**NOT USED** angularjs api)

###Turner Logic:

> ####Algorithm:
> - Divide the input into sentences and then into words. 
> - Extract consonants, that will change their places.
> - Shuffle consonants and reassemble the sentences.

As a turner shuffle function I use Array.prototype.pop(), that leads to reverse consonant order. 
Pro: linear and thus reversible input transformation, without extra randomizer overhead.
Contra: not random.

####Remark: 
Dose not work with single words, for example <b>Tr</b>es<b>p</b>assing => <b>P</b>es<b>tr</b>assing, because using all consonants in all words in a sentence makes it unreadable.

#####TODO:
Extra case for sentences containing only one word.
