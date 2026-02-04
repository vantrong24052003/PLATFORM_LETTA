# frozen_string_literal: true

class Letta::Agents::List < ApplicationService
  DEFAULT_PAGE = 1
  DEFAULT_PER = 20
  MAX_PER = 100

  def call
    agents = current_organization.agents
    agents = apply_filters(agents)
    agents = apply_pagination(agents)

    {
      success: true,
      data: serialize_agents(agents),
      pagination: pagination_info(agents),
    }
  rescue StandardError => e
    { success: false, error: e.message }
  end

  private

  def current_organization
    @current_organization ||= Organization.find(params[:organization_id])
  end

  def apply_filters(agents)
    if params[:name].present?
      agents = agents.where("name ILIKE ?", "%#{params[:name]}%")
    end

    if params[:status] == "inactive"
      agents = agents.where(is_deleted: true)
    elsif params[:status] == "active"
      agents = agents.where(is_deleted: false)
    end

    agents
  end

  def apply_pagination(agents)
    page = [ params[:page]&.to_i || DEFAULT_PAGE, 1 ].max
    per = [ params[:per]&.to_i || DEFAULT_PER, MAX_PER ].min

    agents.order(created_at: :desc).page(page).per(per)
  end

  def serialize_agents(agents)
    agents.map do |agent|
      {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        system: agent.system,
        organization_id: agent.organization_id,
        created_at: agent.created_at,
        updated_at: agent.updated_at,
        status: agent.is_deleted ? "inactive" : "active",
      }
    end
  end

  def pagination_info(agents)
    {
      current_page: agents.current_page,
      total_pages: agents.total_pages,
      total_count: agents.total_count,
      per_page: agents.limit_value,
    }
  end
end
