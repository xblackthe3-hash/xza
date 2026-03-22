import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpqutgrrvjlhwzbhcqxr.supabase.co';
const supabaseAnonKey = 'sb_publishable_zXBgc-7asWdoMqWV9xYmXg_gC9puFiE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
