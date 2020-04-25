import express from "express"
import {logger} from "./common/logger";
import bodyparser from "body-parser";

const app = express();
const port = process.env.PORT || 8080;

import {router as shoppingList} from "./controller/shoppinglist";
import {router as kitchen} from "./controller/kitchen";

app.use(bodyparser.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/list", shoppingList);
app.use("/kitchen", kitchen);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    logger.log('info', `server started at http://localhost:${port}`);
});

