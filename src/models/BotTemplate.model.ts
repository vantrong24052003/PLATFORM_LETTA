import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from '@sequelize/core';
import { Status } from '@/constants/status.constants.js';

export class BotTemplate extends Model<
  InferAttributes<BotTemplate>,
  InferCreationAttributes<BotTemplate>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare greeting: string | null;
  declare system: string | null;
  declare llm_config: object | null;
  declare tool_rules: object | null;
  declare knowledge_base_ids: string[] | null;
  declare theme_config: object | null;
  declare organization_id: string;
  declare status: CreationOptional<Status.ACTIVE | Status.INACTIVE>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}
