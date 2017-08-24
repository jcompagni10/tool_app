class ChangeInstructionsToTextInTable < ActiveRecord::Migration[5.1]
  def change
      change_column :reservations, :instructions, :text
  end
end
