const express = require("express");
const connectDB = require("./config/db");
const configuration = require("./config/config");
const globalErrHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Initialize Express App
const app = express();
const PORT: number = configuration.port;

// Connect to Database
connectDB();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json()); // Parse incoming JSON request
app.use(cookieParser());

// Root Endpoint
app.get("/", (req: any, res: any) => {
  res.json({ message: "Hello from ServeEase Server!" });
});

// API Routes
// app.use("/api/user", require("./routes/userRoute"));
// app.use("/api/order", require("./routes/orderRoute"));
// app.use("/api/table", require("./routes/tableRoute"));
// app.use("/api/payment", require("./routes/paymentRoute"));

// Global Error Handler Middleware
app.use(globalErrHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`☑️  POS Server is listening on port ${PORT}`);
});
