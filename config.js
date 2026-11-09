/* Browser-side public settings only. Never paste service_role / sb_secret / DB passwords here. */
window.KTTM_CONFIG = {
  // Supabase Dashboard > Project Settings > API > Project URL
  supabaseUrl: 'https://rtpluaehwbjdrommtehv.supabase.co',
  // Prefer the Publishable key; legacy anon public key is also accepted.
  supabaseAnonKey: 'sb_publishable_uKW5wAvmX0oy92udiFX2tQ_C1vvp1h-',
  // Optional: set this to your deployed HTTPS website URL, e.g. https://your-site.vercel.app/
  // It must also be listed in Supabase Authentication > URL Configuration > Redirect URLs.
  // Leave blank to use the current page URL (useful for local development).
  authRedirectUrl: 'https://kienthucthapcam.vercel.app',
  // Cloudflare Turnstile SITE key only. Put the SECRET key in Supabase Dashboard.
  turnstileSiteKey: ''
};
