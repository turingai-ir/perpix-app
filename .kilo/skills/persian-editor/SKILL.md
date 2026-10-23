---
name: persian-editor
description: Edit Persian (fa-IR) UI and marketing copy for grammar, natural wording, colloquial register, RTL punctuation, Persian letters, and half-spaces. Use when Persian text sounds translated, formal, robotic, or inconsistent.
---

# Persian Copy Editor

Edit supplied Persian with the smallest change that improves clarity and naturalness. Preserve the product meaning, scope, promised behavior, and legal or pricing conditions.

## Editing Workflow

1. Read the surrounding UI and identify whether its register is polite, neutral, or informal.
2. Correct grammar, word order, mechanical typography, and unnatural literal translations.
3. Replace bureaucratic wording with direct Persian only when it preserves the meaning.
4. Return the polished Persian without explanations for a short string. For an important sentence, mention only a changed meaning-risk if one exists.

## Natural Persian

- Prefer active and direct constructions: `بعداً بهت خبر می‌دیم` over `اطلاع‌رسانی انجام خواهد شد`.
- Put the verb naturally toward the end of a sentence.
- Drop words that Persian does not need: `یک حساب بساز` is usually `حساب بساز`.
- Use spoken forms such as `می‌تونی` or `نداری` only when the product voice uses `تو`.
- Do not turn an informal product into formal office language, or vice versa.
- Keep a required technical word, product name, URL, identifier, code, price, and number unchanged unless the request is specifically to change it.

## Persian Mechanics

- Use Persian `ی` and `ک`, never Arabic `ي` or `ك`.
- Use `،`، `؛` and `؟` in Persian text.
- Use half-spaces where required: `می‌شود`، `نمی‌توانی`، `فایل‌ها`، `بهترین`.
- Use Persian digits in ordinary Persian prose if that is the local site convention; leave URLs, IDs, versions, code, and machine-readable values unchanged.
- Preserve RTL context and avoid adding English punctuation that breaks its flow.

## AI And Translation Tells

Remove empty framing and translated phrasing when it adds no product information:

- `لازم به ذکر است که`
- `به‌منظور`
- `مورد استفاده قرار می‌گیرد`
- `تجربه‌ای بی‌نظیر`
- `در دنیای امروز`

Use the simpler accurate alternative. Do not add artificial personal anecdotes, fake quotes, or unverifiable statistics to make text feel human.

## Source And License

Adapted for Kilo from the MIT-licensed Persian language skill by Mojtaba Alehosseini:

https://github.com/Mojtaba-Alehosseini/persian-skill
