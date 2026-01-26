class CrawlCourseConfig < ApplicationRecord
  belongs_to :user
  has_many :courses, dependent: :destroy
  has_many :crawl_course_jobs, dependent: :destroy
end
