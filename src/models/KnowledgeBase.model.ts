import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from '@sequelize/core';
import { Status } from '@/constants/status.constants.js';

export class KnowledgeBase extends Model<
  InferAttributes<KnowledgeBase>,
  InferCreationAttributes<KnowledgeBase>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string | null;
  declare content: string | null;
  declare letta_source_id: string | null;
  declare status: CreationOptional<Status.PENDING | Status.PROCESSING | Status.SUCCESS | Status.FAILED>;
  declare organization_id: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}
