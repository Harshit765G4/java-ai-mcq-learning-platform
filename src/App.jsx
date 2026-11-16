import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import topics from './data/topics.json';
import references from './data/references.json';
import coreQuestions from './data/questions-core.json';
import practicalQuestions from './data/questions-practical.json';
import extensionQuestions from './data/questions-extension.json';

const BANKS = [
  { id: 'core', label: 'Core syllabus', short: 'Core', description: 'Concepts and theory from the 15-session syllabus', icon: '◈' },
  { id: 'practical', label: 'Practical & code', short: 'Practical', description: 'Code tracing, debugging and applied reasoning', icon: '⌘' },
  { id: 'extension', label: 'Beyond syllabus', short: 'Extension', description: 'Related Java and professional engineering knowledge', icon: '↗' },
];
const QUESTIONS = { core: coreQuestions, practical: practicalQuestions, extension: extensionQuestions };
const STORAGE_VERSION = 1;
const DEFAULT_TIMER = 30 * 60;
const PROFILE_LIST_KEY = 'java-ai-mcq-profiles-v1';
const ACTIVE_PROFILE_KEY = 'java-ai-mcq-active-profile-v1';
const LEGACY_STATE_KEY = 'java-ai-mcq-state-v1';

function profileStorageKey(name) {
  const slug = String(name || 'Learner').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'learner';
  return `java-ai-mcq-state-v1:${slug}`;
}

function loadProfileNames() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_LIST_KEY) || '[]');
    return Array.isArray(saved) && saved.length ? [...new Set(saved.filter(x => typeof x === 'string' && x.trim()))] : ['Learner'];
  } catch { return ['Learner']; }
}

function createDefaultState(candidateName = 'Learner') {
  return {
    version: STORAGE_VERSION,
    candidateName,
    theme: 'system',
    bank: 'core',
    currentId: coreQuestions[0]?.id ?? null,
    topic: 'all',
    difficulty: 'all',
    filter: 'all',
    mode: 'practice',
    answers: {},
    bookmarkedTopics: [],
    timer: { duration: DEFAULT_TIMER, remaining: DEFAULT_TIMER, running: false, endsAt: null },
    focus: false,
    shuffledIds: null,
  };
}

function loadState(profileName = null) {
  try {
    const activeName = profileName || localStorage.getItem(ACTIVE_PROFILE_KEY) || 'Learner';
    const raw = localStorage.getItem(profileStorageKey(activeName)) || (activeName === 'Learner' ? localStorage.getItem(LEGACY_STATE_KEY) : null);
    if (!raw) return createDefaultState(activeName);
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION || typeof parsed !== 'object') return createDefaultState(activeName);
    const fallback = createDefaultState(activeName);
    const state = { ...fallback, ...parsed, candidateName: activeName, answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {} };
    const timer = { ...fallback.timer, ...(parsed.timer || {}) };
    if (timer.running && timer.endsAt) {
      timer.remaining = Math.max(0, Math.ceil((timer.endsAt - Date.now()) / 1000));
      if (timer.remaining <= 0) {
        timer.remaining = 0;
        timer.running = false;
        timer.endsAt = null;
      }
    }
    state.timer = timer;
    if (!QUESTIONS[state.bank]) state.bank = 'core';
    if (!['all', 'basic', 'medium', 'hard', 'expert'].includes(state.difficulty)) state.difficulty = 'all';
    return state;
  } catch {
    return createDefaultState(profileName || 'Learner');
  }
}

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getAnswer(state, id) {
  return state.answers[id] || {
    selected: null,
    checked: false,
    correct: null,
    flagged: false,
    hintRevealed: false,
    attempts: 0,
    updatedAt: null,
  };
}

function topicName(topicId) {
  return topics.find((topic) => topic.id === topicId)?.name || 'General';
}

function referenceFor(question) {
  const topic = topics.find((item) => item.id === question?.topicId);
  return references.find((item) => item.id === (question?.referenceId || topic?.referenceId));
}

function downloadJson(value, filename) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function validateImport(payload) {
  if (!payload || typeof payload !== 'object' || payload.version !== STORAGE_VERSION || !payload.answers || typeof payload.answers !== 'object') {
    throw new Error('This file is not a recognised Java Learning Studio progress export.');
  }
  const known = new Set(Object.values(QUESTIONS).flat().map((question) => question.id));
  const knownTopics = new Set(topics.map(topic => topic.id));
  if (payload.bookmarkedTopics !== undefined && (!Array.isArray(payload.bookmarkedTopics) || payload.bookmarkedTopics.some(id => !knownTopics.has(id)))) throw new Error('The file contains invalid bookmarked topic IDs.');
  for (const [id, answer] of Object.entries(payload.answers)) {
    if (!known.has(id)) throw new Error(`The file contains an unknown question ID: ${id}`);
    if (!answer || typeof answer !== 'object') throw new Error(`The saved answer for ${id} is malformed.`);
    if (answer.selected !== null && answer.selected !== undefined && (!Number.isInteger(answer.selected) || answer.selected < 0 || answer.selected > 3)) {
      throw new Error(`The selected option for ${id} is invalid.`);
    }
    if (answer.checked && typeof answer.correct !== 'boolean') throw new Error(`The checked result for ${id} is missing its correctness value.`);
  }
  return true;
}

function StatCard({ label, value, helper, tone = 'default', icon }) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <div className="stat-top"><span>{label}</span><span className="stat-icon" aria-hidden="true">{icon}</span></div>
      <strong>{value}</strong>
      {helper && <small>{helper}</small>}
    </div>
  );
}

function DifficultyPill({ level }) {
  return <span className={`difficulty-pill difficulty-${level}`}>{level}</span>;
}

function StatusIcon({ answer }) {
  if (answer?.checked && answer.correct) return <span className="status-glyph" aria-label="Correct">✓</span>;
  if (answer?.checked && answer.correct === false) return <span className="status-glyph" aria-label="Incorrect">×</span>;
  if (answer?.flagged) return <span className="status-glyph" aria-label="Flagged">⚑</span>;
  if (answer?.selected !== null && answer?.selected !== undefined) return <span className="status-glyph" aria-label="Answer selected">•</span>;
  return null;
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [profileList, setProfileList] = useState(loadProfileNames);
  const [showProfiles, setShowProfiles] = useState(false);
  const [profileDraft, setProfileDraft] = useState('');
  const [profileError, setProfileError] = useState('');
  const [systemDark, setSystemDark] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches === true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileStudyOpen, setMobileStudyOpen] = useState(false);
  const [studyTab, setStudyTab] = useState('reference');
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [timerDraft, setTimerDraft] = useState(Math.round(state.timer.duration / 60));
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState('');
  const [toast, setToast] = useState('');
  const importInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const allQuestions = useMemo(() => Object.values(QUESTIONS).flat(), []);
  const bankQuestions = QUESTIONS[state.bank] || QUESTIONS.core;

  const filteredQuestions = useMemo(() => {
    let rows = [...bankQuestions];
    if (state.topic === 'bookmarked') rows = rows.filter((question) => (state.bookmarkedTopics || []).includes(question.topicId));
    else if (state.topic !== 'all') rows = rows.filter((question) => question.topicId === state.topic);
    if (state.difficulty !== 'all') rows = rows.filter((question) => question.difficulty === state.difficulty);
    if (state.filter === 'incorrect') rows = rows.filter((question) => getAnswer(state, question.id).checked && !getAnswer(state, question.id).correct);
    if (state.filter === 'unanswered') rows = rows.filter((question) => !getAnswer(state, question.id).checked);
    if (state.filter === 'flagged') rows = rows.filter((question) => getAnswer(state, question.id).flagged);
    if (search.trim()) {
      const needle = search.trim().toLowerCase();
      rows = rows.filter((question) => {
        const haystack = [question.question, question.code, ...question.options, topicName(question.topicId)].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(needle);
      });
    }
    if (state.shuffledIds && state.shuffledIds.length) {
      const order = new Map(state.shuffledIds.map((id, index) => [id, index]));
      rows.sort((a, b) => (order.get(a.id) ?? 999999) - (order.get(b.id) ?? 999999));
    }
    return rows;
  }, [bankQuestions, state, search]);

  const currentQuestion = filteredQuestions.find((question) => question.id === state.currentId) || filteredQuestions[0] || null;
  const currentAnswer = currentQuestion ? getAnswer(state, currentQuestion.id) : null;
  const currentReference = currentQuestion ? referenceFor(currentQuestion) : null;
  const currentTopic = currentQuestion ? topics.find((topic) => topic.id === currentQuestion.topicId) : null;

  const checkedQuestions = allQuestions.filter((question) => getAnswer(state, question.id).checked);
  const correctCount = checkedQuestions.filter((question) => getAnswer(state, question.id).correct).length;
  const incorrectCount = checkedQuestions.length - correctCount;
  const attemptedCount = checkedQuestions.length;
  const overallAccuracy = attemptedCount ? Math.round((correctCount / attemptedCount) * 100) : 0;
  const completion = allQuestions.length ? Math.round((attemptedCount / allQuestions.length) * 100) : 0;
  const unansweredCount = allQuestions.length - attemptedCount;
  const flaggedCount = allQuestions.filter((question) => getAnswer(state, question.id).flagged).length;
  const bankStats = bankQuestions.reduce((acc, question) => {
    const answer = getAnswer(state, question.id);
    if (answer.checked) {
      acc.attempted += 1;
      if (answer.correct) acc.correct += 1;
      else acc.incorrect += 1;
    }
    if (answer.flagged) acc.flagged += 1;
    return acc;
  }, { attempted: 0, correct: 0, incorrect: 0, flagged: 0 });

  const resolvedTheme = state.theme === 'system' ? (systemDark ? 'dark' : 'light') : state.theme;

  useEffect(() => {
    if (state.theme !== 'system' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event) => setSystemDark(event.matches);
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [state.theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, state.candidateName);
      localStorage.setItem(profileStorageKey(state.candidateName), JSON.stringify(state));
    } catch {
      setToast('Browser storage is full or unavailable. Export your progress to keep a backup.');
    }
  }, [state]);

  useEffect(() => {
    try { localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(profileList)); }
    catch { setToast('Could not save the profile list in browser storage.'); }
  }, [profileList]);

  useEffect(() => {
    if (!state.timer.running) return undefined;
    const timerId = window.setInterval(() => {
      setState((previous) => {
        if (!previous.timer.running || !previous.timer.endsAt) return previous;
        const remaining = Math.max(0, Math.ceil((previous.timer.endsAt - Date.now()) / 1000));
        if (remaining === previous.timer.remaining && remaining > 0) return previous;
        return {
          ...previous,
          timer: { ...previous.timer, remaining, running: remaining > 0, endsAt: remaining > 0 ? previous.timer.endsAt : null },
        };
      });
    }, 250);
    return () => window.clearInterval(timerId);
  }, [state.timer.running]);

  useEffect(() => {
    if (state.timer.remaining === 0 && !state.timer.running && state.mode === 'mock') {
      setTimeExpired(true);
    }
  }, [state.timer.remaining, state.timer.running, state.mode]);

  useEffect(() => {
    if (state.mode !== 'mock' || !state.timer.running) return undefined;
    const guard = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [state.mode, state.timer.running]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!filteredQuestions.length) return;
    if (!filteredQuestions.some((question) => question.id === state.currentId)) {
      setState((previous) => ({ ...previous, currentId: filteredQuestions[0].id }));
    }
  }, [filteredQuestions, state.currentId]);

  const updateAnswer = useCallback((questionId, patch) => {
    setState((previous) => {
      const existing = getAnswer(previous, questionId);
      return {
        ...previous,
        answers: {
          ...previous.answers,
          [questionId]: { ...existing, ...patch, updatedAt: new Date().toISOString() },
        },
      };
    });
  }, []);

  const goToQuestion = useCallback((questionId) => {
    setState((previous) => ({ ...previous, currentId: questionId }));
    setMobileNavOpen(false);
    setMobileStudyOpen(false);
  }, []);

  const switchBank = (bankId) => {
    const first = QUESTIONS[bankId]?.[0];
    setState((previous) => ({ ...previous, bank: bankId, topic: 'all', difficulty: 'all', filter: 'all', currentId: first?.id ?? null, shuffledIds: null }));
    setShowResults(false);
    setSearch('');
  };

  const selectOption = (optionIndex) => {
    if (!currentQuestion || currentAnswer?.checked) return;
    updateAnswer(currentQuestion.id, { selected: optionIndex });
  };

  const checkAnswer = () => {
    if (!currentQuestion || !currentAnswer || currentAnswer.selected === null || currentAnswer.selected === undefined) return;
    if (currentAnswer.checked) return;
    const correct = currentAnswer.selected === currentQuestion.correctAnswer;
    updateAnswer(currentQuestion.id, { checked: true, correct, attempts: (currentAnswer.attempts || 0) + 1 });
  };

  const retryQuestion = () => {
    if (!currentQuestion || !currentAnswer) return;
    updateAnswer(currentQuestion.id, { selected: null, checked: false, correct: null });
  };

  const toggleFlag = () => {
    if (!currentQuestion || !currentAnswer) return;
    updateAnswer(currentQuestion.id, { flagged: !currentAnswer.flagged });
  };

  const toggleTopicBookmark = () => {
    if (!currentTopic) return;
    setState(previous => {
      const saved = previous.bookmarkedTopics || [];
      const next = saved.includes(currentTopic.id) ? saved.filter(id => id !== currentTopic.id) : [...saved, currentTopic.id];
      return { ...previous, bookmarkedTopics: next };
    });
  };

  const openStudy = (tab = 'reference') => {
    setStudyTab(tab);
    if (state.focus || window.matchMedia?.('(max-width: 1100px)').matches) setMobileStudyOpen(true);
  };

  const revealHint = () => {
    if (!currentQuestion || !currentAnswer) return;
    updateAnswer(currentQuestion.id, { hintRevealed: true });
    openStudy('hint');
  };

  const nextQuestion = () => {
    if (!filteredQuestions.length) return;
    const index = filteredQuestions.findIndex((question) => question.id === currentQuestion?.id);
    if (index < filteredQuestions.length - 1) goToQuestion(filteredQuestions[index + 1].id);
  };

  const previousQuestion = () => {
    if (!filteredQuestions.length) return;
    const index = filteredQuestions.findIndex((question) => question.id === currentQuestion?.id);
    if (index > 0) goToQuestion(filteredQuestions[index - 1].id);
  };

  const nextUnanswered = () => {
    const candidates = filteredQuestions.filter((question) => !getAnswer(state, question.id).checked);
    if (candidates.length) goToQuestion(candidates[0].id);
    else setToast('There are no unanswered questions in the current view.');
  };

  const shuffleQuestions = () => {
    const shuffled = [...filteredQuestions].map((item) => item.id);
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    setState((previous) => ({ ...previous, shuffledIds: shuffled, currentId: shuffled[0] || previous.currentId }));
  };

  const startMock = () => {
    const seconds = Math.max(1, Math.min(180, Number(timerDraft) || 30)) * 60;
    setState((previous) => ({
      ...previous,
      mode: 'mock',
      topic: 'all',
      difficulty: 'all',
      filter: 'all',
      timer: { duration: seconds, remaining: seconds, running: true, endsAt: Date.now() + seconds * 1000 },
    }));
    setTimeExpired(false);
    setToast('Timed mock started. Your timer continues if you refresh this browser.');
  };

  const pauseTimer = () => {
    setState((previous) => ({ ...previous, timer: { ...previous.timer, running: false, endsAt: null } }));
  };

  const resumeTimer = () => {
    setState((previous) => ({
      ...previous,
      timer: { ...previous.timer, running: true, endsAt: Date.now() + previous.timer.remaining * 1000 },
    }));
  };

  const resetTimer = () => {
    setState((previous) => ({ ...previous, timer: { ...previous.timer, remaining: previous.timer.duration, running: false, endsAt: null } }));
    setTimeExpired(false);
  };

  const resetAllProgress = () => {
    const accepted = window.confirm('Reset all saved answers, flags and revealed hints for this browser profile? This cannot be undone unless you exported a backup.');
    if (!accepted) return;
    setState((previous) => ({ ...previous, answers: {}, currentId: QUESTIONS[previous.bank][0]?.id ?? null }));
    setShowResults(false);
    setToast('Practice progress was reset.');
  };

  const switchProfile = (name) => {
    if (!name || name === state.candidateName) { setShowProfiles(false); return; }
    if (state.timer.running && !window.confirm('Switch learner profiles? The current timer will be paused and saved.')) return;
    const saved = loadState(name);
    saved.timer = { ...saved.timer, running: false, endsAt: null };
    localStorage.setItem(ACTIVE_PROFILE_KEY, name);
    setState(saved);
    setShowProfiles(false);
    setShowResults(false);
    setTimeExpired(false);
    setToast(`Switched to ${name}'s local practice profile.`);
  };

  const createProfile = () => {
    const name = profileDraft.trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 40) { setProfileError('Enter a profile name between 2 and 40 characters.'); return; }
    const exists = profileList.some(item => item.toLowerCase() === name.toLowerCase());
    if (exists) { setProfileError('A profile with that name already exists. Select it instead.'); return; }
    const nextProfiles = [...profileList, name];
    setProfileList(nextProfiles);
    const fresh = createDefaultState(name);
    localStorage.setItem(ACTIVE_PROFILE_KEY, name);
    localStorage.setItem(profileStorageKey(name), JSON.stringify(fresh));
    setState(fresh);
    setProfileDraft('');
    setProfileError('');
    setShowProfiles(false);
    setShowResults(false);
    setTimeExpired(false);
    setToast(`Created a separate local profile for ${name}.`);
  };

  const exportProgress = () => {
    const payload = {
      app: 'Java for AI Learning Studio',
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      candidateName: state.candidateName,
      answers: state.answers,
      bookmarkedTopics: state.bookmarkedTopics || [],
      theme: state.theme,
      timer: state.timer,
      bank: state.bank,
      currentId: state.currentId,
    };
    downloadJson(payload, 'java-ai-learning-progress.json');
    setToast('Progress export created. Keep the JSON file as your backup.');
  };

  const importProgress = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      validateImport(payload);
      const accepted = window.confirm('Import this progress file and replace the saved answers in this browser profile?');
      if (!accepted) return;
      setState((previous) => ({
        ...previous,
        answers: payload.answers,
        bookmarkedTopics: Array.isArray(payload.bookmarkedTopics) ? payload.bookmarkedTopics : (previous.bookmarkedTopics || []),
        theme: ['light', 'dark', 'system'].includes(payload.theme) ? payload.theme : previous.theme,
        timer: payload.timer && Number.isFinite(payload.timer.duration) ? { ...previous.timer, ...payload.timer, running: false, endsAt: null } : previous.timer,
      }));
      setImportError('');
      setShowImport(false);
      setToast('Progress imported successfully.');
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'The file could not be imported.');
      setShowImport(true);
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  const finishSession = () => {
    if (!window.confirm('Finish this practice session and open the performance review?')) return;
    pauseTimer();
    setShowResults(true);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) return;
      if (event.key === '/' && searchInputRef.current) { event.preventDefault(); searchInputRef.current.focus(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); nextQuestion(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); previousQuestion(); }
      if (['1', '2', '3', '4'].includes(event.key) && !currentAnswer?.checked) selectOption(Number(event.key) - 1);
      if (event.key.toLowerCase() === 'h' && currentQuestion) revealHint();
      if (event.key.toLowerCase() === 'f' && currentQuestion) toggleFlag();
      if (event.key === 'Escape') { setMobileNavOpen(false); setMobileStudyOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const changeFilter = (filter) => {
    setState((previous) => ({ ...previous, filter, shuffledIds: null }));
    setShowResults(false);
  };

  const topicPerformance = useMemo(() => topics.map((topic) => {
    const qs = allQuestions.filter((question) => question.topicId === topic.id && question.bank === state.bank);
    const checked = qs.filter((question) => getAnswer(state, question.id).checked);
    const correct = checked.filter((question) => getAnswer(state, question.id).correct).length;
    return { id: topic.id, name: topic.name, total: qs.length, attempted: checked.length, correct, accuracy: checked.length ? Math.round(correct / checked.length * 100) : 0 };
  }).filter((item) => item.attempted > 0).sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted), [allQuestions, state]);

  const goToReviewQuestion = (question) => {
    setShowResults(false);
    setState((previous) => ({ ...previous, bank: question.bank, topic: 'all', difficulty: 'all', filter: 'all', currentId: question.id }));
  };

  const currentBank = BANKS.find((bank) => bank.id === state.bank);
  const currentIndex = currentQuestion ? filteredQuestions.findIndex((question) => question.id === currentQuestion.id) : -1;
  const totalInView = filteredQuestions.length;
  const currentIsChecked = Boolean(currentAnswer?.checked);

  const navigatorContent = (
    <div className="navigator-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">QUESTION MAP</span><h2>Navigator</h2></div>
        <button className="icon-button nav-close-mobile" onClick={() => setMobileNavOpen(false)} aria-label="Close navigator">×</button>
      </div>
      <div className="navigator-summary">
        <div><strong>{bankStats.attempted}<span>/{bankQuestions.length}</span></strong><small>checked in this bank</small></div>
        <div className="tiny-progress"><span style={{ width: `${bankQuestions.length ? bankStats.attempted / bankQuestions.length * 100 : 0}%` }} /></div>
      </div>
      <div className="navigator-filters">
        <label className="field-label" htmlFor="navigator-filter">Show questions</label>
        <select id="navigator-filter" value={state.filter} onChange={(event) => changeFilter(event.target.value)}>
          <option value="all">All questions</option>
          <option value="incorrect">Incorrect only</option>
          <option value="unanswered">Unanswered</option>
          <option value="flagged">Flagged for review</option>
        </select>
      </div>
      <div className="question-grid" aria-label="Question numbers">
        {filteredQuestions.map((question) => {
          const answer = getAnswer(state, question.id);
          const active = question.id === currentQuestion?.id;
          const status = answer.checked ? (answer.correct ? 'correct' : 'incorrect') : answer.selected !== null && answer.selected !== undefined ? 'selected' : 'unanswered';
          return (
            <button
              key={question.id}
              type="button"
              className={`question-number ${status} ${active ? 'active' : ''} ${answer.flagged ? 'flagged' : ''}`}
              onClick={() => goToQuestion(question.id)}
              aria-label={`Question ${question.number}, ${topicName(question.topicId)}, ${status}${answer.flagged ? ', flagged' : ''}${active ? ', current' : ''}`}
              aria-current={active ? 'step' : undefined}
              title={`${question.id} · ${status}${answer.flagged ? ' · flagged' : ''}`}
            >
              <span>{question.number}</span><StatusIcon answer={answer} />
            </button>
          );
        })}
        {!filteredQuestions.length && <p className="empty-small">No questions match these filters.</p>}
      </div>
      <div className="navigator-legend">
        <span><i className="legend-dot dot-neutral" />Not checked</span>
        <span><i className="legend-dot dot-green" />Correct</span>
        <span><i className="legend-dot dot-red" />Incorrect</span>
        <span><i className="legend-dot dot-amber" />Flagged</span>
      </div>
      <button className="text-action full-width" onClick={nextUnanswered}>Jump to next unanswered <span>→</span></button>
    </div>
  );

  const studyPanel = (
    <div className="study-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">LEARNING SUPPORT</span><h2>Study panel</h2></div>
        <button className="icon-button study-close-mobile" onClick={() => setMobileStudyOpen(false)} aria-label="Close study panel">×</button>
      </div>
      <div className="study-tabs" role="tablist" aria-label="Study support">
        <button role="tab" aria-selected={studyTab === 'reference'} className={studyTab === 'reference' ? 'active' : ''} onClick={() => setStudyTab('reference')}>Reference</button>
        <button role="tab" aria-selected={studyTab === 'hint'} className={studyTab === 'hint' ? 'active' : ''} onClick={() => setStudyTab('hint')}>Hint</button>
      </div>
      {studyTab === 'hint' ? (
        <div className="study-content" role="tabpanel">
          {currentQuestion ? <>
            <div className="support-callout hint-callout"><span className="support-icon">✦</span><div><strong>Think it through</strong><p>A hint guides your reasoning without revealing the answer.</p></div></div>
            {currentAnswer?.hintRevealed ? <div className="revealed-hint">{currentQuestion.hint}</div> : <div className="locked-hint"><span className="lock-icon">◉</span><strong>Hint is hidden</strong><p>Reveal it when you need a nudge. Your score is not affected.</p><button className="button secondary full-width" onClick={() => updateAnswer(currentQuestion.id, { hintRevealed: true })}>Reveal hint</button></div>}
            {currentAnswer?.hintRevealed && <p className="muted-note">Hint revealed for this question and saved with your practice progress.</p>}
          </> : <div className="empty-panel">Choose a question to see its hint.</div>}
        </div>
      ) : (
        <div className="study-content" role="tabpanel">
          {currentQuestion && currentReference ? <>
            <div className="reference-meta"><span className="reference-tag">{currentQuestion.bank === 'extension' ? 'Beyond syllabus' : (currentTopic?.session || 'Supplementary')}</span><span>{currentTopic?.name}</span>{currentTopic && <button className={`topic-bookmark ${(state.bookmarkedTopics || []).includes(currentTopic.id) ? 'saved' : ''}`} onClick={toggleTopicBookmark} aria-pressed={(state.bookmarkedTopics || []).includes(currentTopic.id)}>{(state.bookmarkedTopics || []).includes(currentTopic.id) ? '★ Saved topic' : '☆ Bookmark topic'}</button>}</div>
            <h3 className="reference-title">{currentReference.title}</h3>
            <p className="reference-overview">{currentReference.overview}</p>
            {currentReference.sections.map((section) => <section className="reference-section" key={section.heading}><h4>{section.heading}</h4><p>{section.body}</p></section>)}
            {currentReference.code && <pre className="code-block"><code>{currentReference.code}</code></pre>}
            <div className="reference-footer">Reference material is organised by topic and reused across related questions.</div>
          </> : <div className="empty-panel">Reference material will appear here when a question is selected.</div>}
        </div>
      )}
    </div>
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true"><span>J</span><i>17</i></div>
          <div><strong>Learning Studio</strong><small>PGCP-AI · Java programming</small></div>
        </div>
        <div className="topbar-right">
          <div className="candidate-field">
            <label htmlFor="candidate-name">LEARNER</label>
            <input id="candidate-name" value={state.candidateName} readOnly aria-label="Active learner profile" />
          </div>
          <div className="theme-control">
            <span aria-hidden="true">◐</span>
            <select aria-label="Theme preference" value={state.theme} onChange={(event) => setState((previous) => ({ ...previous, theme: event.target.value }))}>
              <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </div>
          <button className="icon-button" onClick={() => { setProfileError(''); setShowProfiles(true); }} title="Switch or create learner profile" aria-label="Manage learner profiles">♙</button>
          <button className={`icon-button focus-toggle ${state.focus ? 'selected' : ''}`} onClick={() => setState((previous) => ({ ...previous, focus: !previous.focus }))} title="Toggle focus mode" aria-pressed={state.focus}>⌗</button>
          <button className="icon-button" onClick={exportProgress} title="Export progress" aria-label="Export progress">⇩</button>
          <button className="icon-button" onClick={() => setShowImport(true)} title="Import progress" aria-label="Import progress">⇧</button>
        </div>
      </header>

      <main className="main-shell">
        <section className="page-heading">
          <div>
            <div className="breadcrumbs"><span>PGCP-AI</span><span>/</span><span>August 2026</span><span>/</span><b>Advanced Programming for AI</b></div>
            <h1>Java Programming <span>Practice workspace</span></h1>
            <p>Learn the concepts, trace the code, and build confidence one question at a time.</p>
          </div>
          <div className="heading-actions">
            <div className={`timer-chip ${state.timer.remaining <= 60 && state.timer.remaining > 0 && state.timer.running ? 'timer-warning' : ''}`}><span className={state.timer.running ? 'pulse-dot' : 'timer-dot'} />{formatTime(state.timer.remaining)}<small>{state.timer.remaining === 0 && state.mode === 'mock' ? 'expired' : state.timer.running ? 'running' : 'timer'}</small></div>
            <button className="button secondary" onClick={() => setMobileNavOpen(true)}><span>▦</span> Questions</button>
            <button className="button primary" onClick={() => openStudy('reference')}><span>▤</span> Study notes</button>
          </div>
        </section>

        <section className="stats-grid" aria-label="Overall progress">
          <StatCard label="Question bank" value={allQuestions.length} helper="across 3 banks" icon="▤" />
          <StatCard label="Attempted" value={attemptedCount} helper={`${unansweredCount} not checked`} icon="◷" />
          <StatCard label="Correct" value={correctCount} helper={`${incorrectCount} incorrect`} tone="success" icon="✓" />
          <StatCard label="Accuracy" value={`${overallAccuracy}%`} helper={`${completion}% overall completion`} tone="accent" icon="◒" />
          <StatCard label="Flagged" value={flaggedCount} helper="saved for revision" tone="warning" icon="⚑" />
        </section>

        <section className="workspace-controls">
          <div className="bank-tabs" role="tablist" aria-label="Question banks">
            {BANKS.map((bank) => (
              <button key={bank.id} className={`bank-tab ${state.bank === bank.id ? 'active' : ''}`} role="tab" aria-selected={state.bank === bank.id} onClick={() => switchBank(bank.id)}>
                <span className="bank-icon">{bank.icon}</span><span className="bank-tab-text"><strong>{bank.label}</strong><small>{QUESTIONS[bank.id].length} questions</small></span>
              </button>
            ))}
          </div>
          <div className="filters-row">
            <label className="select-wrap"><span>TOPIC</span><select value={state.topic} onChange={(event) => setState((previous) => ({ ...previous, topic: event.target.value, currentId: null, shuffledIds: null }))}><option value="all">All topics</option><option value="bookmarked">Bookmarked topics ({(state.bookmarkedTopics || []).length})</option>{topics.map((topic) => <option value={topic.id} key={topic.id}>{topic.name}</option>)}</select></label>
            <label className="select-wrap"><span>DIFFICULTY</span><select value={state.difficulty} onChange={(event) => setState((previous) => ({ ...previous, difficulty: event.target.value, currentId: null }))}><option value="all">All levels</option><option value="basic">Basic</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="expert">Expert</option></select></label>
            <label className="search-field"><span aria-hidden="true">⌕</span><input ref={searchInputRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search question or topic" aria-label="Search questions" /><kbd> / </kbd></label>
            <button className="button ghost shuffle-button" onClick={shuffleQuestions}>⤨ Shuffle</button>
          </div>
        </section>

        {!state.focus && <div className="desktop-columns">
          <aside className="left-rail">{navigatorContent}</aside>
          <section className="question-area">
            {showResults ? (
              <ResultsView
                total={bankQuestions.length}
                bank={currentBank}
                attempted={bankStats.attempted}
                correct={bankStats.correct}
                incorrect={bankStats.incorrect}
                flagged={bankStats.flagged}
                accuracy={bankStats.attempted ? Math.round(bankStats.correct / bankStats.attempted * 100) : 0}
                topicPerformance={topicPerformance}
                questions={allQuestions}
                state={state}
                timer={state.timer}
                onReview={goToReviewQuestion}
                onBack={() => setShowResults(false)}
              />
            ) : (
              <QuestionView
                question={currentQuestion}
                answer={currentAnswer}
                currentIndex={currentIndex}
                total={totalInView}
                bank={currentBank}
                onSelect={selectOption}
                onCheck={checkAnswer}
                onRetry={retryQuestion}
                onFlag={toggleFlag}
                onHint={revealHint}
                onPrevious={previousQuestion}
                onNext={nextQuestion}
                onFinish={finishSession}
                onStudy={() => openStudy('reference')}
                onFilterClear={() => { setState((previous) => ({ ...previous, filter: 'all', topic: 'all', difficulty: 'all' })); setSearch(''); }}
              />
            )}
          </section>
          {!state.focus && <aside className="right-rail">{studyPanel}</aside>}
        </div>}

        {state.focus && <section className="focus-question-area">
          <div className="focus-toolbar"><span><b>Focus mode</b> · side panels hidden</span><button className="button secondary" onClick={() => setState((previous) => ({ ...previous, focus: false }))}>Exit focus mode</button></div>
          {showResults ? <ResultsView total={bankQuestions.length} bank={currentBank} attempted={bankStats.attempted} correct={bankStats.correct} incorrect={bankStats.incorrect} flagged={bankStats.flagged} accuracy={bankStats.attempted ? Math.round(bankStats.correct / bankStats.attempted * 100) : 0} topicPerformance={topicPerformance} questions={allQuestions} state={state} timer={state.timer} onReview={goToReviewQuestion} onBack={() => setShowResults(false)} /> : <QuestionView question={currentQuestion} answer={currentAnswer} currentIndex={currentIndex} total={totalInView} bank={currentBank} onSelect={selectOption} onCheck={checkAnswer} onRetry={retryQuestion} onFlag={toggleFlag} onHint={revealHint} onPrevious={previousQuestion} onNext={nextQuestion} onFinish={finishSession} onStudy={() => openStudy('reference')} onFilterClear={() => { setState((previous) => ({ ...previous, filter: 'all', topic: 'all', difficulty: 'all' })); setSearch(''); }} />}
        </section>}

        <section className="below-tools">
          <div className="timer-card">
            <div className="tool-title"><span className="tool-icon">◷</span><div><strong>Focus timer</strong><small>Timestamp-based countdown</small></div></div>
            <div className="timer-display">{formatTime(state.timer.remaining)}</div>
            <div className="timer-settings"><label>Minutes <input aria-label="Timer duration in minutes" type="number" min="1" max="180" value={timerDraft} onChange={(event) => setTimerDraft(event.target.value)} /></label><button className="button primary small" onClick={startMock}>Start timed mock</button><button className="button secondary small" onClick={state.timer.running ? pauseTimer : resumeTimer} disabled={!state.timer.running && state.timer.remaining <= 0}>{state.timer.running ? 'Pause' : 'Resume'}</button><button className="button ghost small" onClick={resetTimer}>Reset</button></div>
          </div>
          <div className="session-card">
            <div className="tool-title"><span className="tool-icon">▤</span><div><strong>Session tools</strong><small>Review, revise and back up</small></div></div>
            <div className="session-actions"><button className="button secondary" onClick={() => { changeFilter('incorrect'); setShowResults(false); }}>Review incorrect <b>{incorrectCount}</b></button><button className="button secondary" onClick={() => { changeFilter('flagged'); setShowResults(false); }}>Flagged <b>{flaggedCount}</b></button><button className="button secondary" onClick={finishSession}>Finish & view results</button><button className="button ghost" onClick={resetAllProgress}>Reset progress</button></div>
          </div>
        </section>

        <footer className="app-footer"><span>Java 17 LTS · Syllabus-aligned · PGCP-AI August 2026</span><span>Progress is stored locally in this browser <i>·</i> <button onClick={exportProgress}>Export backup</button></span></footer>
      </main>

      {mobileNavOpen && <div className="mobile-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileNavOpen(false); }}><aside className="mobile-drawer left-drawer">{navigatorContent}</aside></div>}
      {mobileStudyOpen && <div className="mobile-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobileStudyOpen(false); }}><aside className="mobile-drawer right-drawer">{studyPanel}</aside></div>}

      {showProfiles && <div className="modal-backdrop"><div className="modal-card profile-modal"><button className="modal-close" onClick={() => setShowProfiles(false)} aria-label="Close">×</button><div className="modal-icon">♙</div><h2>Learner profiles</h2><p>Each profile keeps its own answers, flags, hints, theme and timer settings in this browser. Profiles do not sync between devices.</p><label className="profile-select-label">Switch profile<select value={state.candidateName} onChange={(event) => switchProfile(event.target.value)}>{profileList.map(name => <option key={name} value={name}>{name}{name === state.candidateName ? ' · active' : ''}</option>)}</select></label><div className="profile-create"><label htmlFor="new-profile-name">Create a new profile</label><input id="new-profile-name" value={profileDraft} onChange={(event) => setProfileDraft(event.target.value)} maxLength={40} placeholder="Enter learner name" /><button className="button primary" onClick={createProfile}>Create profile</button></div>{profileError && <div className="error-message">{profileError}</div>}<div className="modal-actions"><button className="button secondary" onClick={() => setShowProfiles(false)}>Done</button></div></div></div>}

      {timeExpired && <div className="modal-backdrop"><div className="modal-card"><div className="modal-icon warning-icon">◷</div><h2>Time is up</h2><p>Your timed practice window has ended. Your checked answers and selections have been saved.</p><div className="modal-actions"><button className="button secondary" onClick={() => setTimeExpired(false)}>Continue reviewing</button><button className="button primary" onClick={() => { setTimeExpired(false); setShowResults(true); }}>View results</button></div></div></div>}

      {showImport && <div className="modal-backdrop"><div className="modal-card import-modal"><button className="modal-close" onClick={() => { setShowImport(false); setImportError(''); }} aria-label="Close">×</button><div className="modal-icon">⇧</div><h2>Import progress</h2><p>Choose a JSON backup created by Java for AI Learning Studio. The file will be validated before any saved answers are replaced.</p>{importError && <div className="error-message">{importError}</div>}<div className="modal-actions"><button className="button secondary" onClick={() => { setShowImport(false); setImportError(''); }}>Cancel</button><button className="button primary" onClick={() => importInputRef.current?.click()}>Choose JSON file</button></div></div></div>}

      {toast && <div className="toast" role="status">{toast}</div>}
      <input ref={importInputRef} type="file" accept="application/json,.json" hidden onChange={importProgress} />
    </div>
  );
}

function QuestionView({ question, answer, currentIndex, total, bank, onSelect, onCheck, onRetry, onFlag, onHint, onPrevious, onNext, onFinish, onStudy, onFilterClear }) {
  if (!question) {
    return <div className="empty-question"><div className="empty-illustration">⌕</div><h2>No questions in this view</h2><p>Try clearing the search or filters to see questions from this bank.</p><button className="button primary" onClick={onFilterClear}>Clear filters</button></div>;
  }
  const checked = Boolean(answer?.checked);
  const selected = answer?.selected;
  const correct = checked && answer?.correct;
  return (
    <div className="question-card">
      <div className="question-topline"><div className="question-breadcrumb"><span>{bank?.short || 'Question bank'}</span><i>/</i><span>{topicName(question.topicId)}</span></div><span className="question-position">{currentIndex + 1} <span>of {total}</span></span></div>
      <div className="question-heading-row"><div className="question-id-wrap"><span className="global-number">Q{question.number}</span><span className="question-id">{question.id}</span></div><div className="question-tags"><DifficultyPill level={question.difficulty} /><span className="type-pill">{question.type === 'code' ? 'Code practice' : question.type}</span></div></div>
      <div className="question-progress"><span style={{ width: `${total ? ((currentIndex + 1) / total) * 100 : 0}%` }} /></div>
      <h2 className="question-title">{question.question}</h2>
      {question.code && <pre className="question-code"><div className="code-language"><span>JAVA 17</span><button onClick={() => navigator.clipboard?.writeText(question.code)} title="Copy code">Copy</button></div><code>{question.code}</code></pre>}
      <div className="answers-label"><span>SELECT ONE ANSWER</span><small>Choose the best option, then check your answer.</small></div>
      <div className="answer-list">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = checked && index === question.correctAnswer;
          const isWrongSelected = checked && isSelected && !answer.correct;
          return (
            <button
              type="button"
              key={`${question.id}-option-${index}`}
              className={`answer-option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct-answer' : ''} ${isWrongSelected ? 'wrong-answer' : ''} ${checked ? 'locked' : ''}`}
              onClick={() => onSelect(index)}
              disabled={checked}
              aria-pressed={isSelected}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {isCorrect && <span className="option-result" aria-label="Correct answer">✓</span>}
              {isWrongSelected && <span className="option-result" aria-label="Your selected answer is incorrect">×</span>}
              {!checked && isSelected && <span className="option-result selected-dot">●</span>}
            </button>
          );
        })}
      </div>
      {checked && <div className={`answer-feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}`}>
        <div className="feedback-heading"><span className="feedback-icon">{correct ? '✓' : '×'}</span><div><strong>{correct ? 'Correct answer' : 'Not quite — review the reasoning'}</strong><small>{correct ? 'Well done. Keep connecting the concept to the rule.' : `You selected option ${String.fromCharCode(65 + selected)}. The correct answer is ${String.fromCharCode(65 + question.correctAnswer)}.`}</small></div></div>
        <p className="feedback-explanation">{question.explanation}</p>
        {!correct && <div className="selected-explanation"><b>Why your option is incorrect</b><p>{question.optionExplanations[selected]}</p></div>}
        <details className="option-review"><summary>Review all four options</summary><div className="option-review-list">{question.optionExplanations.map((explanation, index) => <div className={index === question.correctAnswer ? 'review-correct' : ''} key={index}><b>{String.fromCharCode(65 + index)}.</b><span>{explanation}</span></div>)}</div></details>
      </div>}
      <div className="question-utility-row">
        <button className={`utility-button ${answer?.flagged ? 'is-flagged' : ''}`} onClick={onFlag}><span>{answer?.flagged ? '⚑' : '⚐'}</span>{answer?.flagged ? 'Flagged for review' : 'Flag for review'}</button>
        <button className="utility-button" onClick={onHint}><span>✦</span> Hint</button>
        <button className="utility-button" onClick={onStudy}><span>▤</span> Reference</button>
        {checked && <button className="utility-button retry-action" onClick={onRetry}><span>↻</span> Try again</button>}
        {answer?.attempts > 0 && <span className="attempt-counter">{answer.attempts} {answer.attempts === 1 ? 'check' : 'checks'}</span>}
      </div>
      <div className="question-actions">
        <button className="button secondary" onClick={onPrevious} disabled={currentIndex <= 0}>← Previous</button>
        {!checked ? <button className="button primary check-button" onClick={onCheck} disabled={selected === null || selected === undefined}>Check answer <span>↗</span></button> : <button className="button primary" onClick={onNext} disabled={currentIndex >= total - 1}>Next question <span>→</span></button>}
        <button className="button ghost finish-button" onClick={onFinish}>Finish session</button>
      </div>
      <div className="keyboard-hints"><span><kbd>1–4</kbd> choose option</span><span><kbd>←</kbd><kbd>→</kbd> navigate</span><span><kbd>H</kbd> hint</span><span><kbd>F</kbd> flag</span></div>
    </div>
  );
}

function ResultsView({ total, bank, attempted, correct, incorrect, flagged, accuracy, topicPerformance, questions, state, timer, onReview, onBack }) {
  const unanswered = total - attempted;
  const wrongQuestions = questions.filter((question) => question.bank === bank?.id && getAnswer(state, question.id).checked && !getAnswer(state, question.id).correct);
  const weakTopics = topicPerformance.filter((topic) => topic.attempted > 0).slice(0, 4);
  const difficultyPerformance = ['basic', 'medium', 'hard', 'expert'].map(level => {
    const items = questions.filter(question => question.bank === bank?.id && question.difficulty === level);
    const checked = items.filter(question => getAnswer(state, question.id).checked);
    const right = checked.filter(question => getAnswer(state, question.id).correct).length;
    return { level, total: items.length, attempted: checked.length, accuracy: checked.length ? Math.round(right / checked.length * 100) : 0 };
  }).filter(item => item.total > 0);
  const timeTaken = state.mode === 'mock' && timer ? formatTime(Math.max(0, timer.duration - timer.remaining)) : '—';
  return (
    <div className="results-card">
      <div className="results-header"><div><span className="eyebrow">SESSION REVIEW</span><h2>Practice summary</h2><p>{bank?.label || 'Question bank'} · {attempted} questions checked</p></div><button className="button secondary" onClick={onBack}>← Back to practice</button></div>
      <div className="results-score"><div className="score-ring" style={{ '--score': `${accuracy}%` }}><div><strong>{accuracy}%</strong><small>accuracy</small></div></div><div className="score-copy"><strong>{accuracy >= 80 ? 'Strong session' : accuracy >= 60 ? 'Good progress' : 'Keep practising'}</strong><p>{accuracy >= 80 ? 'Your checked answers show a solid grasp of these concepts.' : 'Review the explanations and revisit topics with more incorrect answers.'}</p><span>{correct} correct out of {attempted} checked</span></div></div>
      <div className="results-metrics"><div><b>{total}</b><small>Total</small></div><div><b className="green-text">{correct}</b><small>Correct</small></div><div><b className="red-text">{incorrect}</b><small>Incorrect</small></div><div><b>{unanswered}</b><small>Unattempted</small></div><div><b>{flagged}</b><small>Flagged</small></div><div><b>{timeTaken}</b><small>Time taken</small></div></div>
      <div className="results-sections">
        <section className="results-section"><h3>Topics to revisit</h3>{weakTopics.length ? weakTopics.map((topic) => <div className="topic-result-row" key={topic.id}><div className="topic-result-label"><span>{topic.name}</span><b>{topic.accuracy}%</b></div><div className="topic-result-bar"><span style={{ width: `${topic.accuracy}%` }} /></div><small>{topic.attempted} checked · {topic.total} in this bank</small></div>) : <p className="muted-note">Answer a few questions to unlock topic-level performance insights.</p>}<h4 className="difficulty-breakdown-title">Difficulty breakdown</h4>{difficultyPerformance.map(item => <div className="topic-result-row difficulty-result-row" key={item.level}><div className="topic-result-label"><span>{item.level}</span><b>{item.attempted ? `${item.accuracy}%` : '—'}</b></div><div className="topic-result-bar"><span style={{ width: `${item.accuracy}%` }} /></div><small>{item.attempted} checked · {item.total} available</small></div>)}</section>
        <section className="results-section"><h3>Incorrect answers</h3>{wrongQuestions.length ? wrongQuestions.slice(0, 8).map((question) => <button className="review-question" key={question.id} onClick={() => onReview(question)}><span className="review-q-number">{question.number}</span><span><b>{question.question}</b><small>{topicName(question.topicId)} · {question.difficulty}</small></span><i>→</i></button>) : <p className="muted-note">No incorrect answers in this bank. Unchecked questions remain available for practice.</p>}</section>
      </div>
    </div>
  );
}
