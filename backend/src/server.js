const express = require("express");
const cors = require("cors");
const artifactRoutes = require("./routes/artifactRoutes");
const adversarialRoutes = require("./routes/adversarialRoutes");
const blockchainService = require("./services/blockchainService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    system: "ModelLedger Provenance Protocol",
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/artifacts", artifactRoutes);
app.use("/api/adversarial", adversarialRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, async () => {
  console.log(`\n=================================================`);
  console.log(`🛡️  ModelLedger API Server running on port ${PORT}`);
  console.log(`🔗  Endpoint: http://localhost:${PORT}`);
  console.log(`=================================================\n`);
  
  // Initialize blockchain service connection
  await blockchainService.init();
});
