/* Kien thuc thap cam - vanilla JS frontend with Supabase Auth and database sync. */
(function () {
  'use strict';
  const app = document.getElementById('app');
  const DATA = window.STUDY_DATA;
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const KEYS = {
    completed: 'kttm_completed_lessons_v2',
    notes: 'kttm_lesson_notes_v1',
    bookmarks: 'kttm_bookmarks_v1',
    timer: 'kttm_timer_v1'
  };
  const SYNC_KEYS = ['kttm_completed_lessons_v2', 'kttm_lesson_notes_v1', 'kttm_bookmarks_v1', 'kttm_timer_v1'];
  const CACHE_OWNER_KEY = 'kttm_cache_owner_v1';
  const CACHE_DIRTY_KEY = 'kttm_cache_dirty_v1';
  const CONFIG = window.KTTM_CONFIG || {};
  let db = null;
  let currentUser = null;
  let currentProfile = null;
  let syncReady = false;
  let syncTimer = null;
  let syncPromise = Promise.resolve();
  let authMode = 'login';
  let adminPosts = [];
  let adminUsers = [];
  let knowledgePosts = [];
  let sessionBootstrapId = null;
  let recoveryPending = false;
  let turnstileToken = null;
  let turnstileWidgetId = null;
  let turnstileLoadPromise = null;
  const VALID_LESSON_IDS = new Set(DATA && Array.isArray(DATA.subjects) ? DATA.subjects.flatMap(subject => (subject.chapters || []).flatMap(chapter => (chapter.lessons || []).map(lesson => String(lesson.id)))) : []);
  if (!app || !DATA || !Array.isArray(DATA.subjects)) {
    if (app) app.innerHTML = '<section class="empty-state">Không tải được dữ liệu. Hãy kiểm tra data.js và thứ tự script trong index.html.</section>';
    return;
  }

  let timerRemaining = 25 * 60;
  let timerDeadline = 0;
  let timerInterval = null;
  let timerRunning = false;

  function readStore(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value == null ? fallback : value; }
    catch (_) { return fallback; }
  }
  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (syncReady && SYNC_KEYS.includes(key)) {
        if (currentUser && localStorage.getItem(CACHE_OWNER_KEY) === currentUser.id) {
          const dirtyVersion = Number(localStorage.getItem(CACHE_DIRTY_KEY) || 0) + 1;
          localStorage.setItem(CACHE_DIRTY_KEY, String(dirtyVersion));
        }
        queueCloudSync();
      }
      return true;
    } catch (_) { return false; }
  }

  function localSnapshot() {
    return {
      user_id: currentUser && currentUser.id,
      completed: getCompleted(),
      bookmarks: getBookmarks(),
      notes: getNotes(),
      timer: sanitizeTimer(readStore(KEYS.timer, null))
    };
  }

  function setSyncStatus(message, isError) {
    const el = document.getElementById('syncStatus');
    if (el) { el.textContent = message || ''; el.classList.toggle('is-error', !!isError); }
  }

  async function flushCloudSync() {
    clearTimeout(syncTimer);
    if (!db || !currentUser || !syncReady) return true;
    // Serialize writes so a slower older request cannot overwrite newer progress.
    syncPromise = syncPromise.catch(() => {}).then(async () => {
      if (!db || !currentUser || !syncReady) return;
      const accountId = currentUser.id;
      const dirtyVersion = localStorage.getItem(CACHE_DIRTY_KEY);
      const payload = localSnapshot();
      const { error } = await db.from('user_data').upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;
      // A newer local edit may have happened while this request was in flight.
      if (currentUser && currentUser.id === accountId && localStorage.getItem(CACHE_DIRTY_KEY) === dirtyVersion) {
        localStorage.removeItem(CACHE_DIRTY_KEY);
      }
    });
    try {
      await syncPromise;
      setSyncStatus('Đã đồng bộ dữ liệu', false);
      return true;
    } catch (error) {
      console.error('Cloud sync failed:', error);
      setSyncStatus('Chưa đồng bộ được. Kiểm tra mạng rồi thử lại.', true);
      return false;
    }
  }

  function queueCloudSync() {
    if (!db || !currentUser || !syncReady) return;
    clearTimeout(syncTimer);
    setSyncStatus('Đang chờ đồng bộ…', false);
    syncTimer = setTimeout(() => { void flushCloudSync(); }, 650);
  }

  async function restoreOrMigrateUserData(userId, allowSameAccountCacheRecovery) {
    const { data, error } = await db.from('user_data')
      .select('completed,bookmarks,notes,timer').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    const hasUnsentSameAccountChanges = allowSameAccountCacheRecovery && !!localStorage.getItem(CACHE_DIRTY_KEY);
    if (data && hasUnsentSameAccountChanges) {
      // Preserve edits made offline by this same UID rather than replacing them
      // with an older cloud snapshot.
      const payload = localSnapshot();
      const { error: saveError } = await db.from('user_data').upsert(payload, { onConflict: 'user_id' });
      if (saveError) throw saveError;
      localStorage.removeItem(CACHE_DIRTY_KEY);
    } else if (data) {
      localStorage.setItem(KEYS.completed, JSON.stringify(sanitizeLessonIdArray(data.completed)));
      localStorage.setItem(KEYS.bookmarks, JSON.stringify(sanitizeLessonIdArray(data.bookmarks)));
      localStorage.setItem(KEYS.notes, JSON.stringify(sanitizeNotes(data.notes)));
      const timer = sanitizeTimer(data.timer);
      if (timer == null) localStorage.removeItem(KEYS.timer);
      else localStorage.setItem(KEYS.timer, JSON.stringify(timer));
    } else if (allowSameAccountCacheRecovery) {
      // A cache is reused only when its recorded owner matches this account.
      const payload = localSnapshot();
      const { error: saveError } = await db.from('user_data').upsert(payload, { onConflict: 'user_id' });
      if (saveError) throw saveError;
      localStorage.removeItem(CACHE_DIRTY_KEY);
    } else {
      // A new/unmatched account starts clean. Never migrate an unowned browser
      // cache: it may belong to a different person who used this device.
      const emptyPayload = { user_id: userId, completed: [], bookmarks: [], notes: {}, timer: null };
      const { error: saveError } = await db.from('user_data').upsert(emptyPayload, { onConflict: 'user_id' });
      if (saveError) throw saveError;
      localStorage.setItem(KEYS.completed, '[]');
      localStorage.setItem(KEYS.bookmarks, '[]');
      localStorage.setItem(KEYS.notes, '{}');
      localStorage.removeItem(KEYS.timer);
    }
    localStorage.setItem(CACHE_OWNER_KEY, userId);
    syncReady = true;
  }

  function updateAccountBar() {
    const nav = document.getElementById('siteNav');
    const bar = document.getElementById('accountBar');
    const email = document.getElementById('accountEmail');
    const adminLink = document.getElementById('adminNavLink');
    if (nav) nav.hidden = !currentUser;
    if (bar) bar.hidden = !currentUser;
    if (email) email.textContent = currentUser ? currentUser.email : '';
    if (adminLink) adminLink.hidden = !currentProfile || currentProfile.role !== 'admin';
    setSyncStatus(currentUser ? 'Đã kết nối tài khoản' : '', false);
  }

  function removeTurnstileWidget() {
    if (turnstileWidgetId !== null && window.turnstile && typeof window.turnstile.remove === 'function') {
      try { window.turnstile.remove(turnstileWidgetId); } catch (_) {}
    }
    turnstileWidgetId = null;
    turnstileToken = null;
  }
  function loadTurnstile() {
    if (window.turnstile && typeof window.turnstile.render === 'function') return Promise.resolve();
    if (turnstileLoadPromise) return turnstileLoadPromise;
    turnstileLoadPromise = new Promise((resolve, reject) => {
      let script = document.querySelector('script[data-kttm-turnstile]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.kttmTurnstile = 'true';
        document.head.appendChild(script);
      }
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error('CAPTCHA_LOAD_FAILED')), { once: true });
      if (window.turnstile) resolve();
    });
    return turnstileLoadPromise;
  }
  async function mountTurnstile() {
    if (!CONFIG.turnstileSiteKey || authMode === 'update-password') return;
    const target = document.getElementById('turnstileWidget');
    if (!target) return;
    try {
      await loadTurnstile();
      if (!document.body.contains(target) || !window.turnstile) return;
      turnstileWidgetId = window.turnstile.render(target, {
        sitekey: CONFIG.turnstileSiteKey,
        callback: token => { turnstileToken = token; },
        'expired-callback': () => { turnstileToken = null; },
        'error-callback': () => { turnstileToken = null; }
      });
    } catch (error) {
      turnstileLoadPromise = null;
      const failedScript = document.querySelector('script[data-kttm-turnstile]');
      if (failedScript && !window.turnstile) failedScript.remove();
      console.error('Turnstile loading failed:', error);
      target.textContent = 'Không tải được xác minh bảo mật. Hãy tải lại trang.';
    }
  }
  function captchaOptions() {
    if (!CONFIG.turnstileSiteKey) return {};
    if (!turnstileToken) throw new Error('CAPTCHA_REQUIRED');
    const token = turnstileToken;
    turnstileToken = null;
    return { captchaToken: token };
  }

  function renderAuth(mode, message, isError) {
    removeTurnstileWidget();
    authMode = mode || authMode || 'login';
    updateAccountBar();
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || !window.supabase || !window.supabase.createClient) {
      app.innerHTML = `<section class="auth-layout"><div class="auth-aside"><div class="auth-aside-mark">📚</div><p class="eyebrow">KHÔNG GIAN HỌC TẬP CỦA BẠN</p><h1>Học có hệ thống.<br>Tiến bộ mỗi ngày.</h1><p>Ghi chú, đánh dấu bài học và tiếp tục học ở bất kỳ thiết bị nào.</p></div><section class="auth-card"><div class="auth-logo">📚</div><p class="eyebrow">KIẾN THỨC THẬP CẨM</p><h2>Website chưa kết nối</h2><p class="auth-subtitle">Điền Project URL và Publishable key trong <code>config.js</code>, sau đó chạy SQL bảo mật đi kèm trên Supabase.</p><div class="auth-notice">Chỉ đặt Publishable/anon key trong trình duyệt. Không bao giờ đưa Service Role hoặc Secret key vào website.</div></section></section>`;
      return;
    }
    const signup = authMode === 'signup';
    const forgot = authMode === 'forgot';
    const updatingPassword = authMode === 'update-password';
    const title = signup ? 'Tạo tài khoản' : forgot ? 'Đặt lại mật khẩu' : updatingPassword ? 'Tạo mật khẩu mới' : 'Chào mừng trở lại';
    const subtitle = signup ? 'Tạo tài khoản để lưu tiến độ và học trên mọi thiết bị.' : forgot ? 'Nhập email đã đăng ký. Nếu tài khoản phù hợp, hướng dẫn sẽ được gửi đến hộp thư.' : updatingPassword ? 'Chọn mật khẩu mới cho tài khoản của bạn.' : 'Đăng nhập để tiếp tục hành trình học tập.';
    const captchaMarkup = CONFIG.turnstileSiteKey && !updatingPassword ? '<div id="turnstileWidget" class="turnstile-slot" aria-label="Xác minh bảo mật"></div>' : '';
    const fields = updatingPassword
      ? `<label for="authPassword">Mật khẩu mới</label><input id="authPassword" name="password" type="password" class="text-field" autocomplete="new-password" required minlength="6" maxlength="128" placeholder="Tối thiểu 6 ký tự"><p class="muted-note">Mật khẩu từ 8–12 ký tự trở lên sẽ an toàn hơn; không dùng lại mật khẩu ở dịch vụ khác.</p>`
      : `<label for="authEmail">Địa chỉ email</label><input id="authEmail" name="email" type="email" class="text-field" autocomplete="email" required maxlength="254" placeholder="ten@email.com">${forgot ? '' : `<label for="authPassword">Mật khẩu</label><input id="authPassword" name="password" type="password" class="text-field" autocomplete="${signup ? 'new-password' : 'current-password'}" required minlength="6" maxlength="128" placeholder="Tối thiểu 6 ký tự"><p class="muted-note">Mật khẩu tối thiểu 6 ký tự theo cấu hình. Khuyến nghị 8–12 ký tự trở lên và không dùng lại mật khẩu cũ.</p>`}`;
    const captchaSetupNotice = !CONFIG.turnstileSiteKey && !updatingPassword
      ? '<p class="muted-note auth-captcha-note">Đang ở chế độ thử nghiệm: CAPTCHA chưa được cấu hình. Hãy bật Cloudflare Turnstile trong Supabase trước khi mở đăng ký công khai.</p>' : '';
    app.innerHTML = `<section class="auth-layout"><div class="auth-aside"><div class="auth-aside-mark">📚</div><p class="eyebrow">KHÔNG GIAN HỌC TẬP CỦA BẠN</p><h1>Học có hệ thống.<br>Tiến bộ mỗi ngày.</h1><p>Hệ thống bài học, công cụ ôn tập và ghi chú cá nhân được đồng bộ an toàn theo tài khoản.</p><div class="auth-benefits"><span>☁️ Đồng bộ đa thiết bị</span><span>✍️ Ghi chú riêng tư</span><span>🎯 Theo dõi tiến độ</span></div><div class="auth-orbit" aria-hidden="true">✦</div></div><section class="auth-card"><div class="auth-logo">📚</div><p class="eyebrow">KIẾN THỨC THẬP CẨM</p><h2>${title}</h2><p class="auth-subtitle">${subtitle}</p>${message ? `<div class="auth-notice ${isError ? 'error' : ''}" role="status">${escapeHTML(message)}</div>` : ''}
      <form id="authForm" class="auth-form">${fields}${captchaMarkup}<button class="primary-button auth-submit" type="submit">${signup ? 'Tạo tài khoản' : forgot ? 'Gửi hướng dẫn đặt lại' : updatingPassword ? 'Lưu mật khẩu mới' : 'Đăng nhập'}</button></form>${captchaSetupNotice}
      <div class="auth-links">${updatingPassword ? '<span class="muted-note">Đổi mật khẩu sẽ kết thúc phiên khôi phục hiện tại.</span>' : forgot ? '<button class="auth-switch" id="authModeToggle" type="button">← Quay lại đăng nhập</button>' : signup ? '<button class="auth-switch" id="authModeToggle" type="button">Đã có tài khoản? Đăng nhập</button>' : '<button class="auth-switch" id="authModeToggle" type="button">Chưa có tài khoản? Đăng ký</button><button class="auth-switch" id="forgotPasswordButton" type="button">Quên mật khẩu?</button><button class="auth-switch" id="resendConfirmationButton" type="button">Chưa nhận được email xác nhận? Gửi lại</button>'}</div>
      <p class="auth-footnote">Mỗi tài khoản chỉ truy cập được dữ liệu học tập của chính mình. Quản trị viên không xem được mật khẩu của người dùng.</p></section></section>`;
    const form = document.getElementById('authForm');
    const toggle = document.getElementById('authModeToggle');
    const forgotButton = document.getElementById('forgotPasswordButton');
    const resendConfirmationButton = document.getElementById('resendConfirmationButton');
    if (toggle) toggle.addEventListener('click', () => renderAuth(forgot ? 'login' : signup ? 'login' : 'signup'));
    if (forgotButton) forgotButton.addEventListener('click', () => renderAuth('forgot'));
    if (resendConfirmationButton) resendConfirmationButton.addEventListener('click', async () => {
      const email = (document.getElementById('authEmail')?.value || '').trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        renderAuth('login', 'Hãy nhập địa chỉ email hợp lệ vào ô email trước.', true);
        return;
      }
      resendConfirmationButton.disabled = true;
      resendConfirmationButton.textContent = 'Đang gửi…';
      try {
        const emailRedirectTo = (typeof CONFIG.authRedirectUrl === 'string' && CONFIG.authRedirectUrl.trim())
          ? CONFIG.authRedirectUrl.trim()
          : `${window.location.origin}${window.location.pathname}`;
        const { error } = await db.auth.resend({
          type: 'signup',
          email,
          options: { ...captchaOptions(), emailRedirectTo }
        });
        if (error) throw error;
        renderAuth('login', 'Nếu email này có yêu cầu xác nhận đang chờ, Supabase sẽ gửi lại thư. Hãy mở email mới nhất.', false);
      } catch (error) {
        if (window.turnstile && turnstileWidgetId !== null) { try { window.turnstile.reset(turnstileWidgetId); } catch (_) {} }
        turnstileToken = null;
        renderAuth('login', authErrorMessage(error), true);
      }
    });
    if (form) form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailField = document.getElementById('authEmail');
      const passwordField = document.getElementById('authPassword');
      const email = emailField ? emailField.value.trim().toLowerCase() : '';
      const password = passwordField ? passwordField.value : '';
      const submit = form.querySelector('button[type="submit"]');
      if ((signup || updatingPassword) && password.length < 6) { renderAuth(authMode, 'Mật khẩu phải có ít nhất 6 ký tự.', true); return; }
      submit.disabled = true;
      submit.textContent = 'Đang xử lý…';
      try {
        if (signup) {
          const emailRedirectTo = (typeof CONFIG.authRedirectUrl === 'string' && CONFIG.authRedirectUrl.trim())
            ? CONFIG.authRedirectUrl.trim()
            : `${window.location.origin}${window.location.pathname}`;
          const { data, error } = await db.auth.signUp({
            email,
            password,
            options: { ...captchaOptions(), emailRedirectTo }
          });
          if (error) throw error;
          if (!data.session) renderAuth('login', 'Yêu cầu đăng ký đã được tiếp nhận. Kiểm tra email để xác nhận tài khoản rồi đăng nhập.', false);
          else renderAuth('login', 'Tài khoản đã được tạo. Đang tải dữ liệu…', false);
        } else if (forgot) {
          const redirectTo = `${window.location.origin}${window.location.pathname}#reset-password`;
          const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo, ...captchaOptions() });
          if (error) throw error;
          renderAuth('login', 'Nếu địa chỉ email hợp lệ, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư.', false);
        } else if (updatingPassword) {
          const { error } = await db.auth.updateUser({ password });
          if (error) throw error;
          recoveryPending = false;
          await db.auth.signOut();
          renderAuth('login', 'Mật khẩu đã được cập nhật. Hãy đăng nhập bằng mật khẩu mới.', false);
        } else {
          const { error } = await db.auth.signInWithPassword({ email, password, options: captchaOptions() });
          if (error) throw error;
        }
      } catch (error) {
        if (window.turnstile && turnstileWidgetId !== null) { try { window.turnstile.reset(turnstileWidgetId); } catch (_) {} }
        turnstileToken = null;
        renderAuth(authMode, authErrorMessage(error), true);
      }
    });
    void mountTurnstile();
  }

  function authErrorMessage(error) {
    const message = String(error && error.message || '');
    if (/CAPTCHA_REQUIRED/i.test(message)) return 'Hãy hoàn thành bước xác minh bảo mật trước khi gửi biểu mẫu.';
    if (/CAPTCHA_LOAD_FAILED/i.test(message)) return 'Không tải được xác minh bảo mật. Kiểm tra kết nối rồi thử lại.';
    if (/password should be at least|weak password/i.test(message)) return 'Mật khẩu chưa đạt yêu cầu bảo mật của máy chủ.';
    if (/failed to fetch|network/i.test(message)) return 'Không kết nối được máy chủ. Kiểm tra mạng và cấu hình Supabase.';
    if (/rate limit|too many requests/i.test(message)) return 'Bạn thao tác quá nhanh. Hãy đợi một lúc rồi thử lại.';
    // Do not echo raw Auth errors or reveal whether an email exists.
    return 'Thao tác chưa thành công. Kiểm tra thông tin, xác nhận email hoặc dùng chức năng đặt lại mật khẩu.';
  }

  async function bootstrapSession(session) {
    if (recoveryPending) return;
    if (!session || !session.user) {
      // No authenticated owner is known. Never keep an unscoped cache that a
      // different account could accidentally migrate on its first sign-in.
      if (!localStorage.getItem(CACHE_OWNER_KEY)) clearLocalAccountCache();
      else { stopTimer(); timerRunning = false; }
      currentUser = null; currentProfile = null; syncReady = false; sessionBootstrapId = null;
      updateAccountBar();
      if (route()[0] === 'privacy') renderPrivacy(); else renderAuth('login');
      return;
    }
    if (sessionBootstrapId === session.user.id) return;
    const cachedOwner = localStorage.getItem(CACHE_OWNER_KEY);
    const canReuseAccountCache = cachedOwner === session.user.id;
    if ((currentUser && currentUser.id !== session.user.id) || !canReuseAccountCache) clearLocalAccountCache();
    sessionBootstrapId = session.user.id;
    syncReady = false;
    currentUser = session.user;
    try {
      const { data: profile, error } = await db.from('profiles')
        .select('id,email,role,is_active,created_at').eq('id', currentUser.id).single();
      if (error) throw error;
      if (!profile || !profile.is_active) {
        await db.auth.signOut();
        clearLocalAccountCache();
        currentUser = null; currentProfile = null; sessionBootstrapId = null; syncReady = false;
        renderAuth('login', 'Tài khoản hiện đang bị tạm khóa. Hãy liên hệ quản trị viên.', true);
        return;
      }
      currentProfile = profile;
      await restoreOrMigrateUserData(currentUser.id, canReuseAccountCache);
      await loadPublicKnowledgeCache();
      updateAccountBar();
      renderCurrentRoute();
    } catch (error) {
      console.error('Account bootstrap failed:', error);
      // Keep a cache only when its stored owner UID matches this failed session.
      // An unowned or mismatched cache is never kept for another account.
      const failedUserId = currentUser && currentUser.id;
      if (!failedUserId || localStorage.getItem(CACHE_OWNER_KEY) !== failedUserId) clearLocalAccountCache();
      else { stopTimer(); timerRunning = false; }
      currentUser = null; currentProfile = null; sessionBootstrapId = null; syncReady = false;
      await db.auth.signOut();
      renderAuth('login', 'Chưa kết nối được hồ sơ hoặc dữ liệu tài khoản. Kiểm tra cấu hình Supabase / RLS và thử đăng nhập lại. ' + authErrorMessage(error), true);
    }
  }

  function clearLocalAccountCache() {
    // Stop callbacks before clearing storage so a timer from account A cannot
    // recreate account A's cache after account B signs in.
    stopTimer();
    timerRunning = false;
    timerDeadline = 0;
    timerRemaining = 25 * 60;
    SYNC_KEYS.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('kttm_completed_lessons_v1');
    localStorage.removeItem(CACHE_OWNER_KEY);
    localStorage.removeItem(CACHE_DIRTY_KEY);
  }

  async function loadPublicKnowledgeCache() {
    const { data, error } = await db.from('knowledge_posts')
      .select('id,title,category,body,tips,examples,source_url,created_at')
      .eq('is_published', true).order('created_at', { ascending: false });
    if (error) throw error;
    knowledgePosts = data || [];
  }

  async function initializeAuth() {
    if (String(window.location.hash || '').includes('type=recovery')) recoveryPending = true;
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || !window.supabase || !window.supabase.createClient) {
      renderAuth('login'); return;
    }
    // Use tab-scoped storage instead of leaving Auth tokens in localStorage.
    // Same-origin JavaScript can still read sessionStorage; a server-side BFF
    // with HttpOnly cookies is the stronger production architecture.
    try {
      const projectRef = new URL(CONFIG.supabaseUrl).hostname.split('.')[0];
      if (projectRef) localStorage.removeItem(`sb-${projectRef}-auth-token`);
    } catch (_) {}
    db = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.sessionStorage,
        storageKey: 'kttm-auth-session-v1'
      }
    });
    db.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        recoveryPending = true;
        setTimeout(() => { authMode = 'update-password'; renderAuth('update-password'); }, 0);
        return;
      }
      setTimeout(() => bootstrapSession(session), 0);
    });
    const { data, error } = await db.auth.getSession();
    if (error) { renderAuth('login', authErrorMessage(error), true); return; }
    if (data.session && !recoveryPending) await bootstrapSession(data.session);
    else if (!data.session) { if (!localStorage.getItem(CACHE_OWNER_KEY)) clearLocalAccountCache(); if (route()[0] === 'privacy') renderPrivacy(); else renderAuth('login'); }
  }
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }
  function safeExternalUrl(value) {
    try {
      const url = new URL(String(value || ''));
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
    } catch (_) { return ''; }
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
  }
  function sanitizeLessonIdArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(id => typeof id === 'string' && id.length <= 120 && VALID_LESSON_IDS.has(id)))].slice(0, 2000);
  }
  function sanitizeNotes(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const clean = {};
    Object.entries(value).slice(0, 2000).forEach(([id, note]) => {
      if (VALID_LESSON_IDS.has(id) && typeof note === 'string') clean[id] = note.slice(0, 8000);
    });
    return clean;
  }
  function sanitizeTimer(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const remaining = Number(value.remaining);
    const running = value.running === true;
    const deadline = Number(value.deadline);
    if (!Number.isFinite(remaining) || remaining < 0 || remaining > 10800) return null;
    return { remaining: Math.floor(remaining), running, deadline: Number.isFinite(deadline) ? deadline : 0 };
  }

  function getCompleted() {
    const current = readStore(KEYS.completed, null);
    if (Array.isArray(current)) return sanitizeLessonIdArray(current);
    // Migrate progress saved by the original website version.
    const legacy = readStore('kttm_completed_lessons_v1', []);
    const migrated = Array.isArray(legacy) ? legacy : [];
    writeStore(KEYS.completed, migrated);
    return sanitizeLessonIdArray(migrated);
  }
  function getBookmarks() { return sanitizeLessonIdArray(readStore(KEYS.bookmarks, [])); }
  function getNotes() { return sanitizeNotes(readStore(KEYS.notes, {})); }
  function allLessons(subject) { return (subject.chapters || []).flatMap(ch => ch.lessons || []); }
  function allEntries() {
    return DATA.subjects.flatMap(subject => (subject.chapters || []).flatMap(chapter => (chapter.lessons || []).map(lesson => ({subject, chapter, lesson}))));
  }
  function totalLessons() { return allEntries().length; }
  function totalChapters() { return DATA.subjects.reduce((n, s) => n + (s.chapters || []).length, 0); }
  function progress(subject) {
    const lessons = allLessons(subject), done = getCompleted();
    const count = lessons.filter(x => done.includes(x.id)).length;
    return {done: count, total: lessons.length, percent: lessons.length ? Math.round(count / lessons.length * 100) : 0};
  }
  function findSubject(id) { return DATA.subjects.find(x => x.id === id); }
  function findLesson(subject, id) {
    for (const chapter of subject.chapters || []) {
      const lesson = (chapter.lessons || []).find(x => x.id === id);
      if (lesson) return {lesson, chapter};
    }
    return null;
  }
  function route() {
    try { return (location.hash || '#home').slice(1).split('/').map(decodeURIComponent); }
    catch (_) { return ['home']; }
  }
  function list(items, emptyText) {
    return Array.isArray(items) && items.length
      ? `<ul>${items.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ul>`
      : `<p class="muted-note">${escapeHTML(emptyText)}</p>`;
  }
  function renderHome() {
    const completed = getCompleted();
    const cards = DATA.subjects.map(subject => {
      const p = progress(subject);
      return `<a class="subject-card" href="#subject/${encodeURIComponent(subject.id)}" style="--subject-tint:${escapeHTML(subject.color || '#2563eb')}18">
        <span class="subject-icon">${escapeHTML(subject.icon)}</span><strong>${escapeHTML(subject.name)}</strong>
        <small>${subject.chapters.length} ${escapeHTML((subject.unitLabel || 'chủ đề').toLowerCase())} · ${allLessons(subject).length} bài</small>
        <span class="mini-progress"><i style="width:${p.percent}%"></i></span><span class="card-arrow">${p.done}/${p.total} bài hoàn thành · Mở môn →</span>
      </a>`;
    }).join('');
    const recent = allEntries().filter(x => completed.includes(x.lesson.id)).slice(-5).reverse();
    app.innerHTML = `
      <section class="hero"><div class="hero-content"><p class="eyebrow">GÓC HỌC TẬP LỚP 12 · NĂM HỌC 2026–2027</p>
        <h1>Học dễ hiểu – Nhớ lâu – Thi hiệu quả</h1>
        <p>Tra cứu bài học, lưu ghi chú, đánh dấu tiến độ và sử dụng công cụ ôn tập trên cùng một nơi.</p>
        <div class="hero-points"><span>📚 Kết nối tri thức</span><span>🔎 Tìm kiếm thông minh</span><span>📱 Tối ưu điện thoại</span><span>☁️ Đồng bộ tài khoản</span></div><a class="hero-cta" href="#subject/toan">Bắt đầu học ngay <span aria-hidden="true">→</span></a></div><div class="hero-decor" aria-hidden="true"><span>✦</span><span>✧</span><span>◎</span></div></section>
      <section class="search-panel"><div class="search-wrap"><label for="globalSearch">Tìm môn, chương, bài hoặc từ khóa kiến thức</label><span class="search-icon" aria-hidden="true">⌕</span>
        <input class="search-input" id="globalSearch" type="search" autocomplete="off" placeholder="Ví dụ: đạo hàm, DNA, ester, CSS…"></div><div class="search-results" id="searchResults" aria-live="polite"></div></section>
      <div class="stats-grid"><div class="stat-card"><span class="stat-icon">🎓</span><div><strong>${DATA.subjects.length}</strong><span>Môn học</span></div></div><div class="stat-card"><span class="stat-icon">🗂️</span><div><strong>${totalChapters()}</strong><span>Chương / chủ đề</span></div></div><div class="stat-card"><span class="stat-icon">📖</span><div><strong>${totalLessons()}</strong><span>Bài trong mục lục</span></div></div></div>
      <section><div class="section-heading"><div><h2>📚 Chọn môn học</h2><p>Theo danh mục môn học hiện có trong dự án.</p></div></div><div class="subject-grid">${cards}</div></section>
      <section><div class="section-heading"><div><h2>🧭 Khu vực học tập</h2><p>Các công cụ hỗ trợ ôn tập và quản lý việc học.</p></div></div>
        <div class="feature-grid"><a class="feature-card feature-link" href="#tools"><span class="feature-icon">🧮</span><h3>Công cụ học tập</h3><p>Tính điểm, đồng hồ tập trung.</p></a>
        <a class="feature-card feature-link" href="#bookmarks"><span class="feature-icon">🔖</span><h3>Bài đã lưu</h3><p>Mở nhanh những bài cần ôn lại.</p></a>
        <a class="feature-card feature-link" href="#progress"><span class="feature-icon">📈</span><h3>Tiến độ học</h3><p>Theo dõi bài đã hoàn thành theo môn.</p></a>
        <a class="feature-card feature-link" href="#knowledge"><span class="feature-icon">💡</span><h3>Kiến thức mới</h3><p>${knowledgePosts.length} bài viết và mẹo học bổ sung.</p></a></div></section>
      ${recent.length ? `<section><div class="section-heading"><div><h2>✅ Học gần đây</h2></div></div><div class="recent-list">${recent.map(x => `<a class="search-result" href="#lesson/${x.subject.id}/${x.lesson.id}">${escapeHTML(x.lesson.title)}<small>${escapeHTML(x.subject.name)}</small></a>`).join('')}</div></section>` : ''}
      <p class="note-box">Tiến độ, ghi chú và bài đã lưu được đồng bộ với tài khoản của bạn để tiếp tục học trên thiết bị khác.</p>`;
  }
  function renderSubject(subject) {
    const p = progress(subject), completed = getCompleted();
    const chapters = subject.chapters.map((chapter, i) => `<details class="chapter-card" ${i === 0 ? 'open' : ''}><summary><span class="chapter-title">${escapeHTML(chapter.title)}${chapter.volume ? `<span class="chapter-meta">${escapeHTML(chapter.volume)}</span>` : ''}</span><span class="chapter-meta">${(chapter.lessons || []).length} bài</span></summary><div class="lesson-list">${(chapter.lessons || []).map(lesson => `<a class="lesson-link" href="#lesson/${subject.id}/${lesson.id}"><span class="lesson-number">${escapeHTML(lesson.number)}</span><span class="lesson-name">${escapeHTML(lesson.title)}</span><span class="lesson-status">${completed.includes(lesson.id) ? '✓' : '›'}</span></a>`).join('')}</div></details>`).join('');
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card" style="--subject-tint:${escapeHTML(subject.color || '#2563eb')}18"><div class="page-title-row"><span class="page-title-icon">${escapeHTML(subject.icon)}</span><div><h1>${escapeHTML(subject.name)}</h1><p>${escapeHTML(subject.textbook || '')}</p></div></div><p>${escapeHTML(subject.description || '')}</p><div class="subject-progress"><div class="progress-line"><span style="width:${p.percent}%"></span></div><div class="progress-caption"><span>Tiến độ tài khoản</span><span>${p.done}/${p.total} bài · ${p.percent}%</span></div></div></section><div class="section-heading"><div><h2>📑 ${escapeHTML(subject.unitLabel || 'Chương')} và bài học</h2><p>Chọn bài để xem nội dung ôn tập, ghi chú và đánh dấu tiến độ.</p></div></div><section class="chapter-list">${chapters}</section>`;
  }
  function renderLesson(subject, found) {
    const {lesson, chapter} = found, lessons = allLessons(subject), idx = lessons.findIndex(x => x.id === lesson.id);
    const previous = lessons[idx - 1], next = lessons[idx + 1], completed = getCompleted(), saved = getBookmarks().includes(lesson.id);
    const content = lesson.content || {}, notes = getNotes();
    const summary = content.summary || 'Nội dung chi tiết của bài này chưa được đối chiếu và biên soạn đầy đủ từ bản SGK 2026. Phần dưới đây là khung học tập để bạn ghi chú, không thay thế nội dung sách giáo khoa.';
    const quality = content.verified ? '<span class="content-status verified">Đã đối chiếu nguồn</span>' : '<span class="content-status pending">Cần đối chiếu SGK</span>';
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#subject/${subject.id}">← ${escapeHTML(subject.name)}</a><span class="chapter-meta">/ ${escapeHTML(chapter.title)}</span></div>
      <article class="lesson-article"><section class="lesson-intro"><div class="lesson-label">${escapeHTML(subject.name)} · ${escapeHTML(subject.unitLabel || 'Bài')} · Bài ${escapeHTML(lesson.number)}</div><h1>${escapeHTML(lesson.title)}</h1><p>${escapeHTML(chapter.title)}${chapter.volume ? ' · ' + escapeHTML(chapter.volume) : ''}</p><div class="lesson-actions"><button class="done-button ${completed.includes(lesson.id) ? 'is-done' : ''}" data-action="toggle-done" data-id="${lesson.id}">${completed.includes(lesson.id) ? '✓ Đã hoàn thành' : '○ Đánh dấu đã học'}</button><button class="secondary-button" data-action="bookmark" data-id="${lesson.id}">${saved ? '★ Đã lưu bài' : '☆ Lưu bài này'}</button><button class="secondary-button" data-action="copy-title" data-copy="${escapeHTML(lesson.title)}">Sao chép tên bài</button></div></section>
      <div class="content-grid"><section class="content-card"><h2>🎯 Kiến thức trọng tâm</h2>${quality}<p>${escapeHTML(summary)}</p>${list(content.keyPoints, 'Các ý kiến thức cụ thể cần được đối chiếu với SGK trước khi công bố.')}</section>
      <section class="content-card"><h2>🧮 Công thức / Sơ đồ</h2>${list(content.formulas, 'Bài này chưa có công thức hoặc sơ đồ đã được xác minh.')}</section>
      <section class="content-card"><h2>💡 Mẹo ghi nhớ</h2>${list(content.tips, 'Chia bài thành các ý nhỏ; tự giải thích lại bằng lời của mình; kiểm tra từng khái niệm bằng ví dụ.')}</section>
      <section class="content-card"><h2>✍️ Ví dụ minh họa</h2>${list(content.examples, 'Ví dụ chuẩn và lời giải đang chờ biên soạn, kiểm tra.')}</section>
      <section class="content-card"><h2>✅ Tự kiểm tra</h2>${list(content.selfCheck, 'Hãy tự đặt câu hỏi: khái niệm chính là gì, điều kiện áp dụng ra sao, có ví dụ hoặc trường hợp ngoại lệ nào?')}</section>
      <section class="content-card"><h2>📌 Nguồn và mức độ kiểm chứng</h2><p>${escapeHTML(content.source || 'Chưa gắn nguồn SGK cụ thể cho bài này.')}</p><p class="muted-note">Không sử dụng nội dung chưa kiểm chứng như đáp án chính thức.</p></section></div>
      <section class="content-card notes-card"><h2>📝 Ghi chú cá nhân</h2><textarea id="lessonNotes" class="text-field notes-field" rows="5" maxlength="8000" placeholder="Ghi công thức, câu hỏi hoặc phần bạn cần ôn lại…">${escapeHTML(notes[lesson.id] || '')}</textarea><div class="lesson-actions"><button class="primary-button" data-action="save-note" data-id="${lesson.id}">Lưu ghi chú</button><span id="noteStatus" class="muted-note" aria-live="polite"></span></div></section>
      <div class="note-box">Nguồn học tập chính: SGK Kết nối tri thức với cuộc sống và tài liệu chính thức của Bộ GDĐT. Mẹo học là nội dung hỗ trợ, không phải quy định trong SGK.</div>
      <nav class="lesson-navigation">${previous ? `<a href="#lesson/${subject.id}/${previous.id}"><span>← Bài trước</span>${escapeHTML(previous.title)}</a>` : `<a href="#subject/${subject.id}"><span>← Quay lại</span>Danh sách bài</a>`}${next ? `<a href="#lesson/${subject.id}/${next.id}" style="text-align:right"><span>Bài tiếp theo →</span>${escapeHTML(next.title)}</a>` : `<a href="#subject/${subject.id}" style="text-align:right"><span>Đã đến bài cuối</span>Về danh sách →</a>`}</nav></article>`;
  }
  function renderTools() {
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card"><div class="page-title-row"><span class="page-title-icon">🧰</span><div><h1>Công cụ học tập</h1><p>Tiện ích hỗ trợ học tập, không thay thế quy định đánh giá của nhà trường.</p></div></div></section><div class="tools-grid">
      <section class="tool-card"><h2>🧮 Tính trung bình có trọng số</h2><p>Nhập điểm và trọng số tương ứng. Bỏ trống trọng số để tính trung bình cộng.</p><label class="field-label" for="scoresInput">Điểm (0–10)</label><input class="text-field" id="scoresInput" inputmode="decimal" placeholder="Ví dụ: 8; 7,5; 9"><label class="field-label" for="weightsInput">Trọng số (tùy chọn)</label><input class="text-field" id="weightsInput" inputmode="decimal" placeholder="Ví dụ: 1; 2; 3"><button class="primary-button" id="calculateButton">Tính điểm</button><div class="result-box" id="averageResult" aria-live="polite">Kết quả sẽ hiển thị tại đây.</div><p class="muted-note">Đây là phép tính theo trọng số bạn nhập, không khẳng định là cách tính điểm chính thức.</p></section>
      <section class="tool-card"><h2>⏱️ Đồng hồ tập trung</h2><p>Đồng hồ tiếp tục đếm chính xác theo mốc thời gian, kể cả khi trình duyệt tạm ngưng cập nhật.</p><label class="field-label" for="timerMinutes">Thời lượng (1–180 phút)</label><input class="text-field" id="timerMinutes" type="number" min="1" max="180" value="25"><div class="timer-display" id="timerDisplay">25:00</div><div class="timer-actions"><button class="primary-button" id="timerStart">Bắt đầu / Tiếp tục</button><button class="secondary-button" id="timerPause">Tạm dừng</button><button class="secondary-button" id="timerReset">Đặt lại</button></div><div class="result-box" id="timerStatus" aria-live="polite">Sẵn sàng bắt đầu.</div></section></div>`;
    bindScoreCalculator(); bindTimer();
  }
  function parseNumberList(text) {
    return text.split(/[;\s]+/).filter(Boolean).map(token => Number(token.replace(',', '.')));
  }
  function bindScoreCalculator() {
    const button = document.getElementById('calculateButton'); if (!button) return;
    button.addEventListener('click', () => {
      const result = document.getElementById('averageResult');
      const rawScores = document.getElementById('scoresInput').value.trim();
      const rawWeights = document.getElementById('weightsInput').value.trim();
      // Semicolon/space separates values so Vietnamese decimal commas remain valid.
      const scores = parseNumberList(rawScores);
      const weights = rawWeights ? parseNumberList(rawWeights) : scores.map(() => 1);
      if (!scores.length || scores.some(n => !Number.isFinite(n) || n < 0 || n > 10)) { result.textContent = 'Nhập ít nhất một điểm hợp lệ từ 0 đến 10. Dùng dấu ; để ngăn cách khi viết số thập phân bằng dấu phẩy.'; return; }
      if (weights.length !== scores.length || weights.some(n => !Number.isFinite(n) || n <= 0)) { result.textContent = 'Số trọng số phải bằng số điểm và mỗi trọng số phải lớn hơn 0.'; return; }
      const sumW = weights.reduce((a,b) => a+b, 0), average = scores.reduce((a,n,i) => a+n*weights[i], 0) / sumW;
      result.textContent = `Kết quả: ${average.toLocaleString('vi-VN', {minimumFractionDigits: 0, maximumFractionDigits: 2})}/10 · Tổng trọng số: ${sumW}`;
    });
  }
  function formatTime(s) { return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }
  function updateTimer() {
    if (timerRunning) timerRemaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
    const display = document.getElementById('timerDisplay'); if (display) display.textContent = formatTime(timerRemaining);
    if (timerRunning && timerRemaining <= 0) {
      timerRunning = false; clearInterval(timerInterval); timerInterval = null;
      const status = document.getElementById('timerStatus'); if (status) status.textContent = 'Đã hết thời gian. Nghỉ ngắn hoặc bắt đầu phiên mới nhé.';
      writeStore(KEYS.timer, {remaining: 0, running: false});
    }
  }
  function stopTimer() { if (timerInterval) clearInterval(timerInterval); timerInterval = null; }
  function bindTimer() {
    const input = document.getElementById('timerMinutes'), start = document.getElementById('timerStart'), pause = document.getElementById('timerPause'), reset = document.getElementById('timerReset'), status = document.getElementById('timerStatus');
    if (!input || !start || !pause || !reset || !status) return;
    const saved = readStore(KEYS.timer, null);
    if (saved && Number.isFinite(saved.remaining)) { timerRemaining = saved.running && saved.deadline ? Math.max(0, Math.ceil((saved.deadline-Date.now())/1000)) : saved.remaining; }
    function validMinutes() { const n = Number(input.value); if (!Number.isInteger(n) || n < 1 || n > 180) { status.textContent = 'Thời lượng phải là số nguyên từ 1 đến 180 phút.'; return null; } return n; }
    function persist() { writeStore(KEYS.timer, {remaining: timerRemaining, running: timerRunning, deadline: timerDeadline}); }
    start.addEventListener('click', () => {
      if (timerRunning) return;
      if (timerRemaining <= 0) { const n = validMinutes(); if (!n) return; timerRemaining = n*60; }
      else if (timerRemaining === 25*60 && input.value !== '25') { const n = validMinutes(); if (!n) return; timerRemaining = n*60; }
      timerRunning = true; timerDeadline = Date.now() + timerRemaining*1000; status.textContent = 'Đồng hồ đang chạy.'; stopTimer(); timerInterval = setInterval(updateTimer, 250); persist(); updateTimer();
    });
    pause.addEventListener('click', () => { if (!timerRunning) return; updateTimer(); timerRunning = false; stopTimer(); status.textContent = 'Đã tạm dừng.'; persist(); });
    reset.addEventListener('click', () => { const n = validMinutes(); if (!n) return; timerRunning = false; stopTimer(); timerRemaining = n*60; status.textContent = 'Đã đặt lại đồng hồ.'; persist(); updateTimer(); });
    input.addEventListener('change', () => { if (timerRunning) return; const n = validMinutes(); if (n) { timerRemaining = n*60; persist(); updateTimer(); } });
    if (saved && saved.running && timerRemaining > 0) { timerRunning = true; timerDeadline = saved.deadline || (Date.now()+timerRemaining*1000); status.textContent = 'Đồng hồ đang chạy (được khôi phục).'; timerInterval = setInterval(updateTimer, 250); }
    updateTimer();
  }
  function renderProgress() {
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card"><h1>📈 Tiến độ học tập</h1><p>Dữ liệu được đồng bộ với tài khoản đang đăng nhập.</p><div class="lesson-actions"><button class="secondary-button" data-action="export-progress">Xuất dữ liệu học tập</button><button class="secondary-button" data-action="import-progress">Nhập dữ liệu học tập</button><input id="importFile" type="file" accept="application/json" hidden></div></section><div class="progress-subject-list">${DATA.subjects.map(s => { const p=progress(s); return `<section class="content-card"><h2>${escapeHTML(s.icon)} ${escapeHTML(s.name)}</h2><div class="progress-line"><span style="width:${p.percent}%"></span></div><div class="progress-caption"><span>${p.done}/${p.total} bài</span><strong>${p.percent}%</strong></div></section>`; }).join('')}</div><div class="note-box">Tổng cộng ${getCompleted().length} bài được đánh dấu hoàn thành. Dữ liệu đã được đồng bộ lên tài khoản; chức năng xuất/nhập vẫn dùng được để sao lưu thủ công.</div>`;
  }
  function renderBookmarks() {
    const saved = getBookmarks();
    const rows = allEntries().filter(x => saved.includes(x.lesson.id));
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card"><h1>🔖 Bài học đã lưu</h1><p>${rows.length} bài được lưu trong tài khoản của bạn.</p></section>${rows.length ? `<div class="recent-list">${rows.map(x => `<a class="search-result" href="#lesson/${x.subject.id}/${x.lesson.id}">${escapeHTML(x.lesson.title)}<small>${escapeHTML(x.subject.name)} · ${escapeHTML(x.chapter.title)}</small></a>`).join('')}</div>` : '<div class="empty-state">Bạn chưa lưu bài học nào. Mở một bài và chọn “Lưu bài này”.</div>'}`;
  }
  function renderAbout() {
    const entries = allEntries();
    const drafted = entries.filter(x => x.lesson.content && x.lesson.content.summary).length;
    const verified = entries.filter(x => x.lesson.content && x.lesson.content.verified).length;
    const settings = DATA.settings || {};
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card"><div class="page-title-row"><span class="page-title-icon">📚</span><div><h1>Về Kiến thức thập cẩm</h1><p>Học dễ hiểu – Nhớ lâu – Thi hiệu quả.</p></div></div><p>Website hỗ trợ học tập lớp 12, sắp xếp nội dung theo môn, chương và bài. Định hướng bộ SGK Kết nối tri thức với cuộc sống từ năm học 2026–2027.</p></section><section class="info-card" style="margin-top:14px"><h2>Nguyên tắc nội dung</h2><ul><li>Ưu tiên SGK và văn bản chính thức của Bộ GDĐT.</li><li>Phân biệt kiến thức theo SGK với mẹo học và phần giải thích bổ sung.</li><li>Chỉ nội dung đã đối chiếu trực tiếp với bản SGK hiện hành mới được đánh dấu đã kiểm chứng.</li><li>Tiến độ, ghi chú và bài đã lưu được đồng bộ trên tài khoản cá nhân.</li></ul><p><strong>Tiến độ biên soạn:</strong> ${drafted}/${entries.length} bài hiện có ghi chú tham khảo; ${verified} bài đã được xác nhận đối chiếu SGK. Các bài còn lại được đánh dấu rõ là đang chờ biên soạn, không được xem là nội dung SGK hoàn chỉnh.</p><p><strong>Căn cứ lựa chọn bộ sách:</strong> ${escapeHTML(settings.officialTextbookDecision || 'Quyết định 3588/QĐ-BGDĐT')}.</p><p><a href="${escapeHTML(settings.officialTextbookUrl || 'https://xaydungchinhsach.chinhphu.vn') }" target="_blank" rel="noopener noreferrer">Đọc thông tin Quyết định 3588/QĐ-BGDĐT trên Cổng thông tin Chính phủ ↗</a></p><p><a href="${escapeHTML(settings.textbookUpdatesUrl || 'https://taphuan.nxbgd.vn')}" target="_blank" rel="noopener noreferrer">Tra cứu tài liệu cập nhật của Nhà xuất bản Giáo dục Việt Nam ↗</a></p><p>Website là tài liệu hỗ trợ học tập; học sinh nên đối chiếu với SGK đang sử dụng và hướng dẫn của giáo viên.</p></section>`;
  }
  function renderMultiline(value) { return escapeHTML(value || '').replace(/\n/g, '<br>'); }

  async function renderKnowledge() {
    app.innerHTML = '<div class="loading-state">Đang tải kiến thức và mẹo học…</div>';
    const { data, error } = await db.from('knowledge_posts').select('id,title,category,body,tips,examples,source_url,created_at')
      .eq('is_published', true).order('created_at', { ascending: false });
    if (error) { app.innerHTML = `<section class="info-card"><h1>Chưa tải được kho kiến thức</h1><p>${escapeHTML(error.message)}</p></section>`; return; }
    knowledgePosts = data || [];
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card"><h1>💡 Kiến thức và mẹo học</h1><p>Các bài viết, kinh nghiệm và tài liệu bổ sung do quản trị viên biên soạn.</p></section>${knowledgePosts.length ? `<div class="knowledge-list">${knowledgePosts.map(post => `<article class="knowledge-card"><div class="knowledge-meta"><span>${escapeHTML(post.category)}</span><time>${new Date(post.created_at).toLocaleDateString('vi-VN')}</time></div><h2>${escapeHTML(post.title)}</h2><div class="knowledge-body">${renderMultiline(post.body)}</div>${post.tips ? `<h3>💡 Mẹo / ghi nhớ</h3><div class="knowledge-body">${renderMultiline(post.tips)}</div>` : ''}${post.examples ? `<h3>✍️ Ví dụ / hướng dẫn</h3><div class="knowledge-body">${renderMultiline(post.examples)}</div>` : ''}${safeExternalUrl(post.source_url) ? `<p class="knowledge-source"><a href="${escapeHTML(safeExternalUrl(post.source_url))}" target="_blank" rel="noopener noreferrer">Nguồn tham khảo ↗</a></p>` : ''}</article>`).join('')}</div>` : '<div class="empty-state">Chưa có bài viết nào. Quản trị viên sẽ bổ sung nội dung tại trang quản trị.</div>'}`;
  }

  async function renderAdmin() {
    if (!currentProfile || currentProfile.role !== 'admin') { renderNotFound(); return; }
    app.innerHTML = '<div class="loading-state">Đang tải trang quản trị…</div>';
    const [postsResult, usersResult] = await Promise.all([
      db.from('knowledge_posts').select('*').order('created_at', { ascending: false }),
      db.from('profiles').select('id,email,role,is_active,created_at').order('created_at', { ascending: false })
    ]);
    if (postsResult.error || usersResult.error) {
      const err = postsResult.error || usersResult.error;
      app.innerHTML = `<section class="info-card"><h1>Lỗi tải trang quản trị</h1><p>${escapeHTML(err.message)}</p></section>`; return;
    }
    adminPosts = postsResult.data || []; adminUsers = usersResult.data || [];
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div><section class="page-title-card"><div class="page-title-row"><span class="page-title-icon">🛠️</span><div><h1>Quản trị website</h1><p>Chỉ tài khoản được cấp quyền quản trị mới mở được khu vực này.</p></div></div><div class="admin-stats"><span><strong>${adminUsers.length}</strong> tài khoản</span><span><strong>${adminPosts.length}</strong> bài viết</span></div></section>
      <section class="content-card admin-section"><h2>✍️ Thêm / chỉnh sửa kiến thức</h2><form id="adminPostForm" class="admin-form"><input type="hidden" id="postId"><label for="postTitle">Tiêu đề</label><input id="postTitle" class="text-field" required maxlength="160" placeholder="Ví dụ: Mẹo nhớ công thức đạo hàm"><label for="postCategory">Loại nội dung</label><select id="postCategory" class="text-field" maxlength="50"><option>Kiến thức</option><option>Mẹo học</option><option>Đề cương</option><option>Hướng dẫn</option><option>Tài liệu</option></select><label for="postBody">Nội dung chính</label><textarea id="postBody" class="text-field admin-textarea" rows="6" required maxlength="50000" placeholder="Viết nội dung chính…"></textarea><label for="postTips">Mẹo / ghi nhớ (không bắt buộc)</label><textarea id="postTips" class="text-field admin-textarea" rows="4" maxlength="20000" placeholder="Mẹo ngắn, cách nhớ, lưu ý…"></textarea><label for="postExamples">Ví dụ / hướng dẫn (không bắt buộc)</label><textarea id="postExamples" class="text-field admin-textarea" rows="4" maxlength="30000" placeholder="Ví dụ, các bước, bài tập…"></textarea><label for="postSource">Liên kết nguồn (không bắt buộc)</label><input id="postSource" class="text-field" type="url" maxlength="2048" placeholder="https://…"><label class="admin-publish"><input id="postPublished" type="checkbox" checked> Công khai cho người dùng đã đăng nhập</label><div class="lesson-actions"><button class="primary-button" type="submit">Lưu bài viết</button><button class="secondary-button" id="postCancelEdit" type="button">Làm mới biểu mẫu</button><span id="adminPostStatus" class="muted-note" aria-live="polite"></span></div></form></section>
      <section class="content-card admin-section"><h2>📚 Bài viết đã tạo</h2>${adminPosts.length ? `<div class="admin-list">${adminPosts.map(post => `<article class="admin-list-item"><div><strong>${escapeHTML(post.title)}</strong><small>${escapeHTML(post.category)} · ${post.is_published ? 'Đang công khai' : 'Bản nháp'} · ${new Date(post.created_at).toLocaleDateString('vi-VN')}</small></div><div class="admin-row-actions"><button class="secondary-button" data-action="edit-post" data-id="${post.id}">Sửa</button><button class="danger-button" data-action="delete-post" data-id="${post.id}">Xóa</button></div></article>`).join('')}</div>` : '<p class="muted-note">Chưa có bài viết.</p>'}</section>
      <section class="content-card admin-section"><h2>👥 Quản lý tài khoản</h2><p class="muted-note">Có thể xem email và tạm khóa / mở khóa tài khoản. Tài khoản quản trị không thể bị khóa từ giao diện này.</p>${adminUsers.length ? `<div class="admin-list">${adminUsers.map(user => `<article class="admin-list-item"><div><strong>${escapeHTML(user.email || '(không có email)')}</strong><small>${user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'} · ${user.is_active ? 'Đang hoạt động' : 'Đã tạm khóa'} · ${new Date(user.created_at).toLocaleDateString('vi-VN')}</small></div><div class="admin-row-actions">${user.role === 'admin' ? '<span class="role-chip">ADMIN</span>' : `<button class="${user.is_active ? 'danger-button' : 'secondary-button'}" data-action="toggle-user" data-id="${user.id}" data-active="${user.is_active ? 'true' : 'false'}">${user.is_active ? 'Tạm khóa' : 'Mở khóa'}</button>`}</div></article>`).join('')}</div>` : '<p class="muted-note">Chưa có tài khoản.</p>'}</section>`;
    const form = document.getElementById('adminPostForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = document.getElementById('adminPostStatus');
      const payload = {
        title: document.getElementById('postTitle').value.trim(),
        category: document.getElementById('postCategory').value,
        body: document.getElementById('postBody').value.trim(),
        tips: document.getElementById('postTips').value.trim(),
        examples: document.getElementById('postExamples').value.trim(),
        source_url: document.getElementById('postSource').value.trim() || null,
        is_published: document.getElementById('postPublished').checked
      };
      if (!payload.title || !payload.body) { status.textContent = 'Cần nhập tiêu đề và nội dung chính.'; return; }
      const id = document.getElementById('postId').value;
      const button = form.querySelector('button[type=submit]'); button.disabled = true; status.textContent = 'Đang lưu…';
      try {
        const result = id
          ? await db.from('knowledge_posts').update(payload).eq('id', id)
          : await db.from('knowledge_posts').insert({ ...payload, created_by: currentUser.id });
        if (result.error) throw result.error;
        await renderAdmin();
      } catch (error) { status.textContent = 'Lưu thất bại: ' + error.message; button.disabled = false; }
    });
    document.getElementById('postCancelEdit').addEventListener('click', () => renderAdmin());
  }

  function fillPostForm(id) {
    const post = adminPosts.find(item => item.id === id); if (!post) return;
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title || '';
    document.getElementById('postCategory').value = post.category || 'Kiến thức';
    document.getElementById('postBody').value = post.body || '';
    document.getElementById('postTips').value = post.tips || '';
    document.getElementById('postExamples').value = post.examples || '';
    document.getElementById('postSource').value = post.source_url || '';
    document.getElementById('postPublished').checked = !!post.is_published;
    document.getElementById('postTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('postTitle').focus();
  }

  function renderPrivacy() {
    app.innerHTML = `<div class="page-top"><a class="back-link" href="#home">← Trang chủ</a></div>
      <section class="page-title-card"><div class="page-title-row"><span class="page-title-icon">🔐</span><div><h1>Quyền riêng tư và dữ liệu</h1><p>Thông tin minh bạch về dữ liệu mà Kiến thức thập cẩm sử dụng.</p></div></div></section>
      <div class="privacy-grid">
        <section class="content-card"><h2>📦 Dữ liệu được lưu</h2><ul><li>Email tài khoản do Supabase Auth quản lý.</li><li>Tiến độ bài học, bài đã lưu, ghi chú và trạng thái đồng hồ học tập.</li><li>Nội dung bài viết do quản trị viên đăng.</li></ul></section>
        <section class="content-card"><h2>🎯 Mục đích sử dụng</h2><p>Dữ liệu học tập được lưu để đồng bộ khi bạn đăng nhập trên thiết bị khác và khôi phục tiến độ sau này.</p></section>
        <section class="content-card"><h2>🛡️ Ai có thể truy cập?</h2><p>Tài khoản thông thường chỉ đọc và sửa dữ liệu học tập gắn với chính tài khoản đó. Khu vực quản trị chỉ hiển thị email, vai trò và trạng thái tài khoản; chính sách cơ sở dữ liệu không cho màn hình quản trị đọc ghi chú riêng của người khác.</p><p>Chủ dự án Supabase vẫn có quyền quản trị hạ tầng và cơ sở dữ liệu; hãy chỉ cấp quyền truy cập Supabase cho người thật sự cần.</p></section>
        <section class="content-card"><h2>📣 Quảng cáo bên thứ ba</h2><p>Khi chủ website kích hoạt quảng cáo Monetag, trình duyệt có thể tải nội dung hoặc mã từ nhà cung cấp quảng cáo. Nhà cung cấp có thể xử lý dữ liệu theo chính sách riêng của họ. Chỉ bật quảng cáo sau khi đã đọc điều khoản và chính sách của nhà cung cấp.</p></section>
        <section class="content-card"><h2>🧹 Xóa tài khoản và dữ liệu</h2><p>Hiện tại, người dùng cần liên hệ chủ website để yêu cầu xóa tài khoản. Khi tài khoản Auth được xóa đúng cách, hồ sơ và dữ liệu học tập liên kết sẽ được xóa theo khóa ngoại của cơ sở dữ liệu. Hãy xuất bản sao lưu trước khi yêu cầu xóa.</p></section>
        <section class="content-card"><h2>⚠️ Lưu ý an toàn</h2><p>Không dùng lại mật khẩu ngân hàng hoặc mật khẩu quan trọng khác. Đăng xuất trên thiết bị dùng chung và không chia sẻ mã xác nhận email cho bất kỳ ai.</p></section>
      </div><p class="note-box">Đây là nội dung thông báo mẫu của website. Chủ website cần bổ sung thông tin liên hệ và rà soát nội dung trước khi mở đăng ký công khai.</p>`;
  }

  function renderNotFound() { app.innerHTML = '<section class="info-card"><h1>Không tìm thấy nội dung</h1><p>Đường dẫn này không tồn tại hoặc mục lục đã thay đổi.</p><a class="tool-link" href="#home">Về trang chủ</a></section>'; }
  function renderCurrentRoute() {
    const r = route(), type = r[0] || 'home';
    // Privacy information must be readable before a visitor creates an account.
    if (type === 'privacy') { renderPrivacy(); return; }
    if (!currentUser || !currentProfile) { renderAuth(authMode); return; }
    if (type !== 'tools') stopTimer();
    if (type === 'home') renderHome();
    else if (type === 'subject') { const s=findSubject(r[1]); s ? renderSubject(s) : renderNotFound(); }
    else if (type === 'lesson') { const s=findSubject(r[1]), f=s ? findLesson(s,r[2]) : null; s && f ? renderLesson(s,f) : renderNotFound(); }
    else if (type === 'tools') renderTools();
    else if (type === 'about') renderAbout();
    else if (type === 'progress') renderProgress();
    else if (type === 'bookmarks') renderBookmarks();
    else if (type === 'knowledge') renderKnowledge();
    else if (type === 'admin') renderAdmin();
    else if (type === 'privacy') renderPrivacy();
    else renderNotFound();
    if (siteNav) siteNav.classList.remove('is-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded','false');
    window.scrollTo(0,0);
  }
  function renderSearch(query) {
    const box=document.getElementById('searchResults'); if (!box) return;
    const q=normalize(query); if (!q) { box.innerHTML=''; return; }
    const results=[];
    DATA.subjects.forEach(s => {
      if (normalize(s.name+' '+s.textbook).includes(q)) results.push({href:'#subject/'+s.id,title:s.name,detail:s.textbook});
      (s.chapters||[]).forEach(ch => {
        if (normalize(ch.title).includes(q)) results.push({href:'#subject/'+s.id,title:ch.title,detail:s.name});
        (ch.lessons||[]).forEach(l => {
          const hay=normalize([l.title,l.content && l.content.summary,(l.content && l.content.keyPoints || []).join(' ')].join(' '));
          if (hay.includes(q)) results.push({href:'#lesson/'+s.id+'/'+l.id,title:l.title,detail:s.name+' · '+ch.title});
        });
      });
    });
    const knowledgeMatches = knowledgePosts.filter(post => normalize([post.title, post.category, post.body, post.tips, post.examples].join(' ')).includes(q));
    if (knowledgeMatches.length) results.push({href:'#knowledge', title:`${knowledgeMatches.length} bài trong kho kiến thức`, detail:'Kiến thức bổ sung · mẹo học · đề cương'});
    const unique=results.filter((x,i,a)=>a.findIndex(y=>y.href===x.href)===i).slice(0,12);
    box.innerHTML=unique.length ? unique.map(x=>`<a class="search-result" href="${x.href}">${escapeHTML(x.title)}<small>${escapeHTML(x.detail)}</small></a>`).join('') : '<div class="empty-state">Không tìm thấy kết quả. Thử từ khóa ngắn hơn hoặc không dấu.</div>';
  }
  if (menuToggle && siteNav) menuToggle.addEventListener('click',()=>{const open=siteNav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});
  app.addEventListener('input', e => { if (e.target && e.target.id==='globalSearch') renderSearch(e.target.value); });
  app.addEventListener('click', async e => {
    const button=e.target.closest('[data-action]'); if (!button) return;
    const action=button.dataset.action, id=button.dataset.id;
    if (action==='toggle-done') { const a=getCompleted(),i=a.indexOf(id); if(i>=0)a.splice(i,1);else a.push(id);writeStore(KEYS.completed,a);renderCurrentRoute(); }
    else if (action==='bookmark') { const a=getBookmarks(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);writeStore(KEYS.bookmarks,a);renderCurrentRoute(); }
    else if (action==='save-note') { const a=getNotes();a[id]=document.getElementById('lessonNotes').value;const ok=writeStore(KEYS.notes,a);const status=document.getElementById('noteStatus');if(status)status.textContent=ok?'Đã lưu. Dữ liệu sẽ tự đồng bộ lên tài khoản.':'Không thể lưu: bộ nhớ trình duyệt đã đầy hoặc bị chặn.'; }
    else if (action==='copy-title') { const text=button.dataset.copy||''; if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(()=>{button.textContent='Đã sao chép';}).catch(()=>{button.textContent='Không sao chép được';});else button.textContent='Trình duyệt không hỗ trợ sao chép'; }
    else if (action==='export-progress') { const payload={version:1,exportedAt:new Date().toISOString(),completed:getCompleted(),bookmarks:getBookmarks(),notes:getNotes()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='kttm-du-lieu-hoc-tap.json';a.click();URL.revokeObjectURL(url); }
    else if (action==='import-progress') { const input=document.getElementById('importFile');if(input)input.click(); }
    else if (action==='edit-post') { fillPostForm(id); }
    else if (action==='delete-post') {
      if (!currentProfile || currentProfile.role !== 'admin' || !confirm('Xóa vĩnh viễn bài viết này?')) return;
      const { error } = await db.from('knowledge_posts').delete().eq('id', id);
      if (error) alert('Không xóa được bài viết: ' + error.message); else await renderAdmin();
    }
    else if (action==='toggle-user') {
      if (!currentProfile || currentProfile.role !== 'admin') return;
      const nextActive = button.dataset.active !== 'true';
      const { error } = await db.rpc('admin_set_user_active', { p_user_id: id, p_is_active: nextActive });
      if (error) alert('Không cập nhật được tài khoản: ' + error.message); else await renderAdmin();
    }
  });
  app.addEventListener('change', e => {
    if (!e.target || e.target.id!=='importFile' || !e.target.files || !e.target.files[0]) return;
    const file=e.target.files[0];
    if (file.size > 2 * 1024 * 1024) { alert('Tệp sao lưu vượt quá giới hạn 2 MB.'); e.target.value=''; return; }
    const reader=new FileReader();reader.onload=()=>{try{const x=JSON.parse(reader.result);if(!x||!Array.isArray(x.completed)||!Array.isArray(x.bookmarks)||!x.notes||typeof x.notes!=='object'||Array.isArray(x.notes))throw new Error('invalid');writeStore(KEYS.completed,sanitizeLessonIdArray(x.completed));writeStore(KEYS.bookmarks,sanitizeLessonIdArray(x.bookmarks));writeStore(KEYS.notes,sanitizeNotes(x.notes));renderCurrentRoute();}catch(_){alert('Tệp dữ liệu không hợp lệ hoặc không đúng định dạng Kiến thức thập cẩm.');} finally { e.target.value=''; }};reader.readAsText(file);
  });
  window.addEventListener('hashchange',renderCurrentRoute);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flushCloudSync();
  });
  window.addEventListener('pagehide', () => { void flushCloudSync(); });
  const year=document.getElementById('currentYear');if(year)year.textContent=String(new Date().getFullYear());
  // Keep existing navigation anchors useful without changing the page structure.
  if (siteNav && !siteNav.querySelector('a[href="#progress"]')) { const a=document.createElement('a');a.href='#progress';a.textContent='Tiến độ';siteNav.appendChild(a); }
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) logoutButton.addEventListener('click', async () => {
    if (!db) return;
    const saved = await flushCloudSync();
    if (!saved) { alert('Dữ liệu chưa đồng bộ được. Hãy kiểm tra kết nối rồi đăng xuất lại để tránh mất thay đổi gần nhất.'); return; }
    syncReady = false;
    clearLocalAccountCache();
    const { error } = await db.auth.signOut();
    if (error) { syncReady = !!currentUser; alert('Không đăng xuất được: ' + error.message); }
  });
  initializeAuth().catch(error => {
    console.error('Auth initialization failed:', error);
    renderAuth('login', 'Không khởi tạo được kết nối Supabase: ' + authErrorMessage(error), true);
  });
})();
