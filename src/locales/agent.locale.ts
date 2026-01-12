export enum AgentMessage {
  CREATED = 'Agent created successfully',
  RETRIEVED = 'Agent retrieved successfully',
  LIST_RETRIEVED = 'Agents list retrieved successfully',
  MESSAGE_SENT = 'Message sent successfully',
  MISSING_NAME = 'Missing required field: name',
  MISSING_AGENT_ID = 'Missing required field: agentId',
  MISSING_MESSAGE = 'Message content or approval is required',
  UPDATE_NOT_IMPLEMENTED = 'Agent update - not implemented yet',
  DELETE_NOT_IMPLEMENTED = 'Agent delete - not implemented yet',
}
