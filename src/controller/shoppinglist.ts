import express from "express";

export let router = express.Router()

router.get("/current", (req, res) => {
    res.send(["foo", "bar", "baz", "bad"])
});

router.post("/add", (req, res) => {
    throw new Error("Not implemented");
});

router.post("/mark", (req, res) => {
    throw new Error("Not implemented");
});

router.post("/delete", (req, res) => {
    throw new Error("Not implemented");
});

router.post("/deleteall", (req, res) => {
    throw new Error("Not implemented");
});

router.get("/query", (req, res) => {
    throw new Error("Not implemented");
});
