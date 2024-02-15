require("dotenv").config();
require("./db");

const PORT = process.env.PORT || 3000;

const app = require("./app");

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
