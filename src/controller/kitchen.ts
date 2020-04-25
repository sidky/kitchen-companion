import express from "express";
import {KitchenService} from "../service/kitchenservice";
import {KitchenItemFilter} from "../model/filter/kitchenitem";
import {logger} from "../common/logger";
import {KitchenItemType} from "../model/kitchenitemtype";
import {KitchenItem} from "../model/kitchenitem";

export let router = express.Router();

const kitchenService = new KitchenService();

router.get("/types", async (req, res) => {
    return kitchenService.itemTypes().then(v => {
        res.send(v)
    });
});

router.post("/types", async (req, res) => {
    const types = req.body as KitchenItemType[];

    return kitchenService.addItemTypes(types).then(v => {
       res.send(v);
    });
});

router.get("/items", async (req, res) => {
    return kitchenService.items(new KitchenItemFilter(null, null)).then(v => {
        res.send(v);
    })
});

router.post("/items", async (req, res) => {
    const items = req.body as KitchenItem[];

    return kitchenService.addItems(items).then((v) => {
       res.send(v);
    });
});