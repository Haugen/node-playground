"use strict";

function myModuleFunc() {
  console.log("Using a module!");
}

let string = "My module string!";

module.exports.myModuleFunc = myModuleFunc;
module.exports.string = string;
