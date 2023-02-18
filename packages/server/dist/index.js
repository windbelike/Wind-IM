"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var wsService_1 = __importDefault(require("./service/ws/wsService"));
wsService_1["default"].listen(2000, function () {
    console.log('listening on *:2000');
});
