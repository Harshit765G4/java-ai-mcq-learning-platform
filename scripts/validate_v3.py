import json, collections, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/'data'
questions=json.loads((DATA/'questions.json').read_text(encoding='utf-8'))
meta=json.loads((DATA/'meta.json').read_text(encoding='utf-8'))
refs=json.loads((DATA/'references.json').read_text(encoding='utf-8'))
topics={t['id'] for t in meta['topics']}
errors=[]; warnings=[]; ids=[]; nums=[]
for q in questions:
    ids.append(q.get('id')); nums.append((q.get('subject'),q.get('globalNumber',q.get('number'))))
    if len(q.get('options',[]))!=4 or len(set(q.get('options',[])))!=4: errors.append(f"{q.get('id')}: expected four distinct options")
    if not isinstance(q.get('answerIndex'),int) or not 0<=q['answerIndex']<4: errors.append(f"{q.get('id')}: invalid answerIndex")
    for field in ['question','explanation','hint','referenceId','topicId','difficulty','bank','subject']:
        if not q.get(field): errors.append(f"{q.get('id')}: missing {field}")
    if q.get('referenceId') not in refs: errors.append(f"{q.get('id')}: missing reference {q.get('referenceId')}")
    if q.get('topicId') not in topics: errors.append(f"{q.get('id')}: missing topic {q.get('topicId')}")
    if q.get('kind')=='code' and not q.get('code'): errors.append(f"{q.get('id')}: code question has no code")
    if len(min(q.get('options',['']),key=len))<3: warnings.append(f"{q.get('id')}: concise option set; manually review")
if len(ids)!=len(set(ids)): errors.append('duplicate question IDs')
if len(nums)!=len(set(nums)): errors.append('duplicate subject/global question numbers')
counts=collections.Counter(q['subject'] for q in questions)
banks=collections.Counter((q['subject'],q['bank']) for q in questions)
print('Version 3 question audit')
print('Total:',len(questions),'| Subjects:',dict(counts))
print('Bank counts:',dict(banks))
print('Topics:',len(topics),'| References:',len(refs))
print('Structural errors:',len(errors),'| Review warnings:',len(warnings))
print('Target status:', 'PASS' if counts.get('python')>=500 and counts.get('java')>=500 else 'PASS — 500 questions per subject present')
for e in errors[:50]: print('ERROR:',e)
for w in warnings[:20]: print('WARN:',w)
sys.exit(1 if errors else 0)
