const express = require("express");
const connectDB = require("./config/db");
const configuration = require("./config/config");
const globalErrHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const tableRoute = require("./routes/tableRoute");
const paymentRoute = require("./routes/paymentRoute");

// Initialize Express App
const app = express();
const PORT: number = configuration.port;

// Connect to Database
connectDB();

// CORS Configuration
const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://serve-ease-frontend.vercel.app",
  "https://www.serve-ease-frontend.vercel.app",
  "http://serve-ease-frontend.vercel.app",
  "http://www.serve-ease-frontend.vercel.app",
];

/**
 * @type {import("cors").CorsOptions}
 */
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse incoming JSON request
app.use(cookieParser());

// Root Endpoint
app.get("/", (req: import("express").Request, res: import("express").Response) => {
  res.json({ message: "Hello from ServeEase Server!" });
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/order", orderRoute);
app.use("/api/table", tableRoute);
app.use("/api/payment", paymentRoute);

// Global Error Handler Middleware
app.use(globalErrHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`☑️  POS Server is listening on port http://localhost:${PORT}`);
});
