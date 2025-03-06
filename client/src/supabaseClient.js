import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fijuztrvrhcpjkcetpgg.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpanV6dHJ2cmhjcGprY2V0cGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMDExNTQsImV4cCI6MjA1Njc3NzE1NH0.Aa8ihz0DPpAc9ugv2ShkCpkUm_k2kd04DMk3pmOJpO8"; // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);