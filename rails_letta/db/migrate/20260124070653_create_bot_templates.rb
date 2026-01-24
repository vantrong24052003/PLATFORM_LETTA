class CreateBotTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :bot_templates, id: :uuid do |t|
      t.string :organization_id, null: false, index: true
      t.string :name, null: false
      t.text :greeting
      t.string :status, default: 'active'
      t.text :system_prompt, null: false
      t.jsonb :tools, default: []
      t.jsonb :source_ids, default: []
      t.jsonb :theme_config, default: {}
      
      t.timestamps
    end
  end
end
