import "dotenv/config";
import app from "./index";
import { sequelize } from "./config/database";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL OK");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("✗ Failed to start server:", error);
      process.exit(1);
    });

    const shutdown = async (signal: string) => {
      server.close(async () => {
        await sequelize.close();
        console.log("🔌 DB cerrada. Bye.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("💥 Error al arrancar:", error);
    process.exit(1);
  }
}

bootstrap();
