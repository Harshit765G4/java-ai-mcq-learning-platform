import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.join(root, 'src', 'data');
const banks = [
  ['core', 'questions-core.json'],
  ['practical', 'questions-practical.json'],
  ['extension', 'questions-extension.json'],
];
const topics = JSON.parse(fs.readFileSync(path.join(data, 'topics.json'), 'utf8'));
const topicById = new Map(topics.map(topic => [topic.id, topic]));
const refs = JSON.parse(fs.readFileSync(path.join(data, 'references.json'), 'utf8'));
const all = [];
const errors = [];
const warnings = [];
for (const [bank, file] of banks) {
  const rows = JSON.parse(fs.readFileSync(path.join(data, file), 'utf8'));
  for (const q of rows) {
    if (q.bank !== bank) errors.push(`${q.id}: bank field does not match ${bank}`);
    if (!q.id || !q.id.startsWith({core:'CORE-', practical:'PRAC-', extension:'EXT-'}[bank])) errors.push(`${q.id}: invalid ID prefix`);
    if (!Number.isInteger(q.number) || q.number < 1) errors.push(`${q.id}: invalid global question number`);
    if (!topicById.has(q.topicId)) errors.push(`${q.id}: unknown topic ${q.topicId}`);
    if (!refs.some(r => r.id === q.referenceId)) errors.push(`${q.id}: unknown reference ${q.referenceId}`);
    if (topicById.has(q.topicId) && topicById.get(q.topicId).referenceId !== q.referenceId) errors.push(`${q.id}: referenceId does not match the topic's reference mapping`);
    if (typeof q.question !== 'string' || q.question.trim().length < 18) errors.push(`${q.id}: missing or very short prompt`);
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${q.id}: must have exactly four options`);
    else {
      const normal = q.options.map(x => String(x).trim());
      if (new Set(normal).size !== 4) errors.push(`${q.id}: duplicate answer options`);
      if (normal.some(x => x.length < 5)) warnings.push(`${q.id}: one or more options are very short`);
    }
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3) errors.push(`${q.id}: invalid correctAnswer index`);
    if (typeof q.explanation !== 'string' || q.explanation.trim().length < 45) errors.push(`${q.id}: explanation is too short or missing`);
    if (!Array.isArray(q.optionExplanations) || q.optionExplanations.length !== 4 || q.optionExplanations.some(x => !String(x).trim())) errors.push(`${q.id}: must have four option explanations`);
    if (typeof q.hint !== 'string' || q.hint.trim().length < 12) errors.push(`${q.id}: hint is too short or missing`);
    if (q.type === 'code' && (!q.code || q.code.trim().length < 10)) errors.push(`${q.id}: code question is missing its code snippet`);
    all.push(q);
  }
}
const ids = all.map(q => q.id);
const nums = all.map(q => q.number);
if (new Set(ids).size !== ids.length) errors.push('Duplicate question IDs found');
if (new Set(nums).size !== nums.length) errors.push('Duplicate global question numbers found');
const normalise = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
const exact = new Map();
for (const q of all) {
  const key = normalise(q.question).join(' ');
  if (exact.has(key)) errors.push(`Exact duplicate prompt: ${exact.get(key)} and ${q.id}`);
  exact.set(key, q.id);
}
// Lightweight lexical similarity screen. It is a screening aid, not a semantic model.
const stop = new Set(['what','which','how','why','does','the','a','an','is','are','of','to','in','for','by','on','with','this','that','when','java','code','following','statement','correct','about','result','printed','happens','execute','executes','runs','running']);
const tokenSet = s => new Set(normalise(s).filter(t => !stop.has(t)));
for (let i = 0; i < all.length; i++) {
  const a = tokenSet(all[i].question);
  if (!a.size) continue;
  for (let j = i + 1; j < all.length; j++) {
    const b = tokenSet(all[j].question);
    if (!b.size) continue;
    let intersection = 0;
    for (const token of a) if (b.has(token)) intersection++;
    const similarity = intersection / (a.size + b.size - intersection);
    if (similarity >= 0.78) warnings.push(`Review possible prompt similarity (${similarity.toFixed(2)}): ${all[i].id} / ${all[j].id}`);
  }
}
const counts = Object.fromEntries(banks.map(([bank]) => [bank, all.filter(q => q.bank === bank).length]));
const similarityWarnings = warnings.filter(message => message.startsWith('Review possible prompt similarity'));
const topicCoverage = Object.fromEntries(topics.map(topic => [topic.id, { name: topic.name, questions: all.filter(q => q.topicId === topic.id).length }]));
const difficultyCounts = Object.fromEntries(['basic', 'medium', 'hard', 'expert'].map(level => [level, all.filter(q => q.difficulty === level).length]));
const typeCounts = Object.fromEntries([...new Set(all.map(q => q.type))].sort().map(type => [type, all.filter(q => q.type === type).length]));
const shortOptionWarnings = warnings.filter(message => message.includes('options are very short'));
const report = {
  auditedAt: new Date().toISOString(),
  counts,
  topicCoverage,
  difficultyCounts,
  typeCounts,
  shortOptionWarningCount: shortOptionWarnings.length,
  requestedCountConflicts: { headingsSum: 550, detailedBankTargetsSum: 650, statedOverallTarget: 600 },
  total: all.length,
  checks: {
    uniqueIds: new Set(ids).size === ids.length,
    uniqueGlobalNumbers: new Set(nums).size === nums.length,
    validAnswerIndexes: all.every(q => Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer <= 3),
    fourOptionsPerQuestion: errors.every(e => !e.includes('exactly four options') && !e.includes('duplicate answer options')), 
    explanationsAndHintsPresent: errors.every(e => !e.includes('explanation') && !e.includes('hint')),
    validTopicAndReferenceLinks: errors.every(e => !e.includes('unknown topic') && !e.includes('unknown reference')),
    codeSnippetsPresentForCodeQuestions: errors.every(e => !e.includes('code question')),
    allSyllabusTopicsRepresented: topics.every(topic => all.some(q => q.topicId === topic.id)),
    lexicalSimilarityScreen: similarityWarnings.length ? `${similarityWarnings.length} possible prompt pairs flagged for human review by the lightweight Jaccard screen.` : 'No high-similarity prompt pairs were found by the lightweight Jaccard screen.'
  },
  warnings,
  errors,
  limitations: [
    'Lexical similarity screening cannot prove semantic originality; human review is still required.',
    'The delivered bank is a curated starter set and does not meet the requested 600/650-question target.',
    'Compilation/runtime execution of every illustrative code snippet has not been performed by this validator.'
  ]
};
fs.writeFileSync(path.join(root, 'QUESTION-QUALITY-AUDIT.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ counts, total: all.length, errors: errors.length, warnings: warnings.length, sampleWarnings: warnings.slice(0, 12) }, null, 2));
if (errors.length) process.exitCode = 1;
