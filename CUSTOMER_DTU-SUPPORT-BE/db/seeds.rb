# frozen_string_literal: true

SEMESTERS = ["HK1-2023", "HK2-2023", "HK1-2024", "HK2-2024", "HK1-2025"].freeze
STATUSES  = %w[pending processing completed failed].freeze
SUBJECTS  = [
  { code: "CS101", name: "Introduction to Computer Science", credits: 3 },
  { code: "CS202", name: "Data Structures & Algorithms", credits: 4 },
  { code: "MATH101", name: "Linear Algebra", credits: 3 },
  { code: "MATH201", name: "Calculus I", credits: 3 },
  { code: "PHYS101", name: "General Physics", credits: 4 },
  { code: "SE301", name: "Software Engineering", credits: 3 },
  { code: "AI404", name: "Artificial Intelligence", credits: 4 },
  { code: "DB302", name: "Database Systems", credits: 3 },
  { code: "WEB202", name: "Web Development", credits: 3 },
  { code: "NET101", name: "Computer Networks", credits: 3 }
].freeze
LECTURERS = [
  "Dr. Alan Turing", "Prof. Ada Lovelace", "Dr. Grace Hopper", 
  "Mr. Linus Torvalds", "Ms. Margaret Hamilton", "Dr. John von Neumann"
].freeze

ActiveRecord::Base.transaction do
  AiScheduleResult.destroy_all
  Course.destroy_all
  CrawlCourseJob.destroy_all
  CrawlCourseConfig.destroy_all
  User.destroy_all
  
  User.find_or_create_by!(email: "trongtk248@example.com") do |u|
    u.name = "Van Trong (Admin)"
    u.tokens = { role: "admin", access_token: "system_master_token" }
  end

  5.times do |i|
    User.create!(
      email: "student_#{i + 1}@dtu.edu.vn",
      name: "Student Mock #{i + 1}",
      tokens: { role: "student", access_token: SecureRandom.hex(16) }
    )
  end
  users = User.all

  users.each do |user|
    3.times do |j|
      config = CrawlCourseConfig.create!(
        config_name: "DTU Portal Config #{j + 1} - #{user.name}",
        url: "https://mydtu.duytan.edu.vn/term=#{SEMESTERS.sample}",
        user: user,
        is_active: [true, true, false].sample
      )

      5.times do
        CrawlCourseJob.create!(
          crawl_course_config: config,
          status: STATUSES.sample,
          started_at: rand(1..10).days.ago,
          finished_at: rand(1..10).days.ago + rand(1..30).minutes,
          run_result: { courses_found: rand(10..30), duration: "#{rand(100..500)}s" }
        )
      end

      5.times do
        subj = SUBJECTS.sample
        Course.create!(
          crawl_course_config: config,
          course_code: subj[:code],
          course_name: subj[:name],
          credits: subj[:credits],
          lecturer: LECTURERS.sample,
          semester: SEMESTERS.sample,
          schedule: {
            day: %w[Mon Tue Wed Thu Fri Sat].sample,
            period: "#{rand(1..9)}-#{rand(1..9) + 2}",
            room: ["F201", "C302", "B104", "Online"].sample
          }
        )
      end
    end
  end

  users.each do |user|
    5.times do
      status = STATUSES.sample
      AiScheduleResult.create!(
        user: user,
        status: status,
        ai_model_name: ["gpt-4-turbo", "claude-3-opus", "gemini-pro"].sample,
        input_data: { 
          prompt: "Optimize my schedule for minimum gaps", 
          constraints: ["no_class_before_9am", "free_friday"] 
        },
        ai_result: status == "completed" ? { 
          recommendation: "Schedule C is best", 
          score: rand(8.0..10.0).round(1) 
        } : nil
      )
    end
  end
end
