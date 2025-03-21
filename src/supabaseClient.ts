import { createClient } from "@supabase/supabase-js";

// Replace with your Supabase project credentials
const SUPABASE_URL = "https://esjajkmgkthczrlyzwry.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzamFqa21na3RoY3pybHl6d3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MzQwMjUsImV4cCI6MjA1ODExMDAyNX0.FpzlUUYrjO7YelaP8icf8J7JvhFEhQk2vys2dxB2mxE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
