class RenameAgentMappingLettaAgentIdToAgentId < ActiveRecord::Migration[8.1]
  def change
    remove_index :agent_mappings, name: "index_agent_mappings_on_letta_agent_id"
    rename_column :agent_mappings, :letta_agent_id, :agent_id
    add_index :agent_mappings, :agent_id, unique: true
  end
end
