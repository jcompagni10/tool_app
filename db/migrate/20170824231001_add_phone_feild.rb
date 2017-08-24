class AddPhoneFeild < ActiveRecord::Migration[5.1]
  def change
    add_column :reservations, :phone, :string    
  end
end
