require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const userRoute = require("./routes/user");
const serviceRoute = require("./routes/bookService");
const getServiceRoute = require("./routes/service");
const userDashboardRoute = require("./routes/userDashboard");
const businessDashboardRoute = require("./routes/businessDashboard");
const adminRoute = require("./routes/admin");
const adminOnlyMiddleware = require("./middlewares/admin");
const businessOnlyMiddleware = require("./middlewares/businessOnlyMiddleware");
const authMiddleware = require("./middlewares/auth");
const cors = require("cors");
const PORT = process.env.PORT;
const app = express();
const path = require("path");

app.use("/images", express.static("public/images"));

app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api", getServiceRoute);
app.use("/api/services", authMiddleware, serviceRoute);
app.use("/api/userDashboard", authMiddleware, userDashboardRoute);
app.use("/api/businessDashboard", businessDashboardRoute);
app.use("/api/admin", authMiddleware, adminOnlyMiddleware, adminRoute);

try {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.use(/(.*)/, (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
} catch (error) {
  // console.error("Error ", error);
  console.error("Error ", error.stack);
}
// app.use('/', postServiceRoute)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
