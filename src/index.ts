import express from "express"

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});

