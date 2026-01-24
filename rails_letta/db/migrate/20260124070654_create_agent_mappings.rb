# [letta-custom-db] Migration to create 'agent_mappings' table.
#
# PURPOSE:
# This table acts as a crucial link between the Platform User (Customer User) and the internal Letta Cloud Agent.
#
# FUNCTIONALITY:
# 1. Maps a specific external user (user_id) to a specific Letta Agent (letta_agent_id).
# 2. Ensures that each user gets a unique, persistent agent instance derived from a Bot Template.
# 3. Supports Multi-Tenancy by scoping mappings to an 'organization_id'.
#
# HOW IT HELPS LETTA AI:
# - Provides identity persistence: When a user chats, the system looks up their corresponding 'letta_agent_id' here.
# - Ensures isolation: Prevents users from accessing other users' agents.
#
# USAGE:
# - Consulted by 'Letta::Agents::Create' service to check if an agent already exists before creating a new one.
# - Used by Message/Streaming controllers to route user messages to the correct Letta Agent ID.

class CreateAgentMappings < ActiveRecord::Migration[8.0]
  def change
    create_table :agent_mappings, id: :uuid do |t|
      t.string :organization_id, null: false
      t.references :bot_template, type: :uuid, null: false, foreign_key: true
      t.string :user_id, null: false
      t.string :letta_agent_id, null: false
      
      t.timestamps
    end
    
    add_index :agent_mappings, :letta_agent_id, unique: true
    add_index :agent_mappings, 
      [:organization_id, :bot_template_id, :user_id], 
      unique: true, 
      name: 'idx_agent_mappings_org_template_user'
  end
end
