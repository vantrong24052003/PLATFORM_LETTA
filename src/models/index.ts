import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.config.js';
import { BotTemplate } from './BotTemplate.model.js';
import { AgentMapping } from './AgentMapping.model.js';
import { KnowledgeBase } from './KnowledgeBase.model.js';
import { Status, DBField } from '@/constants/index.js';

const DB_SCHEMA = 'letta';
const DB_TABLES = {
  BOT_TEMPLATES: 'bot_templates',
  AGENT_MAPPINGS: 'agent_mappings',
  KNOWLEDGE_BASES: 'knowledge_bases',
};

BotTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    greeting: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    system: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    llm_config: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    tool_rules: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    knowledge_base_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
    },
    theme_config: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(Status.ACTIVE, Status.INACTIVE),
      defaultValue: Status.ACTIVE,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: DB_TABLES.BOT_TEMPLATES,
    schema: DB_SCHEMA,
    timestamps: true,
    underscored: true,
    createdAt: DBField.CREATED_AT,
    updatedAt: DBField.UPDATED_AT,
  }
);

AgentMapping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatbot_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agent_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_used_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: DB_TABLES.AGENT_MAPPINGS,
    schema: DB_SCHEMA,
    timestamps: true,
    underscored: true,
    createdAt: DBField.CREATED_AT,
    updatedAt: false,
  }
);

KnowledgeBase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    letta_source_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(Status.PENDING, Status.PROCESSING, Status.SUCCESS, Status.FAILED),
      defaultValue: Status.PENDING,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: DB_TABLES.KNOWLEDGE_BASES,
    schema: DB_SCHEMA,
    timestamps: true,
    underscored: true,
    createdAt: DBField.CREATED_AT,
    updatedAt: DBField.UPDATED_AT,
  }
);

export { sequelize, BotTemplate, AgentMapping, KnowledgeBase };

export async function syncDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}
