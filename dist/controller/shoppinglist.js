"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get("/current", (req, res) => {
    res.send(["foo", "bar", "baz", "bad"]);
});
exports.router.post("/add", (req, res) => {
    throw new Error("Not implemented");
});
exports.router.post("/mark", (req, res) => {
    throw new Error("Not implemented");
});
exports.router.post("/delete", (req, res) => {
    throw new Error("Not implemented");
});
exports.router.post("/deleteall", (req, res) => {
    throw new Error("Not implemented");
});
exports.router.get("/query", (req, res) => {
    throw new Error("Not implemented");
});
//# sourceMappingURL=shoppinglist.js.map