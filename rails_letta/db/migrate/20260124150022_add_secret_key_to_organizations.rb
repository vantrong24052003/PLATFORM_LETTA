class AddSecretKeyToOrganizations < ActiveRecord::Migration[8.1]
  def change
    add_column :organizations, :secret_key, :string
  end
end
