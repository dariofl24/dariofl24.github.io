class ApplicationController < ActionController::Base
  before_filter :authenticate_business_user!
  layout :layout_by_resource

  protected

  def layout_by_resource
    if signed_in?
      'application_signed_in'
    else
      'application'
    end
  end
end
