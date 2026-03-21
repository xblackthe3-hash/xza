-- ==========================================
-- NEKLA JOB - FULL DATABASE SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) users
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'visitor' CHECK (role IN ('visitor', 'job_seeker', 'employer', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'blocked')),
    governorate VARCHAR(100),
    center VARCHAR(100),
    area VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2) employers
CREATE TABLE employers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employer_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    governorate VARCHAR(100),
    center VARCHAR(100),
    area VARCHAR(100),
    full_address TEXT,
    whatsapp VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3) job_seekers
CREATE TABLE job_seekers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    governorate VARCHAR(100),
    center VARCHAR(100),
    area VARCHAR(100),
    job_preferences TEXT,
    experience_summary TEXT,
    bio TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4) job_categories
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5) locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    governorate VARCHAR(100) NOT NULL,
    center VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    village VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6) jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES employers(id) ON DELETE SET NULL,
    posted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    poster_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    job_title VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES job_categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_text VARCHAR(255),
    salary_min NUMERIC,
    salary_max NUMERIC,
    employment_type VARCHAR(100),
    gender_preference VARCHAR(50),
    age_range VARCHAR(50),
    governorate VARCHAR(100),
    center VARCHAR(100),
    area VARCHAR(100),
    village VARCHAR(100),
    full_address TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    work_hours VARCHAR(100),
    number_of_workers_needed INTEGER DEFAULT 1,
    experience_required VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived', 'expired')),
    rejection_reason TEXT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    contact_clicks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7) job_post_reviews
CREATE TABLE job_post_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) CHECK (action IN ('approved', 'rejected', 'archived', 'deleted')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8) job_applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    job_seeker_id UUID REFERENCES job_seekers(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_whatsapp VARCHAR(20),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'contacted', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9) chatbot_faq
CREATE TABLE chatbot_faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    action_type VARCHAR(50),
    action_target VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10) contact_messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11) site_settings
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255) DEFAULT 'Nekla Job',
    slogan VARCHAR(255) DEFAULT 'فرص شغل قريبة منك في نكلا',
    whatsapp_number VARCHAR(20),
    support_phone VARCHAR(20),
    support_email VARCHAR(255),
    facebook_url VARCHAR(255),
    is_chatbot_enabled BOOLEAN DEFAULT true,
    is_job_posting_enabled BOOLEAN DEFAULT true,
    default_job_expiry_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12) saved_jobs
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, job_id)
);

-- 13) notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    related_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14) reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    reported_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason VARCHAR(255) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 15) audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- INITIAL DATA SEEDING
-- ==========================================

-- Insert Default Categories
INSERT INTO job_categories (name_ar, slug) VALUES 
('عمالة يدوية وحرفية', 'manual-labor'),
('مبيعات وتسويق', 'sales-marketing'),
('سائقين وتوصيل', 'drivers-delivery'),
('مطاعم وكافيهات', 'restaurants-cafes'),
('أمن وحراسة', 'security'),
('سكرتارية وإدارة', 'secretarial-admin'),
('تعليم وتدريس', 'education'),
('أخرى', 'other')
ON CONFLICT (slug) DO NOTHING;

-- Insert Default Chatbot FAQ
INSERT INTO chatbot_faq (question_text, answer_text, action_type, action_target, sort_order) VALUES
('إزاي أنزل إعلان شغل؟', 'تقدر تنزل إعلان شغل بسهولة من خلال صفحة "نزل إعلان شغل". الإعلان بيتراجع الأول وبعدين بينزل على الموقع.', 'link', '/post-job', 1),
('إزاي أقدم على شغل؟', 'لما تلاقي الشغلانة المناسبة، هتلاقي زرار "تواصل واتساب" أو "اتصل بالرقم" جوه تفاصيل الوظيفة.', 'link', '/jobs', 2),
('هل الخدمة مجانية؟', 'أيوة، Nekla Job خدمة مجانية 100% لأهالي نكلا والمناطق المجاورة.', null, null, 3);

-- Insert Default Site Settings
INSERT INTO site_settings (site_name, slogan, whatsapp_number, is_chatbot_enabled, is_job_posting_enabled) VALUES
('Nekla Job', 'فرص شغل قريبة منك في نكلا', '+201000000000', true, true);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_employers_modtime BEFORE UPDATE ON employers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_job_seekers_modtime BEFORE UPDATE ON job_seekers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_jobs_modtime BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_job_applications_modtime BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_chatbot_faq_modtime BEFORE UPDATE ON chatbot_faq FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_contact_messages_modtime BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_site_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_reports_modtime BEFORE UPDATE ON reports FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
