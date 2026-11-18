(function () {
  'use strict';

  const QUESTIONS = Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [];
  const META = window.QUIZ_META || { topics: [], banks: [] };
  const REFERENCES = window.QUIZ_REFERENCES || {};
  const STORAGE_KEY = 'pgcpai_combined_quiz_v3';
  const LEGACY_STORAGE_KEY = 'pgcpai_python_quiz_v2';
  const APP_VERSION = 3;
  const $ = (id) => document.getElementById(id);
  const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
  const topicById = new Map((META.topics || []).map((t) => [t.id, t]));
  const bankLabels = {
    all: 'All questions', core: 'Syllabus MCQs', code: 'Python code', practical: 'Java practical', extension: 'Beyond syllabus'
  };
  const difficultyLabels = { easy: 'BASIC', medium: 'MEDIUM', hard: 'HARD', expert: 'EXPERT' };
  const bankBadgeLabels = { core: 'SYLLABUS', code: 'PYTHON CODE', practical: 'JAVA PRACTICE', extension: 'EXTENSION' };

  function freshState() {
    const mins = Number($('timerDuration')?.value || 90);
    return {
      candidate: '', subject: 'python', bank: 'all', topic: 'all', difficulty: 'all', status: 'all', search: '',
      currentId: QUESTIONS[0]?.id || null,
      selections: {}, results: {}, flags: [], hints: [],
      timer: { durationSeconds: mins * 60, remainingSeconds: mins * 60, running: false, endsAt: null, expired: false }
    };
  }

  function safeParse(raw) {
    try { return JSON.parse(raw); } catch (_) { return null; }
  }

  function normalizeState(input) {
    const base = freshState();
    if (!input || typeof input !== 'object') return base;
    const allowedBanks = ['all', 'core', 'code', 'practical', 'extension'];
    const allowedFilters = ['all', 'easy', 'medium', 'hard', 'expert'];
    base.candidate = typeof input.candidate === 'string' ? input.candidate.slice(0, 50) : '';
    base.bank = allowedBanks.includes(input.bank) ? input.bank : 'all';
    base.subject = ['python','java','all'].includes(input.subject) ? input.subject : 'python';
    base.topic = typeof input.topic === 'string' ? input.topic : 'all';
    base.difficulty = allowedFilters.includes(input.difficulty) ? input.difficulty : 'all';
    base.status = ['all', 'unattempted', 'correct', 'incorrect', 'flagged'].includes(input.status) ? input.status : 'all';
    base.search = typeof input.search === 'string' ? input.search.slice(0, 120) : '';
    base.currentId = byId.has(input.currentId) ? input.currentId : base.currentId;

    if (input.selections && typeof input.selections === 'object' && !Array.isArray(input.selections)) {
      Object.entries(input.selections).forEach(([id, index]) => {
        const q = byId.get(id);
        if (q && Number.isInteger(index) && index >= 0 && index < q.options.length) base.selections[id] = index;
      });
    }
    if (input.results && typeof input.results === 'object' && !Array.isArray(input.results)) {
      Object.entries(input.results).forEach(([id, result]) => {
        const q = byId.get(id);
        if (q && result && Number.isInteger(result.selectedIndex) && result.selectedIndex >= 0 && result.selectedIndex < q.options.length) {
          base.results[id] = {
            selectedIndex: result.selectedIndex,
            correct: result.selectedIndex === q.answerIndex,
            checkedAt: typeof result.checkedAt === 'string' ? result.checkedAt : null
          };
          base.selections[id] = result.selectedIndex;
        }
      });
    }
    base.flags = Array.isArray(input.flags) ? [...new Set(input.flags.filter((id) => byId.has(id)))] : [];
    base.hints = Array.isArray(input.hints) ? [...new Set(input.hints.filter((id) => byId.has(id)))] : [];
    if (input.timer && typeof input.timer === 'object') {
      const duration = Number(input.timer.durationSeconds);
      const remaining = Number(input.timer.remainingSeconds);
      if ([15, 30, 45, 60, 90, 120].some((m) => m * 60 === duration)) {
        base.timer.durationSeconds = duration;
        base.timer.remainingSeconds = Number.isFinite(remaining) ? Math.max(0, Math.min(duration, remaining)) : duration;
      }
      base.timer.running = Boolean(input.timer.running && input.timer.endsAt && Number(input.timer.endsAt) > Date.now());
      base.timer.endsAt = base.timer.running ? Number(input.timer.endsAt) : null;
      base.timer.expired = Boolean(input.timer.expired);
      if (base.timer.running) {
        base.timer.remainingSeconds = Math.max(0, Math.ceil((base.timer.endsAt - Date.now()) / 1000));
        if (base.timer.remainingSeconds === 0) {
          base.timer.running = false;
          base.timer.endsAt = null;
          base.timer.expired = true;
        }
      }
    }
    if (!topicById.has(base.topic)) base.topic = 'all';
    return base;
  }

  const savedCurrentVersion = safeParse(localStorageSafeGet(STORAGE_KEY));
  const savedLegacyVersion = safeParse(localStorageSafeGet(LEGACY_STORAGE_KEY));
  // Question wording, distractors, and answer keys have been substantially revised.
  // Carry over identity and timer preferences only; old selections/results could
  // otherwise be scored against a different option order under the same stable ID.
  const migratedPreferences = savedLegacyVersion ? {
    candidate: savedLegacyVersion.candidate,
    timer: savedLegacyVersion.timer
  } : null;
  let state = normalizeState(savedCurrentVersion || migratedPreferences);
  let filteredQuestions = [];
  let toastTimer = null;
  let timerInterval = null;
  let activeStudyTab = 'hint';
  let shuffledIds = null;

  function localStorageSafeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      $('saveStatus').innerHTML = '<span class="save-dot"></span> Saved in this browser';
    } catch (_) {
      $('saveStatus').innerHTML = '<span class="save-dot" style="background:#d99b40"></span> Browser storage unavailable';
    }
  }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  function richText(value) {
    let safe = escapeHTML(value);
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return safe.replace(/\n/g, '<br>');
  }
  function showToast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }
  function getQuestion() { return byId.get(state.currentId) || filteredQuestions[0] || null; }
  function countByBank(bank) { return QUESTIONS.filter((q) => (state.subject === 'all' || q.subject === state.subject) && (bank === 'all' || q.bank === bank)).length; }

  function getFilteredQuestions() {
    const term = state.search.trim().toLowerCase();
    const matched = QUESTIONS.filter((q) => {
      if (state.subject !== 'all' && q.subject !== state.subject) return false;
      if (state.bank !== 'all' && q.bank !== state.bank) return false;
      if (state.topic !== 'all' && q.topicId !== state.topic) return false;
      if (state.difficulty !== 'all' && q.difficulty !== state.difficulty) return false;
      const result = state.results[q.id];
      if (state.status === 'unattempted' && result) return false;
      if (state.status === 'correct' && !result?.correct) return false;
      if (state.status === 'incorrect' && (!result || result.correct)) return false;
      if (state.status === 'flagged' && !state.flags.includes(q.id)) return false;
      if (term) {
        const haystack = [q.id, q.topic, q.question, q.code || '', ...(q.options || [])].join(' ').toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
    if (shuffledIds) { const rank = new Map(shuffledIds.map((id, i) => [id, i])); matched.sort((a,b) => (rank.get(a.id) ?? 1e9) - (rank.get(b.id) ?? 1e9)); }
    return matched;
  }

  function renderStats() {
    const visibleIds = new Set(getFilteredQuestions().map(q => q.id));
    const results = Object.entries(state.results).filter(([id]) => visibleIds.has(id)).map(([, result]) => result);
    const checked = results.length;
    const correct = results.filter((r) => r.correct).length;
    const accuracy = checked ? Math.round((correct / checked) * 100) : null;
    $('scoreCorrect').textContent = correct;
    $('scoreAttempted').textContent = checked;
    $('scoreAccuracy').textContent = accuracy === null ? '—' : `${accuracy}%`;
    $('scoreCompleted').textContent = checked;
    $('scoreTotal').textContent = getFilteredQuestions().length;
    const visibleTotal = getFilteredQuestions().length;
    const pct = visibleTotal ? (checked / visibleTotal) * 100 : 0;
    $('overallProgress').style.width = `${pct}%`;
    $('overallProgressLabel').textContent = `${Math.round(pct)}%`;
    const name = state.candidate.trim();
    $('welcomeTitle').textContent = name ? `Keep going, ${name}.` : 'Ready when you are.';
    $('bankTotal').textContent = `${getFilteredQuestions().length} in view`;
    $('subjectFilter').value = state.subject;
    document.querySelectorAll('[data-count]').forEach((el) => {
      const bank = el.getAttribute('data-count');
      el.textContent = countByBank(bank);
    });
  }

  function populateTopicFilter() {
    const select = $('topicFilter');
    const availableTopicIds = new Set(QUESTIONS.filter((q) => (state.subject === 'all' || q.subject === state.subject) && (state.bank === 'all' || q.bank === state.bank)).map((q) => q.topicId));
    const topics = (META.topics || []).filter((t) => availableTopicIds.has(t.id));
    const previous = state.topic;
    select.innerHTML = '<option value="all">All topics</option>' + topics.map((t) => `<option value="${escapeHTML(t.id)}">${escapeHTML(t.label)}</option>`).join('');
    if (previous !== 'all' && availableTopicIds.has(previous)) select.value = previous;
    else { state.topic = 'all'; select.value = 'all'; }
  }

  function renderNav() {
    const map = $('questionMap');
    $('navigatorCount').textContent = `${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`;
    $('filteredCount').textContent = `${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`;
    map.innerHTML = filteredQuestions.map((q) => {
      const result = state.results[q.id];
      const classes = ['map-number'];
      if (q.id === state.currentId) classes.push('current');
      if (state.selections[q.id] !== undefined) classes.push('selected');
      if (result) classes.push(result.correct ? 'correct' : 'incorrect');
      if (state.flags.includes(q.id)) classes.push('flagged');
      const label = `${q.number}: ${q.topic} — ${result ? (result.correct ? 'correct' : 'incorrect') : 'not checked'}${state.flags.includes(q.id) ? ', flagged' : ''}`;
      return `<button type="button" class="${classes.join(' ')}" data-question-id="${escapeHTML(q.id)}" aria-label="${escapeHTML(label)}" aria-current="${q.id === state.currentId ? 'true' : 'false'}">${String(q.number).padStart(3, '0')}</button>`;
    }).join('');
  }

  function setEmptyState(isEmpty) {
    const empty = $('emptyQuestionState');
    if (!empty) return;
    empty.hidden = !isEmpty;
    [...$('questionCard').children].forEach((child) => {
      if (child.id !== 'emptyQuestionState') child.hidden = isEmpty;
    });
  }

  function renderQuestion() {
    const q = getQuestion();
    if (!q) {
      setEmptyState(true);
      return;
    }
    setEmptyState(false);
    const position = filteredQuestions.findIndex((item) => item.id === q.id) + 1;
    const result = state.results[q.id];
    const selected = state.selections[q.id];
    $('questionNumber').textContent = String(q.number).padStart(3, '0');
    $('questionPosition').textContent = `of ${filteredQuestions.length}`;
    $('questionBankBadge').textContent = `${q.subjectLabel || (q.subject === 'java' ? 'Java' : 'Python')} · ${bankBadgeLabels[q.bank] || 'QUESTION'}`;
    $('questionBankBadge').className = `badge bank-badge ${q.bank}`;
    $('questionDifficulty').textContent = difficultyLabels[q.difficulty] || String(q.difficulty).toUpperCase();
    $('questionDifficulty').className = `badge difficulty-badge ${q.difficulty}`;
    $('questionTopic').textContent = q.topic;
    $('questionPrompt').innerHTML = richText(q.question);
    $('crumbBank').textContent = bankLabels[state.bank] || 'Practice';

    const codePanel = $('questionCode');
    if (q.code) {
      codePanel.hidden = false;
      $('questionCodeText').textContent = q.code;
    } else {
      codePanel.hidden = true;
      $('questionCodeText').textContent = '';
    }

    $('optionsList').innerHTML = q.options.map((option, index) => {
      const classes = ['option-button'];
      if (selected === index) classes.push('selected');
      if (result && index === q.answerIndex) classes.push('correct-option');
      if (result && index === result.selectedIndex && !result.correct) classes.push('wrong-option');
      if (result && !result.correct && index === q.answerIndex) classes.push('missed-option');
      const trailing = result && index === q.answerIndex ? '✓' : (result && index === result.selectedIndex ? '×' : '');
      return `<button type="button" class="${classes.join(' ')}" data-option-index="${index}" role="radio" aria-checked="${selected === index ? 'true' : 'false'}" ${result ? 'disabled' : ''}><span class="option-letter">${String.fromCharCode(65 + index)}</span><span class="option-text">${richText(option)}</span><span class="option-trailing" aria-hidden="true">${trailing}</span></button>`;
    }).join('');

    $('selectionState').textContent = result
      ? (result.correct ? 'Answer checked · Correct' : 'Answer checked · Review this one')
      : (selected === undefined ? 'No option selected' : `Option ${String.fromCharCode(65 + selected)} selected`);
    $('checkAnswer').disabled = result !== undefined || selected === undefined;
    $('checkAnswer').hidden = Boolean(result);
    $('retryQuestion').hidden = !result;
    $('clearSelection').hidden = Boolean(result) || selected === undefined;
    $('answerFeedback').hidden = !result;
    $('answerFeedback').className = `answer-feedback${result && !result.correct ? ' incorrect' : ''}`;
    if (result) {
      const correctText = q.options[q.answerIndex];
      const selectedText = q.options[result.selectedIndex];
      $('answerFeedback').innerHTML = `
        <div class="feedback-heading"><span class="feedback-mark">${result.correct ? '✓' : '!'}</span>${result.correct ? 'Correct answer' : 'Incorrect — compare your choice with the correct option'}</div>
        ${result.correct ? '' : `<div class="feedback-correct-answer"><strong>Correct option: ${String.fromCharCode(65 + q.answerIndex)}.</strong> ${richText(correctText)}<br><strong>Your choice: ${String.fromCharCode(65 + result.selectedIndex)}.</strong> ${richText(selectedText)}</div>`}
        <div class="feedback-explanation"><strong>Why the correct option is right:</strong> ${richText(q.explanation || 'Review the reference notes for this topic.')}</div>
        <details class="option-explanations"><summary>Why each option is right or wrong</summary><ol>${(q.optionExplanations || q.options.map((_,i)=>i===q.answerIndex?'This is the correct answer.':'This option does not satisfy the concept being tested.')).map((ex,i)=>`<li><strong>${String.fromCharCode(65+i)}.</strong> ${richText(ex)}</li>`).join('')}</ol></details>`;
    } else {
      $('answerFeedback').innerHTML = '';
    }

    $('flagQuestion').setAttribute('aria-pressed', state.flags.includes(q.id) ? 'true' : 'false');
    $('flagLabel').textContent = state.flags.includes(q.id) ? 'Flagged for review' : 'Flag for review';
    $('previousQuestion').disabled = position <= 1;
    $('nextQuestion').disabled = position < 1 || position >= filteredQuestions.length;
    $('nextUnattempted').disabled = filteredQuestions.length === 0 || filteredQuestions.every((item) => Boolean(state.results[item.id]));
    renderHint(q);
    renderReference(q);
  }

  function renderHint(q) {
    const alreadyShown = state.hints.includes(q.id);
    const button = $('revealHint');
    button.hidden = alreadyShown;
    $('hintText').hidden = !alreadyShown;
    $('hintText').textContent = alreadyShown ? (q.hint || 'Think about the key rule being tested, then eliminate the options that contradict it.') : '';
  }

  function renderReference(q) {
    const ref = REFERENCES[q.referenceId] || REFERENCES[q.topicId];
    if (!ref) {
      $('referencePane').innerHTML = '<p class="reference-overview">No reference note has been added for this topic yet. Use the question explanation as your starting point.</p>';
      return;
    }
    const sections = (ref.sections || []).map((section) => `
      <section class="reference-section">
        <h3>${escapeHTML(section.heading || 'Study note')}</h3>
        ${section.body ? `<p>${richText(section.body)}</p>` : ''}
        ${Array.isArray(section.bullets) && section.bullets.length ? `<ul>${section.bullets.map((item) => `<li>${richText(item)}</li>`).join('')}</ul>` : ''}
        ${section.code ? `<pre><code>${escapeHTML(section.code)}</code></pre>` : ''}
      </section>`).join('');
    const pitfalls = Array.isArray(ref.pitfalls) && ref.pitfalls.length
      ? `<div class="reference-pitfalls-wrap"><h3>Common pitfalls</h3><ul class="reference-pitfalls">${ref.pitfalls.map((item) => `<li>${richText(item)}</li>`).join('')}</ul></div>` : '';
    $('referencePane').innerHTML = `
      <h3 class="reference-title">${escapeHTML(ref.title || q.topic)}</h3>
      <p class="reference-overview">${richText(ref.overview || '')}</p>
      ${sections}
      ${pitfalls}
      ${ref.quickCheck ? `<div class="reference-quickcheck"><strong>Remember:</strong> ${richText(ref.quickCheck)}</div>` : ''}`;
  }

  function renderAll() {
    populateTopicFilter();
    filteredQuestions = getFilteredQuestions();
    if (!filteredQuestions.some((q) => q.id === state.currentId)) state.currentId = filteredQuestions[0]?.id || null;
    renderStats();
    renderNav();
    renderQuestion();
    $('candidateName').value = state.candidate;
    $('bankSwitcher').querySelectorAll('[data-bank]').forEach((button) => button.classList.toggle('active', button.dataset.bank === state.bank));
    $('topicFilter').value = state.topic;
    $('difficultyFilter').value = state.difficulty;
    $('statusFilter').value = state.status;
    $('searchQuestions').value = state.search;
    persist();
  }

  function goToQuestion(id) {
    if (!filteredQuestions.some((q) => q.id === id)) return;
    state.currentId = id;
    renderNav();
    renderQuestion();
    persist();
    closeNavigator();
  }
  function moveQuestion(direction) {
    if (!filteredQuestions.length) return;
    const index = filteredQuestions.findIndex((q) => q.id === state.currentId);
    const next = Math.min(filteredQuestions.length - 1, Math.max(0, index + direction));
    if (filteredQuestions[next]) goToQuestion(filteredQuestions[next].id);
  }
  function nextUnchecked() {
    if (!filteredQuestions.length) return;
    const start = filteredQuestions.findIndex((q) => q.id === state.currentId);
    for (let offset = 1; offset <= filteredQuestions.length; offset += 1) {
      const q = filteredQuestions[(start + offset) % filteredQuestions.length];
      if (!state.results[q.id]) { goToQuestion(q.id); return; }
    }
    showToast('All questions in this filtered set have been checked.');
  }

  function chooseOption(index) {
    const q = getQuestion();
    if (!q || state.results[q.id] || index < 0 || index >= q.options.length) return;
    state.selections[q.id] = index;
    renderNav();
    renderQuestion();
    persist();
  }
  function checkAnswer() {
    const q = getQuestion();
    if (!q || state.results[q.id]) return;
    const selected = state.selections[q.id];
    if (!Number.isInteger(selected)) return showToast('Select an option before checking your answer.');
    state.results[q.id] = { selectedIndex: selected, correct: selected === q.answerIndex, checkedAt: new Date().toISOString() };
    renderStats();
    renderNav();
    renderQuestion();
    persist();
    showToast(selected === q.answerIndex ? 'Correct — your score has been updated.' : 'Answer checked — see the correction and explanation.');
  }
  function retryQuestion() {
    const q = getQuestion();
    if (!q) return;
    delete state.results[q.id];
    delete state.selections[q.id];
    renderAll();
    showToast('Question reset. Your checked score has been recalculated.');
  }
  function toggleFlag() {
    const q = getQuestion();
    if (!q) return;
    if (state.flags.includes(q.id)) state.flags = state.flags.filter((id) => id !== q.id);
    else state.flags.push(q.id);
    renderNav(); renderQuestion(); persist();
  }
  function revealHint() {
    const q = getQuestion();
    if (!q) return;
    if (!state.hints.includes(q.id)) state.hints.push(q.id);
    renderHint(q); persist();
  }

  function switchStudyTab(tab) {
    activeStudyTab = tab === 'reference' ? 'reference' : 'hint';
    $('hintTab').classList.toggle('active', activeStudyTab === 'hint');
    $('referenceTab').classList.toggle('active', activeStudyTab === 'reference');
    $('hintTab').setAttribute('aria-selected', String(activeStudyTab === 'hint'));
    $('referenceTab').setAttribute('aria-selected', String(activeStudyTab === 'reference'));
    $('hintPane').hidden = activeStudyTab !== 'hint';
    $('referencePane').hidden = activeStudyTab !== 'reference';
  }

  function openNavigator() {
    $('leftSidebar').classList.add('mobile-open');
    $('mobileScrim').classList.add('show');
  }
  function closeNavigator() {
    $('leftSidebar').classList.remove('mobile-open');
    if (!$('referencePanel').classList.contains('open')) $('mobileScrim').classList.remove('show');
  }
  function openReference() {
    if (window.matchMedia('(max-width: 1120px)').matches) {
      $('referencePanel').classList.add('open');
      $('mobileScrim').classList.add('show');
    } else {
      $('referencePanel').classList.remove('collapsed');
      $('openReference').classList.remove('visible');
    }
  }
  function closeReference() {
    if (window.matchMedia('(max-width: 1120px)').matches) {
      $('referencePanel').classList.remove('open');
      if (!$('leftSidebar').classList.contains('mobile-open')) $('mobileScrim').classList.remove('show');
    } else {
      $('referencePanel').classList.add('collapsed');
      $('openReference').classList.add('visible');
    }
  }
  function toggleFocus() {
    document.body.classList.toggle('focus-mode');
    const focused = document.body.classList.contains('focus-mode');
    $('focusToggle').innerHTML = focused ? '<span aria-hidden="true">⛶</span> Exit focus' : '<span aria-hidden="true">⛶</span> Focus mode';
    if (focused) { closeNavigator(); if (window.matchMedia('(max-width: 1120px)').matches) closeReference(); }
    else if (window.matchMedia('(min-width: 1121px)').matches && $('referencePanel').classList.contains('collapsed')) {
      // Keep the user's intentionally collapsed study panel collapsed.
    }
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  function renderTimer() {
    const timer = state.timer;
    $('timerValue').textContent = formatTime(timer.remainingSeconds);
    $('timerToggle').textContent = timer.running ? 'Pause' : (timer.expired ? 'Time up' : 'Start');
    $('timerToggle').classList.toggle('running', timer.running);
    $('timerToggle').disabled = timer.expired;
    $('timerDuration').value = String(timer.durationSeconds / 60);
    $('timerDuration').disabled = timer.running;
    $('timerValue').classList.toggle('timer-expired', timer.expired);
  }
  function stopTimerInterval() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  }
  function syncTimer() {
    if (state.timer.running && state.timer.endsAt) {
      state.timer.remainingSeconds = Math.max(0, Math.ceil((state.timer.endsAt - Date.now()) / 1000));
      if (state.timer.remainingSeconds <= 0) {
        state.timer.remainingSeconds = 0;
        state.timer.running = false;
        state.timer.endsAt = null;
        state.timer.expired = true;
        stopTimerInterval();
        persist();
        showToast('Practice timer finished. You can continue reviewing your answers.');
      }
    }
    renderTimer();
  }
  function startTimerInterval() {
    stopTimerInterval();
    timerInterval = setInterval(syncTimer, 1000);
  }
  function toggleTimer() {
    if (state.timer.expired) return;
    if (state.timer.running) {
      syncTimer();
      state.timer.running = false;
      state.timer.endsAt = null;
      stopTimerInterval();
      persist(); renderTimer(); showToast('Timer paused.');
    } else {
      if (state.timer.remainingSeconds <= 0) {
        state.timer.remainingSeconds = state.timer.durationSeconds;
        state.timer.expired = false;
      }
      state.timer.running = true;
      state.timer.endsAt = Date.now() + state.timer.remainingSeconds * 1000;
      persist(); renderTimer(); startTimerInterval(); showToast('Timer started.');
    }
  }
  function resetTimer(durationMinutes) {
    stopTimerInterval();
    const duration = Number(durationMinutes || state.timer.durationSeconds / 60) * 60;
    state.timer = { durationSeconds: duration, remainingSeconds: duration, running: false, endsAt: null, expired: false };
    persist(); renderTimer();
  }

  function exportProgress() {
    const payload = {
      app: 'advanced-python-prep', version: APP_VERSION,
      course: META.course, exportedAt: new Date().toISOString(), progress: state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `advanced-python-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    showToast('Progress export downloaded.');
  }
  function importProgress(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const payload = safeParse(String(reader.result || ''));
      if (!payload || payload.app !== 'advanced-python-prep' || !payload.progress) {
        showToast('That file is not a valid Advanced Python Prep progress export.');
        $('importProgress').value = '';
        return;
      }
      if (payload.version !== APP_VERSION) {
        showToast('This backup belongs to an older question release. It was not imported because answer choices and keys have changed.');
        $('importProgress').value = '';
        return;
      }
      state = normalizeState(payload.progress);
      renderAll(); renderTimer();
      if (state.timer.running) startTimerInterval(); else stopTimerInterval();
      showToast('Progress imported successfully.');
      $('importProgress').value = '';
    };
    reader.onerror = () => showToast('Could not read that progress file.');
    reader.readAsText(file);
  }
  function resetProgress() {
    const confirmed = window.confirm('Reset all saved answers, score, flags, hints, and timer settings on this browser? This cannot be undone unless you exported a backup.');
    if (!confirmed) return;
    const candidate = state.candidate;
    stopTimerInterval();
    state = freshState();
    state.candidate = candidate;
    renderAll(); renderTimer();
    showToast('Practice progress has been reset.');
  }

  function clearFilters() {
    state.bank = 'all'; state.topic = 'all'; state.difficulty = 'all'; state.status = 'all'; state.search = '';
    renderAll();
  }
  function copyCurrentCode() {
    const q = getQuestion();
    if (!q?.code) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(q.code).then(() => showToast('Code copied to clipboard.')).catch(() => fallbackCopy(q.code));
    } else fallbackCopy(q.code);
  }
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text; textarea.style.position = 'fixed'; textarea.style.opacity = '0';
    document.body.appendChild(textarea); textarea.select();
    try { document.execCommand('copy'); showToast('Code copied to clipboard.'); }
    catch (_) { showToast('Copy was blocked by the browser.'); }
    textarea.remove();
  }

  function bindEvents() {
    $('subjectFilter').addEventListener('change', (event) => { state.subject = event.target.value; state.topic = 'all'; state.bank = 'all'; shuffledIds = null; renderAll(); });
    $('shuffleQuestions').addEventListener('click', () => { const ids = getFilteredQuestions().map(q=>q.id); for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];} shuffledIds=ids; state.currentId=ids[0]||null; renderAll(); showToast('Current filtered questions shuffled.'); });
    $('bankSwitcher').addEventListener('click', (event) => {
      const button = event.target.closest('[data-bank]');
      if (!button) return;
      state.bank = button.dataset.bank;
      state.topic = 'all';
      shuffledIds = null;
      renderAll();
    });
    $('topicFilter').addEventListener('change', (event) => { state.topic = event.target.value; renderAll(); });
    $('difficultyFilter').addEventListener('change', (event) => { state.difficulty = event.target.value; renderAll(); });
    $('statusFilter').addEventListener('change', (event) => { state.status = event.target.value; renderAll(); });
    $('searchQuestions').addEventListener('input', (event) => { state.search = event.target.value; renderAll(); });
    $('candidateName').addEventListener('input', (event) => { state.candidate = event.target.value.slice(0, 50); $('welcomeTitle').textContent = state.candidate.trim() ? `Keep going, ${state.candidate.trim()}.` : 'Ready when you are.'; persist(); });
    $('questionMap').addEventListener('click', (event) => {
      const button = event.target.closest('[data-question-id]');
      if (button) goToQuestion(button.dataset.questionId);
    });
    $('optionsList').addEventListener('click', (event) => {
      const button = event.target.closest('[data-option-index]');
      if (button) chooseOption(Number(button.dataset.optionIndex));
    });
    $('checkAnswer').addEventListener('click', checkAnswer);
    $('retryQuestion').addEventListener('click', retryQuestion);
    $('clearSelection').addEventListener('click', () => {
      const q = getQuestion(); if (!q || state.results[q.id]) return;
      delete state.selections[q.id]; renderNav(); renderQuestion(); persist();
    });
    $('previousQuestion').addEventListener('click', () => moveQuestion(-1));
    $('nextQuestion').addEventListener('click', () => moveQuestion(1));
    $('nextUnattempted').addEventListener('click', nextUnchecked);
    $('flagQuestion').addEventListener('click', toggleFlag);
    $('revealHint').addEventListener('click', revealHint);
    $('hintTab').addEventListener('click', () => switchStudyTab('hint'));
    $('referenceTab').addEventListener('click', () => switchStudyTab('reference'));
    $('closeReference').addEventListener('click', closeReference);
    $('openReference').addEventListener('click', () => { openReference(); switchStudyTab('reference'); });
    $('toggleNavigator').addEventListener('click', openNavigator);
    $('closeNavigator').addEventListener('click', closeNavigator);
    $('mobileScrim').addEventListener('click', () => { closeNavigator(); closeReference(); });
    $('focusToggle').addEventListener('click', toggleFocus);
    $('timerToggle').addEventListener('click', toggleTimer);
    $('timerReset').addEventListener('click', () => resetTimer());
    $('timerDuration').addEventListener('change', (event) => resetTimer(event.target.value));
    $('exportProgress').addEventListener('click', exportProgress);
    $('importProgress').addEventListener('change', (event) => importProgress(event.target.files?.[0]));
    $('resetProgress').addEventListener('click', resetProgress);
    $('copyCode').addEventListener('click', copyCurrentCode);
    $('clearFilters').addEventListener('click', clearFilters);

    document.addEventListener('keydown', (event) => {
      const target = event.target;
      const typing = target && (target.matches('input, textarea, select') || target.isContentEditable);
      if (typing) {
        if (event.key === 'Escape' && target.id === 'searchQuestions') target.blur();
        return;
      }
      if (event.key === 'ArrowLeft') { event.preventDefault(); moveQuestion(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); moveQuestion(1); }
      if (/^[1-4]$/.test(event.key)) chooseOption(Number(event.key) - 1);
      if (event.key === '/') { event.preventDefault(); $('searchQuestions').focus(); }
      if (event.key.toLowerCase() === 'f' && !event.ctrlKey && !event.metaKey) toggleFlag();
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 1121px)').matches) {
        $('referencePanel').classList.remove('open');
        $('mobileScrim').classList.remove('show');
      }
    });
  }

  function init() {
    if (!QUESTIONS.length) {
      $('questionPrompt').textContent = 'Question data could not be loaded. Open this app from its extracted folder so the data files remain beside index.html.';
      return;
    }
    $('emptyQuestionState').hidden = true;
    bindEvents();
    renderAll();
    renderTimer();
    switchStudyTab('hint');
    if (state.timer.running) startTimerInterval();
    if (window.matchMedia('(min-width: 1121px)').matches) $('openReference').classList.remove('visible');
  }

  init();
})();
