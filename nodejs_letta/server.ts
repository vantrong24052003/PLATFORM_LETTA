import app from './src/app.js';
import { config } from './src/config/letta.config.js';
import { syncDatabase } from './src/models/index.js';

const PORT = config.port;

async function startServer() {
  try {
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`Loading environment config... Port: ${PORT}`);
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
