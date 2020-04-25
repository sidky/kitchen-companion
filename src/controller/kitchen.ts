import express from "express";
import {KitchenService} from "../service/kitchenservice";
import {KitchenItemFilter} from "../model/filter/kitchenitem";

export let router = express.Router();

const kitchenService = new KitchenService();

router.get("/types", async (req, res) => {
    return kitchenService.itemTypes().then(v => {
        res.send(v)
    });
});

router.get("/items", async (req, res) => {
    return kitchenService.items(new KitchenItemFilter(null, null)).then(v => {
        res.send(v);
    })
});