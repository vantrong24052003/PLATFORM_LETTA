class RenameModelNameInAiScheduleResults < ActiveRecord::Migration[8.0]
  def change
    rename_column :ai_schedule_results, :model_name, :ai_model_name
  end
end
