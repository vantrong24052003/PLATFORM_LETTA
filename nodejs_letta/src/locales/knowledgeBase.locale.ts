export enum KnowledgeBaseMessage {
  CREATED = 'Knowledge Base created successfully',
  RETRIEVED = 'Knowledge Base retrieved successfully',
  UPDATED = 'Knowledge Base updated successfully',
  DELETED = 'Knowledge Base deleted successfully',
  NOT_FOUND = 'Knowledge Base not found',
  MISSING_REQUIRED_FIELDS = 'Missing required fields: name, content, organization_id',
  MISSING_ID = 'Missing required field: id',
  LIST_RETRIEVED = 'Knowledge Bases retrieved successfully',
}
