# Before running tests

After downloading the project from GitHub:
- Open up a terminal window.
- Go to the project folder ```clock-in-katta```.
- Execute the command ```npm install``` to install the packages.

# How to run the tests

To run the tests in IntelliJ:
- Start the server by running the ```server.js``` file.
- Execute the test's script by running the script ```clock-in.spec.js``` file.

To run the tests from the command line.
- Open up a terminal window.
- Go to the folder ```src``` located inside the clock-in-kata project's folder.
- Execute the following command ```npm test```.

# Application design
System's architecture is based on a backend server developed based on Node.js. The server uses Express, a Node.js web application framework to provide http methods for communication with the client.

Tests are running using Mocha's JavaScript test framework, which also runs in Node.js and allows asynchronous testing.

All the tests make use of JavaScript's promises to allow asynchronous testing. Communication with the server is made by using XMLHttpRequest.

# Parts pending to implement in the application
- GPS retry.

# Improvements I would do in the code with extra time
- Retrieve data from the server using fetch Api, for example.
- Improve code readability specialy for the ```clockIn()``` function.

# Self-evaluation of product readiness of your solution, between 1 (Not ready) and 5 (100% ready).
- A value of 3, 60% ready! It works, but lacks some basic but important functionalities, like for example, the retry capability when GPS data is required but not available at the moment of the clock-in!
- Some edge tests should also be performed to garantee the functionality of the solution in diferent scenarios.

