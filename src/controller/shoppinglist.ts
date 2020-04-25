import express from "express";
import {ShoppingListService} from "../service/shoppinglist";
import {logger} from "../common/logger";
import {ItemFulfilmentState} from "../model/fulfilmentstate";

export let router = express.Router()

const shoppingListService = new ShoppingListService();

router.get("/current", async (req, res) => {
    return shoppingListService.items({itemStates: [ItemFulfilmentState.Active, ItemFulfilmentState.Processing]}).then(v => {
        res.send(v);
    })
});

router.post("/add", (req, res) => {
    logger.info(`Body: ${req.body}`);
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
