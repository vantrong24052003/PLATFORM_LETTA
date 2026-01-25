# frozen_string_literal: true

require "rails_helper"

RSpec.describe Letta::Agents::List do
  let(:organization) { create(:organization) }
  let(:other_org) { create(:organization) }

  before do
    create_list(:agent, 5, organization:, name: "Test Agent", is_deleted: false)
    create_list(:agent, 3, organization: other_org, name: "Other Agent", is_deleted: false)
    create_list(:agent, 2, organization:, name: "Deleted Agent", is_deleted: true)
  end

  describe "#call" do
    context "with valid params" do
      it "returns success with data" do
        result = described_class.new(
          organization_id: organization.id
        ).call

        expect(result[:success]).to be true
        expect(result[:data].count).to eq(5)
      end

      it "returns pagination metadata" do
        result = described_class.new(
          organization_id: organization.id,
          page: 1,
          per: 10
        ).call

        expect(result[:pagination]).to include(
          current_page: 1,
          total_count: 5
        )
      end

      it "serializes agents correctly" do
        result = described_class.new(
          organization_id: organization.id
        ).call

        agent = result[:data].first
        expect(agent).to have_key(:id)
        expect(agent).to have_key(:name)
        expect(agent).to have_key(:description)
        expect(agent).to have_key(:system)
        expect(agent).to have_key(:organization_id)
        expect(agent).to have_key(:created_at)
        expect(agent).to have_key(:updated_at)
        expect(agent).to have_key(:status)
      end
    end

    context "organization scoping" do
      it "only returns agents for current organization" do
        result = described_class.new(
          organization_id: organization.id
        ).call

        agent_names = result[:data].map { |a| a[:name] }
        expect(agent_names).to all include("Test")
        expect(agent_names).to_not include("Other Agent")
      end

      it "does not return agents from other organizations" do
        result = described_class.new(
          organization_id: organization.id
        ).call

        expect(result[:data].count).to eq(5)
      end
    end

    context "filtering by name" do
      before do
        create(:agent, organization:, name: "Special Agent", is_deleted: false)
      end

      it "returns partial matches" do
        result = described_class.new(
          organization_id: organization.id,
          name: "Special"
        ).call

        expect(result[:data].count).to eq(1)
        expect(result[:data][0][:name]).to eq("Special Agent")
      end

      it "is case insensitive" do
        result = described_class.new(
          organization_id: organization.id,
          name: "SPECIAL"
        ).call

        expect(result[:data].count).to eq(1)
      end
    end

    context "filtering by status" do
      it "returns only active agents when status is active" do
        result = described_class.new(
          organization_id: organization.id,
          status: "active"
        ).call

        expect(result[:data].count).to eq(5)
        expect(result[:data].map { |a| a[:status] }.uniq).to eq(["active"])
      end

      it "returns only inactive agents when status is inactive" do
        result = described_class.new(
          organization_id: organization.id,
          status: "inactive"
        ).call

        expect(result[:data].count).to eq(2)
        expect(result[:data].map { |a| a[:status] }.uniq).to eq(["inactive"])
      end

      it "returns all agents when no status filter" do
        result = described_class.new(
          organization_id: organization.id
        ).call

        expect(result[:data].count).to eq(7)
      end
    end

    context "pagination" do
      before { create_list(:agent, 25, organization:, is_deleted: false) }

      it "uses default per of 20" do
        result = described_class.new(
          organization_id: organization.id
        ).call

        expect(result[:data].count).to eq(20)
        expect(result[:pagination][:current_page]).to eq(1)
        expect(result[:pagination][:total_pages]).to eq(2)
      end

      it "respects custom per parameter" do
        result = described_class.new(
          organization_id: organization.id,
          per: 10
        ).call

        expect(result[:data].count).to eq(10)
        expect(result[:pagination][:total_pages]).to eq(4)
      end

      it "caps per at MAX_PER" do
        result = described_class.new(
          organization_id: organization.id,
          per: 200
        ).call

        expect(result[:pagination][:per_page]).to eq(100)
      end

      it "respects page parameter" do
        result = described_class.new(
          organization_id: organization.id,
          page: 2,
          per: 10
        ).call

        expect(result[:pagination][:current_page]).to eq(2)
        expect(result[:data].count).to eq(10)
      end

      it "defaults to page 1 when page is nil" do
        result = described_class.new(
          organization_id: organization.id,
          page: nil
        ).call

        expect(result[:pagination][:current_page]).to eq(1)
      end

      it "defaults to page 1 when page is less than 1" do
        result = described_class.new(
          organization_id: organization.id,
          page: -1
        ).call

        expect(result[:pagination][:current_page]).to eq(1)
      end
    end

    context "edge cases" do
      it "handles empty results" do
        empty_org = create(:organization)
        result = described_class.new(
          organization_id: empty_org.id
        ).call

        expect(result[:data]).to eq([])
        expect(result[:pagination][:total_count]).to eq(0)
      end

      it "orders agents by created_at desc" do
        agents = create_list(:agent, 3, organization:, is_deleted: false)
        result = described_class.new(
          organization_id: organization.id
        ).call

        # The last created should be first
        expect(result[:data].first[:name]).to eq(agents.last.name)
      end
    end

    context "error handling" do
      it "returns error when organization not found" do
        result = described_class.new(
          organization_id: "nonexistent_id"
        ).call

        expect(result[:success]).to be false
        expect(result[:error]).to be_present
      end
    end
  end
end
