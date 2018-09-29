"use strict";

let http = require("http");
let fs = require("fs");
let module1 = require("./module1");

function onRequest(request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });

  fs.readFile("./index.html", null, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.write("File not found.");
    } else {
      response.write(data);
    }
    response.end();
  });

  module1.myModuleFunc();
}

http.createServer(onRequest).listen(8000);
