# ChatProgram

You need node.js to run the server, and Python to run the client.

In order for everything to work properly one must first run:
```
	npm install
```
inside /client and /server to install neccessary dependencies.

To start the chat program do the following:<br>
-Inside the /server folder run:
```
	node chatServer.js
```
-Inside the /client folder run:
```
	python -m SimpleHTTPServer 8000
```
Note that since we're using Python, we must have the index.html file inside the root folder
.............can we fix this ?!

Then open http://localhost:8000 in a browser to start the chat
