import app from './src/app.js';
import { config } from './src/config/letta.config.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Loading environment config... Port: ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Letta API Key configured: ${config.letta.apiKey ? 'Yes' : 'No'}`);
});
