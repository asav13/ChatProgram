# ChatProgram
Reykjavík University, February 2016<br>
T-303-WEPO - Web Programming II<br>
Assignment: Chat program in AngularJS<br>
Authors: asav13@ru.is, vedise13@ru.is, laurar14@ru.is

A chat client written in AngularJS and using Socket.IO. A chat server was provided but modified slightly.<br>
## Installation and dependencies
### Dependencies
There was one dependency that we could not use npm for, so we reference one CDN.
The reason is that NPM did not install file versions for angular-bootstrap that we needed for a simple tab system.
This was discussed with a teacher on the facebook page of the course.

In order for everything to work properly one must first run:
```
	npm install
```
inside the /client folder <b>and</b> the /server folder. This takes care of installing neccessary dependencies.

### Run the server
You need <a href="https://nodejs.org/en/download/">node.js</a> to run the server. Inside the /server folder run:
```
	node chatServer.js
```

### Run the client
You need <a href="https://www.python.org/downloads/">Python</a> to run the client. Inside the /client folder run the following command for  <b>Python 2</b>:
```
	python -m SimpleHTTPServer 8000
```
or the following command for <b>Python 3</b>:
```
	python -m http.server 8000
```

### Start the application
Then open http://localhost:8000 while both server and client are running.
```
	explorer http://localhost:8000
```
