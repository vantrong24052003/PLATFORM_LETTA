# frozen_string_literal: true

class Letta::BotTemplatesController < ApplicationController
  DEFAULT_LIMIT = 25
  DEFAULT_PAGE = 1

  before_action :find_template, only: %i[show update destroy]

  # GET /letta/bot_templates
  def index
    limit = params[:limit] || DEFAULT_LIMIT
    page = params[:page] || DEFAULT_PAGE

    templates = BotTemplate.by_org(params.require(:organization_id)).page(page).per(limit)
    render_success(response: templates)
  end

  # POST /letta/bot_templates
  def create
    result = Letta::BotTemplates::Create.new(template_params).call

    if result[:success]
      render_success(response: result[:data], status: :created)
    else
      render_error(error: "Validation failed", response: result[:errors], status: :unprocessable_entity)
    end
  end

  # GET /letta/bot_templates/:id
  def show
    render_success(response: @template)
  end

  # PUT /letta/bot_templates/:id
  def update
    service_params = template_params.merge(bot_template: @template, id: params[:id])
    result = Letta::BotTemplates::Update.new(service_params).call

    if result[:success]
      render_success(response: result[:data])
    else
      render_error(error: "Validation failed", response: result[:errors], status: :unprocessable_entity)
    end
  end

  # DELETE /letta/bot_templates/:id
  def destroy
    @template.destroy
    head :no_content
  end

  private

  def find_template
    @template = BotTemplate.find(params[:id])
  end

  def template_params
    scalars = [ :organization_id, :name, :greeting, :system_prompt, :status, :customer_domain ]
    params.require(:bot_template).permit(scalars, tools: [], source_ids: [], theme_config: {})
  end
end
