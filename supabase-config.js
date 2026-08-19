const SUPABASE_URL = 'https://uoaumnmzjhcafpbqrdfq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p3C5KIl2zX44E45jUUyjAA_Qc5q5XUJ';

let sb_client = null;
try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        sb_client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.error('Error inicializando Supabase:', e);
}

function sbStripLargeData(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const copy = JSON.parse(JSON.stringify(obj));
    if (copy.personal) copy.personal.photo = '';
    copy.gallery = [];
    return copy;
}

async function sbSave(id, payload) {
    if (!sb_client) return { ok: false, error: 'no client' };
    try {
        const clean = id === 'main' ? sbStripLargeData(payload) : payload;
        const { data, error } = await sb_client
            .from('site_config')
            .upsert({ id, payload: clean, updated_at: new Date().toISOString() }, { onConflict: 'id' });
        if (error) {
            console.error('Supabase save error [' + id + ']:', error.message, error.details);
            return { ok: false, error: error.message };
        }
        return { ok: true };
    } catch (e) {
        console.error('Supabase save exception [' + id + ']:', e);
        return { ok: false, error: e.message };
    }
}

async function sbLoad(id) {
    if (!sb_client) return { ok: false, data: null, error: 'no client' };
    try {
        const { data, error } = await sb_client
            .from('site_config')
            .select('payload')
            .eq('id', id)
            .single();
        if (error) {
            console.error('Supabase load error [' + id + ']:', error.message);
            return { ok: false, data: null, error: error.message };
        }
        return { ok: true, data: data ? data.payload : null };
    } catch (e) {
        console.error('Supabase load exception [' + id + ']:', e);
        return { ok: false, data: null, error: e.message };
    }
}

async function sbDelete(ids) {
    if (!sb_client) return { ok: false, error: 'no client' };
    try {
        const { error } = await sb_client.from('site_config').delete().in('id', ids);
        if (error) {
            console.error('Supabase delete error:', error.message);
            return { ok: false, error: error.message };
        }
        return { ok: true };
    } catch (e) {
        console.error('Supabase delete exception:', e);
        return { ok: false, error: e.message };
    }
}
