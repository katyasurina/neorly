# Neorly — AI-помічник для навчання

Невеликий SaaS-проєкт (портфоліо), який дозволяє завантажувати навчальні матеріали, генерувати структуровані конспекти, флешкартки та тести, а потім повторювати їх через алгоритм SM-2.

## Що зроблено (фундамент)

- Next.js 15 (App Router, TypeScript, `src/`)
- Tailwind CSS + shadcn/ui (nova preset)
- Prisma ORM + Supabase Postgres
- Supabase Auth (email/пароль) + Storage (bucket `packs`)
- API routes для створення / отримання / видалення пакетів (`/api/packs`)
- Парсери: PDF, DOCX, PPTX (jszip + fast-xml-parser), TXT
- AI schemas + prompts (stub — реалізація LLM у наступному кроці)
- SM-2 алгоритм повторення (`src/lib/srs/sm2.ts`)
- Усі сторінки-заглушки + sidebar + upload UI

## Як запустити локально

```bash
git clone <url>
cd neorly
npm install
# Створіть .env з тих самих ключів (see .env.example)
# Створіть Supabase-проєкт: Database, Auth (email/password), Storage bucket `packs`
# У bucket налаштуйте: public read, auth write
npx prisma generate
npm run dev
```

## Supabase setup (коротко)

1. Зареєструйтеся на [supabase.com](https://supabase.com)
2. Створіть проект → Database URL з `Project Settings > Database`
3. У `Auth > Settings` ввімкніть Email provider
4. У `Storage` створіть bucket `packs`
5. У bucket `packs` → Policies: `SELECT` — `anon`/`authenticated`, `INSERT`/`UPDATE`/`DELETE` — `authenticated`

## Деплой на Vercel

- Імпортуйте репозиторій у Vercel
- Додайте Environment Variables з `.env.example`
- Build командою: `npm run build`

## Що далі (roadmap)

- [ ] Реалізувати `generate-pack.ts` (OpenAI / Anthropic structured output)
- [ ] Інтегрувати парсер з API (`POST /api/packs` → parse → AI → save notes/flashcards/quiz)
- [ ] Компонент `flashcard-session.tsx` + `quiz-runner.tsx`
- [ ] Сторінка `/review` з алгоритмом SM-2
- [ ] Прогрес-бари та статистика
- [ ] (Позашаблон) AI-чат з RAG, mind maps, транскрипція — не на цьому етапі

---

*Neorly — навчання через структуру.
Co-Authored-By: Claude Code <noreply@anthropic.com>
🤖 Generated with [Claude Code](https://claude.com/claude-code)
