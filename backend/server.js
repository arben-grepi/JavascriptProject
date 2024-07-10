// otetaan Express käyttöön
const express = require("express");
const app = express();

// määritetään reitti frontendin index.html
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// valitaan portti ja käytetään serveriä
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // tämän voi halutessa laittaa kommentteihin
});