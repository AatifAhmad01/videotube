import ConnectDB from "./db/db.js";
import dotenv from "dotenv"
import app from "./app.js";

dotenv.config({
    path: './.env'
});

app.get("/", (req, res) => {
    res.json({ user: "Atif", isAdmin: true })
})

ConnectDB()
    .then(() => {
        const serverPost = process.env.PORT || 8000

        app.on("error", (error) => {
            console.log("Error", error);
            throw error
        })

        app.listen(serverPost, () => {
            console.log(`Server start on Port ${serverPost}`)
        })
    })
    .catch((err) => {
        console.log("Database Connection Failed", err);
    })
