/**
 * questionBank.mjs မှ မေးခွန်း ၁၀၀ ထုတ်ပြီး src/data/questions.json သို့ ရေးသားသည်။
 * လုပ်ဆောင်ချက်: npm run generate-questions
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { QUESTION_BANK } from './questionBank.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'src', 'data')
const out = join(dataDir, 'questions.json')

if (QUESTION_BANK.length !== 100) {
  console.error('မေးခွန်း အရေအတွက် မှားနေသည်:', QUESTION_BANK.length)
  process.exit(1)
}

const questions = QUESTION_BANK.map((entry, i) => {
  const [fn, question, reverse, weight] =
    entry.length >= 4 ? entry : [...entry, undefined]
  return {
    id: i + 1,
    question,
    function: fn,
    reverse: Boolean(reverse),
    weight:
      weight != null && Number(weight) > 0
        ? Number(weight)
        : i % 3 === 0
          ? 1.5
          : 1.0,
  }
})

mkdirSync(dataDir, { recursive: true })
writeFileSync(out, JSON.stringify(questions, null, 2), 'utf8')
console.log('ရေးသားပြီး:', out, '— စုစုပေါင်း', questions.length)
