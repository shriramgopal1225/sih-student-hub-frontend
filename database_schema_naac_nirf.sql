-- Database Schema Changes for NAAC/NIRF Report Generation Feature
-- Run this script in Supabase SQL Editor

-- 1. Add new roles to the existing role enum
-- First, check current role enum values
-- ALTER TYPE role_enum ADD VALUE 'superadmin';
-- ALTER TYPE role_enum ADD VALUE 'hod';

-- If role_enum doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('student', 'faculty', 'admin', 'superadmin', 'hod');
    ELSE
        -- Add new values if they don't exist
        BEGIN
            ALTER TYPE role_enum ADD VALUE 'superadmin';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
        BEGIN
            ALTER TYPE role_enum ADD VALUE 'hod';
        EXCEPTION
            WHEN duplicate_object THEN null;
        END;
    END IF;
END
$$;

-- 2. Create NAAC/NIRF specific tables

-- Research Publications Table
CREATE TABLE IF NOT EXISTS research_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    faculty_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    journal_name TEXT,
    publication_year INTEGER,
    publication_type VARCHAR(50) CHECK (publication_type IN ('journal', 'conference', 'book', 'chapter')),
    impact_factor DECIMAL(5,3),
    citations_count INTEGER DEFAULT 0,
    doi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patents Table
CREATE TABLE IF NOT EXISTS patents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    faculty_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    patent_number TEXT,
    application_date DATE,
    grant_date DATE,
    status VARCHAR(20) CHECK (status IN ('filed', 'published', 'granted', 'rejected')),
    patent_type VARCHAR(30) CHECK (patent_type IN ('national', 'international')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research Projects Table
CREATE TABLE IF NOT EXISTS research_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    principal_investigator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    funding_agency TEXT,
    project_type VARCHAR(30) CHECK (project_type IN ('sponsored', 'consultancy', 'government')),
    sanctioned_amount DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('ongoing', 'completed', 'terminated')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industry Partnerships Table
CREATE TABLE IF NOT EXISTS industry_partnerships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_name TEXT NOT NULL,
    partnership_type VARCHAR(30) CHECK (partnership_type IN ('mou', 'collaboration', 'internship', 'placement')),
    start_date DATE,
    end_date DATE,
    contact_person TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institutional Policies Table
CREATE TABLE IF NOT EXISTS institutional_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    policy_name TEXT NOT NULL,
    policy_type VARCHAR(50),
    effective_date DATE,
    review_date DATE,
    document_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Data Table
CREATE TABLE IF NOT EXISTS financial_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    financial_year INTEGER NOT NULL,
    category VARCHAR(50) CHECK (category IN ('revenue', 'expenditure', 'grants', 'infrastructure')),
    subcategory TEXT,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placements Table
CREATE TABLE IF NOT EXISTS placements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT,
    package_amount DECIMAL(10,2),
    placement_type VARCHAR(30) CHECK (placement_type IN ('on_campus', 'off_campus', 'internship_conversion')),
    placement_date DATE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Higher Studies Table
CREATE TABLE IF NOT EXISTS higher_studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    program_name TEXT,
    degree_type VARCHAR(30) CHECK (degree_type IN ('masters', 'phd', 'professional')),
    admission_date DATE,
    country TEXT DEFAULT 'India',
    scholarship_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employer Feedback Table
CREATE TABLE IF NOT EXISTS employer_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    feedback_year INTEGER,
    technical_skills_rating INTEGER CHECK (technical_skills_rating BETWEEN 1 AND 5),
    communication_skills_rating INTEGER CHECK (communication_skills_rating BETWEEN 1 AND 5),
    teamwork_rating INTEGER CHECK (teamwork_rating BETWEEN 1 AND 5),
    overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Feedback Table
CREATE TABLE IF NOT EXISTS student_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    feedback_type VARCHAR(30) CHECK (feedback_type IN ('course', 'faculty', 'infrastructure', 'overall')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    semester INTEGER,
    academic_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Extend existing tables with NAAC/NIRF fields

-- Add fields to faculty table
DO $$
BEGIN
    -- Add qualification column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faculty' AND column_name = 'qualification') THEN
        ALTER TABLE faculty ADD COLUMN qualification VARCHAR(20) CHECK (qualification IN ('phd', 'masters', 'bachelors'));
    END IF;
    
    -- Add experience_years column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faculty' AND column_name = 'experience_years') THEN
        ALTER TABLE faculty ADD COLUMN experience_years INTEGER;
    END IF;
    
    -- Add research_area column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faculty' AND column_name = 'research_area') THEN
        ALTER TABLE faculty ADD COLUMN research_area TEXT;
    END IF;
    
    -- Add publications_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faculty' AND column_name = 'publications_count') THEN
        ALTER TABLE faculty ADD COLUMN publications_count INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Add fields to students table
DO $$
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'category') THEN
        ALTER TABLE students ADD COLUMN category VARCHAR(20) CHECK (category IN ('general', 'obc', 'sc', 'st', 'other'));
    END IF;
    
    -- Add state_of_origin column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'state_of_origin') THEN
        ALTER TABLE students ADD COLUMN state_of_origin TEXT;
    END IF;
    
    -- Add placement_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'placement_status') THEN
        ALTER TABLE students ADD COLUMN placement_status VARCHAR(30) CHECK (placement_status IN ('placed', 'higher_studies', 'entrepreneur', 'seeking'));
    END IF;
END
$$;

-- Add fields to activities table
DO $$
BEGIN
    -- Add impact_score column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'impact_score') THEN
        ALTER TABLE activities ADD COLUMN impact_score DECIMAL(3,2) CHECK (impact_score BETWEEN 0 AND 10);
    END IF;
    
    -- Add beneficiaries_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'beneficiaries_count') THEN
        ALTER TABLE activities ADD COLUMN beneficiaries_count INTEGER;
    END IF;
    
    -- Add naac_category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'naac_category') THEN
        ALTER TABLE activities ADD COLUMN naac_category VARCHAR(30) CHECK (naac_category IN ('teaching', 'research', 'extension', 'professional'));
    END IF;
END
$$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_research_publications_faculty ON research_publications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_research_publications_year ON research_publications(publication_year);
CREATE INDEX IF NOT EXISTS idx_patents_faculty ON patents(faculty_id);
CREATE INDEX IF NOT EXISTS idx_patents_status ON patents(status);
CREATE INDEX IF NOT EXISTS idx_research_projects_pi ON research_projects(principal_investigator_id);
CREATE INDEX IF NOT EXISTS idx_placements_student ON placements(student_id);
CREATE INDEX IF NOT EXISTS idx_higher_studies_student ON higher_studies(student_id);
CREATE INDEX IF NOT EXISTS idx_student_feedback_student ON student_feedback(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_naac_category ON activities(naac_category);

-- 5. Create functions for NAAC/NIRF calculations

-- Function to calculate faculty-student ratio
CREATE OR REPLACE FUNCTION get_faculty_student_ratio()
RETURNS TABLE(faculty_count BIGINT, student_count BIGINT, ratio DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM faculty) as faculty_count,
        (SELECT COUNT(*) FROM students) as student_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM faculty) > 0 THEN 
                ROUND((SELECT COUNT(*) FROM students)::DECIMAL / (SELECT COUNT(*) FROM faculty), 2)
            ELSE 0
        END as ratio;
END;
$$ LANGUAGE plpgsql;

-- Function to get NAAC metrics summary
CREATE OR REPLACE FUNCTION get_naac_metrics_summary()
RETURNS TABLE(
    total_students BIGINT,
    total_faculty BIGINT,
    faculty_student_ratio DECIMAL,
    phd_faculty_count BIGINT,
    total_publications BIGINT,
    total_patents BIGINT,
    verified_activities BIGINT,
    total_activities BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM faculty) as total_faculty,
        (SELECT ratio FROM get_faculty_student_ratio() LIMIT 1) as faculty_student_ratio,
        (SELECT COUNT(*) FROM faculty WHERE qualification = 'phd') as phd_faculty_count,
        (SELECT COUNT(*) FROM research_publications) as total_publications,
        (SELECT COUNT(*) FROM patents WHERE status = 'granted') as total_patents,
        (SELECT COUNT(*) FROM activities WHERE approval_status = 'APPROVED') as verified_activities,
        (SELECT COUNT(*) FROM activities) as total_activities;
END;
$$ LANGUAGE plpgsql;

-- Function to get NIRF weighted scores
CREATE OR REPLACE FUNCTION get_nirf_weighted_scores()
RETURNS TABLE(
    tlr_score DECIMAL,
    rpc_score DECIMAL,
    go_score DECIMAL,
    oi_score DECIMAL,
    pr_score DECIMAL,
    overall_score DECIMAL
) AS $$
DECLARE
    faculty_count BIGINT;
    student_count BIGINT;
    fs_ratio DECIMAL;
    phd_percentage DECIMAL;
    placement_rate DECIMAL;
BEGIN
    -- Get basic metrics
    SELECT COUNT(*) INTO faculty_count FROM faculty;
    SELECT COUNT(*) INTO student_count FROM students;
    
    -- Calculate faculty-student ratio score (optimal 1:15)
    fs_ratio := CASE WHEN faculty_count > 0 THEN student_count::DECIMAL / faculty_count ELSE 0 END;
    
    -- Calculate PhD percentage
    phd_percentage := CASE 
        WHEN faculty_count > 0 THEN 
            (SELECT COUNT(*) FROM faculty WHERE qualification = 'phd')::DECIMAL / faculty_count * 100
        ELSE 0 
    END;
    
    -- Calculate placement rate
    placement_rate := CASE 
        WHEN student_count > 0 THEN 
            (SELECT COUNT(*) FROM placements)::DECIMAL / student_count * 100
        ELSE 0 
    END;
    
    RETURN QUERY
    SELECT 
        -- TLR (Teaching, Learning & Resources) - 30% weightage
        LEAST(100, (15 / GREATEST(fs_ratio, 1)) * 100 * 0.4 + phd_percentage * 0.25 + 80 * 0.35) as tlr_score,
        
        -- RPC (Research and Professional Practice) - 30% weightage
        LEAST(100, 
            (SELECT COUNT(*) FROM research_publications)::DECIMAL / GREATEST(faculty_count, 1) * 10 + 
            (SELECT COUNT(*) FROM patents WHERE status = 'granted')::DECIMAL * 5 + 50
        ) as rpc_score,
        
        -- GO (Graduation Outcomes) - 20% weightage
        LEAST(100, placement_rate * 0.6 + 70 * 0.4) as go_score,
        
        -- OI (Outreach and Inclusivity) - 10% weightage
        80::DECIMAL as oi_score,
        
        -- PR (Perception) - 10% weightage
        75::DECIMAL as pr_score,
        
        -- Overall weighted score
        (
            LEAST(100, (15 / GREATEST(fs_ratio, 1)) * 100 * 0.4 + phd_percentage * 0.25 + 80 * 0.35) * 0.30 +
            LEAST(100, 
                (SELECT COUNT(*) FROM research_publications)::DECIMAL / GREATEST(faculty_count, 1) * 10 + 
                (SELECT COUNT(*) FROM patents WHERE status = 'granted')::DECIMAL * 5 + 50
            ) * 0.30 +
            LEAST(100, placement_rate * 0.6 + 70 * 0.4) * 0.20 +
            80 * 0.10 +
            75 * 0.10
        ) as overall_score;
END;
$$ LANGUAGE plpgsql;

-- 6. Enable Row Level Security (RLS) for new tables
ALTER TABLE research_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patents ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE higher_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_feedback ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for superadmin and hod access
-- Superadmin can access all data
CREATE POLICY "Superadmin full access" ON research_publications FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON patents FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON research_projects FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON industry_partnerships FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON institutional_policies FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON financial_data FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON placements FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON higher_studies FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON employer_feedback FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

CREATE POLICY "Superadmin full access" ON student_feedback FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'superadmin')
);

-- Faculty can access their own research data
CREATE POLICY "Faculty own research data" ON research_publications FOR ALL TO authenticated USING (
    faculty_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);

CREATE POLICY "Faculty own patents" ON patents FOR ALL TO authenticated USING (
    faculty_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);

-- Students can access their own placement/feedback data
CREATE POLICY "Student own placement data" ON placements FOR ALL TO authenticated USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);

CREATE POLICY "Student own feedback data" ON student_feedback FOR ALL TO authenticated USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);

-- Insert some sample data for testing
INSERT INTO research_publications (faculty_id, title, journal_name, publication_year, publication_type, impact_factor)
SELECT 
    p.id,
    'Sample Research Publication ' || ROW_NUMBER() OVER(),
    'International Journal of Engineering',
    2023,
    'journal',
    2.5
FROM profiles p 
JOIN faculty f ON p.id = f.id 
WHERE p.role = 'faculty'
LIMIT 5
ON CONFLICT DO NOTHING;

INSERT INTO patents (faculty_id, title, status, patent_type)
SELECT 
    p.id,
    'Innovative Technology Patent ' || ROW_NUMBER() OVER(),
    'granted',
    'national'
FROM profiles p 
JOIN faculty f ON p.id = f.id 
WHERE p.role = 'faculty'
LIMIT 3
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Final message
SELECT 'NAAC/NIRF database schema setup completed successfully!' as result;