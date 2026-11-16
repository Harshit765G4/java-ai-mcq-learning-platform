import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { core, practical, extension } from './question-seeds.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');
const registryPath = path.join(dataDir, 'question-registry.json');
const topics = JSON.parse(fs.readFileSync(path.join(dataDir, 'topics.json'), 'utf8'));
const references = JSON.parse(fs.readFileSync(path.join(dataDir, 'references.json'), 'utf8'));
const bankDefs = [
  { key: 'core', prefix: 'CORE', file: 'questions-core.json', items: core },
  { key: 'practical', prefix: 'PRAC', file: 'questions-practical.json', items: practical },
  { key: 'extension', prefix: 'EXT', file: 'questions-extension.json', items: extension },
];

const registry = fs.existsSync(registryPath)
  ? JSON.parse(fs.readFileSync(registryPath, 'utf8'))
  : { nextGlobalNumber: 1, banks: { core: {}, practical: {}, extension: {} } };
registry.banks ??= { core: {}, practical: {}, extension: {} };
let maxGlobal = Math.max(0, ...Object.values(registry.banks).flatMap(bank => Object.values(bank).map(x => x.number ?? 0)));
let added = 0;

for (const bank of bankDefs) {
  registry.banks[bank.key] ??= {};
  const output = [];
  for (let index = 0; index < bank.items.length; index++) {
    const seed = bank.items[index];
    const ordinal = index + 1;
    const id = `${bank.prefix}-${String(ordinal).padStart(4, '0')}`;
    if (!registry.banks[bank.key][id]) {
      maxGlobal += 1;
      registry.banks[bank.key][id] = { number: maxGlobal };
      added += 1;
    }
    const topic = topics.find(t => t.id === seed.topicId);
    const reference = references.find(r => r.id === (topic?.referenceId));
    if (!topic || !reference) throw new Error(`Unknown topic/reference for ${id}: ${seed.topicId}`);
    if (!Array.isArray(seed.options) || seed.options.length !== 4) throw new Error(`${id} must have four options`);
    const optionExplanations = seed.options.map((option, optionIndex) =>
      optionIndex === seed.correctAnswer
        ? `Correct. ${seed.rationale}`
        : seed.wrongWhy[optionIndex < seed.correctAnswer ? optionIndex : optionIndex - 1] ?? 'This option does not match the Java language rule being tested.'
    );
    output.push({
      id,
      number: registry.banks[bank.key][id].number,
      bank: bank.key,
      topicId: seed.topicId,
      difficulty: seed.difficulty,
      type: seed.type,
      question: seed.question,
      ...(seed.code ? { code: seed.code } : {}),
      options: seed.options,
      correctAnswer: seed.correctAnswer,
      explanation: seed.rationale,
      optionExplanations,
      hint: seed.hint,
      referenceId: reference.id,
    });
  }
  fs.writeFileSync(path.join(dataDir, bank.file), JSON.stringify(output, null, 2) + '\n');
}
registry.nextGlobalNumber = maxGlobal + 1;
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Built ${core.length + practical.length + extension.length} questions (${core.length} core, ${practical.length} practical, ${extension.length} extension). New registry entries: ${added}.`);
