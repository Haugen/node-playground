"use strict";

let url = require("url");
let fs = require("fs");

function renderHTML(path, response) {
  fs.readFile(path, null, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.write(`${error.code}: File not found.`);
    } else {
      response.write(data);
    }
    response.end();
  });
}

module.exports = {
  handleRequest: function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    let path = url.parse(request.url).pathname;

    switch (path) {
      case "/":
        renderHTML("./index.html", response);
        break;
      case "/login":
        renderHTML("./login.html", response);
        break;
      default:
        response.writeHead(404);
        response.write("Page not found.");
        response.end();
    }
  }
};
