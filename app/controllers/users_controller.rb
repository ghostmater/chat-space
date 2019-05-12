class UsersController < ApplicationController

  def index
    @users = User.where.not(id: current_user.id).where('name LIKE(?)', "%#{params[:user_name]}%").limit(20)
    respond_to do |format|
      format.json # view/index.json.builderでデータをjson形式にする
    end
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path # 保存できた
    else
      render :edit          # 保存できなかった
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end