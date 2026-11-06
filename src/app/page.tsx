import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Check, LayoutGrid, TrendingUp, Clock } from 'lucide-react';
import DecodeText from '@/components/decode-text';
import StatsCounter from '@/components/stats-counter';
import LoadingLink from '@/components/ui/loading-link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-mono relative overflow-x-hidden flex flex-col">
      
      {/* Сітка на фоні */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Навігація */}
      <header className="fixed top-0 w-full z-50 border-b border-black/10 bg-[#fafafa]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-indigo-600 text-2xl font-black">N</span> Neorly
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <Link href="#features" className="hover:text-black transition">Features</Link>
            <Link href="#how" className="hover:text-black transition">How it works</Link>
            <Link href="#reviews" className="hover:text-black transition">Reviews</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LoadingLink href="/login" className="text-sm font-medium hover:text-gray-600 transition">
              Sign in
            </LoadingLink>
            <LoadingLink href="/register" className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 hover:bg-indigo-700 transition rounded-none border border-indigo-700/50 shadow-sm">
              Start free
            </LoadingLink>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center w-full">
        
        {/* HERO SECTION */}
        <section className="w-full flex flex-col items-center justify-center min-h-[90vh] px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 text-xs font-medium text-black shadow-sm mb-6">
            <span className="w-2 h-2 bg-indigo-600"></span>
            Built for students
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-center max-w-4xl">
            <span className="text-indigo-600"><DecodeText text="LEARN FASTER" /></span><br />
            with AI intelligence
          </h1>
          
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mt-6 text-center">
            Neorly перетворює твої PDF та конспекти на структуровані дані. Отримуй готові шпаргалки, картки та тести за допомогою AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <LoadingLink href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 text-base font-bold border border-indigo-700/50 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10">
              Start building <ArrowRight className="w-4 h-4" />
            </LoadingLink>
            
            {/* Друга кнопка веде до секції #how */}
            <LoadingLink href="#how" className="w-full sm:w-auto inline-flex items-center justify-center border border-black/20 text-black px-6 py-3 text-base font-medium hover:bg-black/5 transition-all">
              See how it works
            </LoadingLink>
          </div>
          <p className="text-xs text-gray-400 mt-4">No credit card required · Free tier available</p>
        </section>

        {/* PIPELINE */}
        <section id="how" className="w-full max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-16 border-b border-black/10 pb-4">
            <h2 className="text-2xl font-bold">02 // The Pipeline</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-transparent">
              <div className="relative flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-black/10 text-indigo-600 font-bold z-10 shadow-sm">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Upload your file</h3>
                  <p className="text-gray-500 text-sm">Завантаж PDF, DOCX або PPTX. Обери модулі, які хочеш згенерувати.</p>
                </div>
              </div>
              <div className="relative flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-black/10 text-indigo-600 font-bold z-10 shadow-sm">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI parsing & generation</h3>
                  <p className="text-gray-500 text-sm">Нейромережа аналізує текст, виділяє головне і створює структуровані дані.</p>
                </div>
              </div>
              <div className="relative flex items-start gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border border-black/10 text-indigo-600 font-bold z-10 shadow-sm">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Study & track progress</h3>
                  <p className="text-gray-500 text-sm">Вчися за картками, проходь тести та слідкуй за своїм прогресом у дашборді.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white border border-black/10 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 bg-gray-50/50">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 text-xs text-gray-400 font-mono">neorly.app/dashboard</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600"><LayoutGrid /></div>
                    <div>
                      <div className="font-bold">Історія України</div>
                      <div className="text-xs text-gray-500">Створено сьогодні</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-black/5 rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">Flashcards</div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <div className="p-4 border border-black/5 rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">Quizzes</div>
                      <div className="text-2xl font-bold">5</div>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 rounded-lg flex items-end p-2 gap-1">
                    <div className="w-full bg-indigo-200 rounded-t-sm h-[20%]"></div>
                    <div className="w-full bg-indigo-300 rounded-t-sm h-[40%]"></div>
                    <div className="w-full bg-indigo-400 rounded-t-sm h-[60%]"></div>
                    <div className="w-full bg-indigo-500 rounded-t-sm h-[80%]"></div>
                    <div className="w-full bg-indigo-600 rounded-t-sm h-[100%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="w-full max-w-6xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-12 border-b border-black/10 pb-4">
            <h2 className="text-2xl font-bold">03 // Inside the platform</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-8 bg-white border border-black/10 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-xl font-bold mb-2">Interactive Flashcards</h3>
                <p className="text-gray-500 text-sm">Активне пригадування. Натискай, щоб перевернути картку та перевірити себе.</p>
              </div>
              <div className="mt-6 flex gap-4">
                <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                  <div className="text-xs text-indigo-400 mb-2 font-bold">QUESTION</div>
                  <div className="font-bold text-lg">Що таке науково-технічна революція?</div>
                </div>
                <div className="flex-1 bg-white border border-black/10 rounded-xl p-6 shadow-md transform rotate-2 hover:rotate-0 transition-transform cursor-pointer hidden md:block">
                  <div className="text-xs text-green-500 mb-2 font-bold">ANSWER</div>
                  <div className="text-sm text-gray-600">Це докорінна якісна зміна продуктивних сил на основі перетворення науки на провідний чинник виробництва.</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-900 text-white border border-black/10 rounded-2xl flex flex-col justify-between min-h-[300px]">
              <div>
                <BookOpen className="w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Notes</h3>
                <p className="text-zinc-400 text-sm">Структуровані конспекти з виділенням головного.</p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="h-2 w-full bg-zinc-800 rounded"></div>
                <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                <div className="h-2 w-4/6 bg-zinc-800 rounded"></div>
                <div className="h-2 w-full bg-indigo-500 rounded mt-4"></div>
              </div>
            </div>

            <div className="p-8 bg-white border border-black/10 rounded-2xl flex flex-col justify-between min-h-[300px]">
              <div>
                <Zap className="w-8 h-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Quizzes</h3>
                <p className="text-gray-500 text-sm">Перевірка знань з поясненнями.</p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 border border-black/5 rounded">
                  <Check className="w-4 h-4 text-green-500" /> <span>Правильна відповідь</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 border border-black/5 rounded opacity-50">
                  <div className="w-4 h-4 rounded-full border border-gray-300"></div> <span>Хибна відповідь</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 p-8 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">Track your progress</h3>
                <p className="text-indigo-700/70 text-sm max-w-xs">Слідкуй за своїм прогресом, повторюй картки та аналізуй статистику в особистому кабінеті.</p>
              </div>
              <div className="hidden sm:flex gap-2 items-end h-24">
                <div className="w-8 bg-indigo-200 rounded-t h-[30%]"></div>
                <div className="w-8 bg-indigo-300 rounded-t h-[50%]"></div>
                <div className="w-8 bg-indigo-400 rounded-t h-[70%]"></div>
                <div className="w-8 bg-indigo-500 rounded-t h-[90%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="w-full py-10 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-4 relative z-20">
            <h2 className="text-2xl font-bold">04 // What students say</h2>
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-6 relative">
            <div className="w-full flex justify-center gap-4 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] pb-10 h-[480px] overflow-hidden items-start">
              
              <div className="flex flex-col gap-4 w-72 shrink-0 mt-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">С</div>
                    <span className="text-xs font-bold text-gray-500">@serhii_dev</span>
                  </div>
                  <p className="text-xs text-gray-600">"ШІ реально розуміє контекст. Конспекти виходять структурованими, а не просто переказом тексту."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">І</div>
                    <span className="text-xs font-bold text-gray-500">@ihor_ml</span>
                  </div>
                  <p className="text-xs text-gray-600">"Інтерфейс чистий, нічого зайвого. Все працює швидко."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">Т</div>
                    <span className="text-xs font-bold text-gray-500">@taras_js</span>
                  </div>
                  <p className="text-xs text-gray-600">"Нарешті не треба витрачати години на переписування лекцій."</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-72 shrink-0 mt-12 opacity-70 hover:opacity-100 transition-opacity duration-500">
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">О</div>
                    <span className="text-xs font-bold text-gray-500">@oleksandr_dev</span>
                  </div>
                  <p className="text-xs text-gray-600">"Neorly змінив моє навчання. Я витрачаю в 3 рази менше часу на конспекти і нарешті почав розуміти матеріал."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">В</div>
                    <span className="text-xs font-bold text-gray-500">@vika_codes</span>
                  </div>
                  <p className="text-xs text-gray-600">"Найкраще, що я знайшла для підготовки до сесії. Дуже економлю час."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold">М</div>
                    <span className="text-xs font-bold text-gray-500">@maksym_ai</span>
                  </div>
                  <p className="text-xs text-gray-600">"Генерація тестів — це топ. Дуже рятує перед контрольними."</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-72 shrink-0 z-10 mt-0">
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">М</div>
                    <span className="text-xs font-bold text-gray-500">@maria_studies</span>
                  </div>
                  <p className="text-xs text-gray-600">"Флешкартки — це просто вогонь. Згенерував з лекції за 10 секунд і вчу в метро по дорозі на пари."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">Д</div>
                    <span className="text-xs font-bold text-gray-500">@dmytro_it</span>
                  </div>
                  <p className="text-xs text-gray-600">"Тести рятують перед іспитами. Дуже круто, що ШІ одразу пише пояснення, чому відповідь правильна."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">Н</div>
                    <span className="text-xs font-bold text-gray-500">@nazar_codes</span>
                  </div>
                  <p className="text-xs text-gray-600">"Найкращий інструмент для студентів, який я бачив. Все геніальне — просте."</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-72 shrink-0 mt-12 opacity-70 hover:opacity-100 transition-opacity duration-500">
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">А</div>
                    <span className="text-xs font-bold text-gray-500">@anna_learns</span>
                  </div>
                  <p className="text-xs text-gray-600">"Нарешті не треба гортати 100 сторінок PDF. Закинула підручник — отримала структурований конспект."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">Ю</div>
                    <span className="text-xs font-bold text-gray-500">@yulia_ux</span>
                  </div>
                  <p className="text-xs text-gray-600">"Дизайн дуже приємний оку, нічого не відволікає від навчання."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">Р</div>
                    <span className="text-xs font-bold text-gray-500">@roman_ml</span>
                  </div>
                  <p className="text-xs text-gray-600">"Швидко, зручно, і головне — реально допомагає вчитися."</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-72 shrink-0 mt-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">Л</div>
                    <span className="text-xs font-bold text-gray-500">@lesya_k</span>
                  </div>
                  <p className="text-xs text-gray-600">"Мій середній бал зріс, бо я почав вчитися розумніше, а не довше."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">П</div>
                    <span className="text-xs font-bold text-gray-500">@petro_dev</span>
                  </div>
                  <p className="text-xs text-gray-600">"Дуже зручно, що все зберігається в одному місці."</p>
                </div>
                <div className="p-5 bg-white border border-black/10 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">Д</div>
                    <span className="text-xs font-bold text-gray-500">@diana_ia</span>
                  </div>
                  <p className="text-xs text-gray-600">"Дякую за цей продукт! Це те, чого не вистачало."</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full max-w-6xl mx-auto px-6 py-24 relative z-20 border-t border-black/10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 text-xs font-medium text-black shadow-sm mb-6">
                <span className="w-2 h-2 bg-indigo-600"></span>
                Join the top 1%
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready to upgrade your learning?</h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Понад 10,000 студентів вже використовують Neorly, щоб економити час та покращувати свої оцінки. Приєднуйся до них.
              </p>
              <LoadingLink href="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 text-lg font-bold border border-indigo-700/50 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                Create account <ArrowRight className="w-5 h-5" />
              </LoadingLink>
              <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" /> No credit card required
              </p>
            </div>

            <div className="relative bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 rounded-t-3xl"></div>
              <h3 className="text-xl font-bold text-center mb-2">Your improvement with Neorly</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Середні показники серед наших користувачів</p>
              
              <StatsCounter />

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">+2.5 GPA</div>
                    <div className="text-xs text-gray-500">Середнє зростання</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">10+ годин</div>
                    <div className="text-xs text-gray-500">Економії на тиждень</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ФУТЕР */}
      <footer className="w-full border-t border-black/10 bg-white py-12 relative z-20 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-indigo-600 text-2xl font-black">N</span> Neorly
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <Link href="#features" className="hover:text-black transition">Features</Link>
            <Link href="#how" className="hover:text-black transition">How it works</Link>
            <Link href="#reviews" className="hover:text-black transition">Reviews</Link>
          </div>

          <p className="text-xs text-gray-400">
            © 2027 Neorly Systems. Всі права захищені.
          </p>
        </div>
      </footer>
    </div>
  );
}