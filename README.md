<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />

  <br />
  <br />

  <h1>🧠 Neorly</h1>
  <p><strong>AI-помічник для навчання: перетворюй PDF на конспекти, картки та тести</strong></p>

  <p>
    <a href="https://neorly.devs.li" style="font-size: 1.2em; font-weight: bold;">🌐 Відкрити Live Demo</a>
  </p>
</div>

---

## 🚀 Про проєкт
**Neorly** — це веб-додаток, який перетворює нудні лекції, PDF-файли та презентації на структуровані навчальні матеріали. Замість того, щоб годинами перечитувати текст, ти завантажуєш файл і отримуєш готові шпаргалки, флешкартки та тести.

Додаток побудований на сучасному стеку: **Next.js 15**, **Supabase** (Auth + Storage + Postgres) та **Google Gemini API** для генерації контенту.

🔗 **Спробувати зараз:** [https://neorly.devs.li](https://neorly.devs.li)

## ✨ Особливості
- 📄 **Завантаження матеріалів:** Підтримка PDF, DOCX, PPTX та TXT (до 50 МБ).
- 📝 **Розумні конспекти:** AI аналізує текст, виділяє головне та створює структурований Markdown-конспект з жирним шрифтом та списками.
- 🃏 **Флешкартки:** Автоматична генерація карток (питання-відповідь) з можливістю вибору кількості (10-25).
- 🧪 **Інтерактивні тести:** Проходження тестів з миттєвою перевіркою, підсвічуванням правильних відповідей та поясненнями.
- ⚡ **Spaced Repetition:** Алгоритм інтервального повторення (SM-2) для ефективного запам'ятовування надовго.
- 📊 **Аналітика:** Особистий дашборд із графіком активності, статистикою прогресу та списком останніх матеріалів.
- 📑 **Експорт:** Можливість зберегти конспект у форматі PDF (через браузер).
- 🔐 **Авторизація:** Реєстрація та вхід через email/пароль (Supabase Auth).

## 🛠️ Технологічний стек
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend:** Next.js Route Handlers (API)
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Auth & Storage:** Supabase
- **AI Integration:** Google Gemini API (Structured Output / JSON Schema)
- **PDF Parsing:** `unpdf` (сумісний з Vercel)
- **Deployment:** Vercel + Custom Domain (devs.li)

## 🧠 Як це працює
1. Користувач завантажує файл через сторінку `/upload`.
2. Сервер витягує текст за допомогою `unpdf` (для PDF) та інших парсерів.
3. Текст відправляється в **Gemini API** з чіткою JSON-схемою (structured output).
4. Отримані дані (конспект, картки, тести) зберігаються в базу даних (PostgreSQL).
5. Користувач переходить на сторінку пакету `/library/[id]` і починає навчання.

---

<details>
<summary><b>🛠️ Для розробників: як запустити локально</b> (натисніть, щоб розгорнути)</summary>

Якщо ти хочеш запустити проєкт на своєму комп'ютері (наприклад, для розробки або тестування), виконай ці кроки:

1. **Клонуй репозиторій:**
   ```bash
   git clone https://github.com/katyasurina/neorly.git
   cd neorly