import app from './src/app.js';
import { config } from './src/config/letta.config.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Letta API Key configured: ${config.letta.apiKey ? 'Yes' : 'No'}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`   GET   /api/`);
  console.log(`   POST  /api/agents`);
  console.log(`   GET   /api/agents/:agentId`);
  console.log(`   POST  /api/agents/:agentId/messages`);
  console.log(`   DELETE /api/agents/blocks/:blockId`);
});
