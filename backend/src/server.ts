const express = require("express");
const connectDB = require("./config/db");
const configuration = require("./config/config");
const globalErrHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/userRoute")
const orderRoute = require("./routes/orderRoute")
const tableRoute = require("./routes/tableRoute")
const paymentRoute = require("./routes/paymentRoute")
// Initialize Express App
const app = express();
const PORT: number = configuration.port;

// Connect to Database
connectDB();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"], //frontend cors url
  })
);
app.use(express.json()); // Parse incoming JSON request
app.use(cookieParser());

// Root Endpoint
app.get("/", (req: any, res: any) => {
  res.json({ message: "Hello from ServeEase Server!" });
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/order", orderRoute);
app.use("/api/table", tableRoute);
app.use("/api/payment", );

// Global Error Handler Middleware
app.use(globalErrHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`☑️  POS Server is listening on port http://localhost:${PORT}`);
});
