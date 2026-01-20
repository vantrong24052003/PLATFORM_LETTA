import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from '@sequelize/core';

export class AgentMapping extends Model<
  InferAttributes<AgentMapping>,
  InferCreationAttributes<AgentMapping>
> {
  declare id: CreationOptional<number>;
  declare chatbot_id: string;
  declare user_id: string | null;
  declare agent_id: string;
  declare created_at: CreationOptional<Date>;
  declare last_used_at: CreationOptional<Date>;
}
