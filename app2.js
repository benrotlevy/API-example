const express = require("express");
const usersRoute = require("./routes/usersRoute");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use("/api/users", usersRoute);
// app.use("/api/products", productsRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("server is running on port " + port);
    require("./db");
});
