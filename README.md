# ChatProgram
## Installation and dependencies
### Dependencies

In order for everything to work properly one must first run:
```
	npm install
```
inside the /client folder and the /server folder. This takes care of installing neccessary dependencies.

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
Note that since we're using Python, we must have the index.html file inside the root folder.

### Start the application
Then open http://localhost:8000 while both server and client are running.
```
	explorer http://localhost:8000
```
