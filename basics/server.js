"use strict";

let http = require("http");
let fs = require("fs");
let module1 = require("./module1");
let app = require("./app");

const l = console.log;

// First example of how to handle a request.
function oldOnRequest(request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });

  fs.readFile("./index.html", null, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.write(`${error.code}: File not found.`);
    } else {
      response.write(data);
    }
    response.end();
  });

  module1.myModuleFunc();
}

http.createServer(app.handleRequest).listen(8000);
