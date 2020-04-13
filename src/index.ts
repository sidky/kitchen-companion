import express from "express"

const app = express();
const port = process.env.PORT || 8080;

import {router as shoppingList} from "./controller/shoppinglist";

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/list", shoppingList);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});

