const SUPABASE_URL = 'https://uoaumnmzjhcafpbqrdfq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p3C5KIl2zX44E45jUUyjAA_Qc5q5XUJ';
const sb_client = (typeof supabase !== 'undefined' && supabase.createClient)
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
