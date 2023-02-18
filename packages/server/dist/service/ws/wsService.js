"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var socket_io_1 = require("socket.io");
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var http_1 = __importDefault(require("http"));
var cookie_1 = __importDefault(require("cookie"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1["default"].config();
var app = (0, express_1["default"])();
var server = http_1["default"].createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
app.get('/', function (req, res) {
    res.send('Hello ws');
});
io.on('connection', function (socket) {
    var _a;
    var cookies;
    try {
        cookies = cookie_1["default"].parse(socket.handshake.headers.cookie);
    }
    catch (e) {
        console.error(e);
    }
    var msgId = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.privateMsgId;
    console.log(JSON.stringify(socket.handshake.query));
    var token = cookies === null || cookies === void 0 ? void 0 : cookies.token;
    var email;
    if (token) {
        try {
            var payload = jsonwebtoken_1["default"].verify(token, process.env.JWT_SECRET);
            email = payload.email;
        }
        catch (e) {
            console.error(e);
        }
    }
    console.log("email:\"".concat(email, "\" connected with msgId:").concat(msgId));
    socket.on('disconnect', function (reason) {
        console.log(email + ' disconnected. for reason:' + reason);
    });
    if (msgId) {
        var privateMsgEvent_1 = 'privateMsgEvent_' + msgId;
        socket.on(privateMsgEvent_1, function (msg, ackFn) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // todo save msg to db
                // const user = getUserFromCookieToken()
                // prisma
                // ...
                // simulate server timeout, and ack to client
                // setTimeout(() => ackFn({ code: 0 }), 1000)
                ackFn({ code: 0 });
                // broadcast: exclude the sender ws
                socket.broadcast.emit(privateMsgEvent_1, msg);
                return [2 /*return*/];
            });
        }); });
    }
});
exports["default"] = server;
