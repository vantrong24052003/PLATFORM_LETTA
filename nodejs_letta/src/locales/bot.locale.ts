export enum BotMessage {
  CREATED = 'Bot created successfully',
  RETRIEVED = 'Bot retrieved successfully',
  UPDATED = 'Bot updated successfully',
  DELETED = 'Bot deleted successfully',
  NOT_FOUND = 'Bot not found',
  MISSING_REQUIRED_FIELDS = 'Missing required fields: id, name, greeting, system, organization_id',
  MISSING_ID = 'Missing required field: id',
  LIST_RETRIEVED = 'Bots retrieved successfully',
}

export enum AgentMappingMessage {
  CREATED = 'Agent retrieved or created successfully',
  RETRIEVED = 'Agent mapping retrieved successfully',
  NOT_FOUND = 'Agent mapping not found',
  MISSING_CHATBOT_ID = 'Missing required field: chatbotId',
  LIST_NOT_IMPLEMENTED = 'Agent mappings list - not implemented yet',
  UPDATE_NOT_IMPLEMENTED = 'Agent mapping update - not implemented yet',
  DELETE_NOT_IMPLEMENTED = 'Agent mapping delete - not implemented yet',
}
