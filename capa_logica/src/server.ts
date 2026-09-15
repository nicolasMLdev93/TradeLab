import "dotenv/config";
import index from './index'

const PORT = Number(process.env.PORT);

const server = index.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("✗ Failed to start server:", error);
  process.exit(1);
});