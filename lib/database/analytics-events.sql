-- ==============================================================================
-- BetaVolt Telemetry & Analytics Database Schema
-- Table: public.analytics_events
-- Author: Lead Systems Engineer & Database Engineer Skill
-- Task: TASK-003-analytics-data-layer-and-beacon
-- Description: High-throughput, cookieless B2B analytics event store.
--              Stores visitor traffic, Saudi city geo-data, campaign attribution,
--              and conversion actions in 100% compliance with Saudi PDPL.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    session_id       TEXT NOT NULL,
    event_type       TEXT NOT NULL,
    path             TEXT NOT NULL,
    locale           TEXT DEFAULT 'ar',
    duration_seconds INTEGER DEFAULT 0,
    country          TEXT,
    city             TEXT,
    referrer         TEXT,
    utm_source       TEXT,
    utm_medium       TEXT,
    utm_campaign     TEXT,
    utm_content      TEXT,
    metadata         JSONB DEFAULT '{}'::jsonb
);

-- ------------------------------------------------------------------------------
-- High-Performance Composite & Single-Column Indices
-- ------------------------------------------------------------------------------

-- 1. Index on created_at for fast time-series filtering and dashboard trend charts
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
    ON public.analytics_events (created_at DESC);

-- 2. Index on event_type for funnel analysis (e.g. quote_modal_open, quote_submit)
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
    ON public.analytics_events (event_type);

-- 3. Index on session_id for session-level aggregation and journey pathing
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id
    ON public.analytics_events (session_id);

-- 4. Composite index on country and city for regional Saudi market distribution
CREATE INDEX IF NOT EXISTS idx_analytics_events_geo
    ON public.analytics_events (country, city);

-- 5. Index on utm_campaign for digital marketing ROI and attribution reports
CREATE INDEX IF NOT EXISTS idx_analytics_events_utm_campaign
    ON public.analytics_events (utm_campaign);

-- ------------------------------------------------------------------------------
-- Security & Row-Level Security (RLS) Policies
-- ------------------------------------------------------------------------------

-- Enable RLS to shield analytics data from unauthorized public read/write
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow server-side service role client unrestricted read/write access
CREATE POLICY "Allow service role full access on analytics_events"
    ON public.analytics_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow authenticated dashboard users (admin) to read analytics data
CREATE POLICY "Allow authenticated users to read analytics_events"
    ON public.analytics_events
    FOR SELECT
    TO authenticated
    USING (true);

-- ==============================================================================
-- End of Schema Definition
-- ==============================================================================
