class DropTable < ActiveRecord::Migration[5.1]
  def change
    drop_table(:reservation_dates)
  end
end
