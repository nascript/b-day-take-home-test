import express from "express";
import userRoutes from "./presentation/routes/userRoute";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger"

const app = express();
app.use(express.json());

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", userRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
  });
});

app.use(errorHandler);

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "test:unit") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
