import express from "express";
import {ShoppingListService} from "../service/shoppinglist";
import {ShoppingItemState} from "../service/shoppinglist/state";

export let router = express.Router()

const shoppingListService = new ShoppingListService();

router.get("/current", (req, res) => {
    return shoppingListService.items({itemStates: ShoppingItemState.Active}).then(v => res.send(["foo", "bar", "baz", "bad"]))
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
