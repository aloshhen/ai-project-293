import { SafeIcon } from './components/SafeIcon';
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Hook for form handling
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)

    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Something went wrong')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }

  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Accordion Item Component for Features
const AccordionFeature = ({ icon, title, description, isOpen, onClick }) => {
  return (
    <div className="border-b border-[#253FF6]/10 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-8 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors rounded-lg px-4 -mx-4"
      >
        <span className="text-2xl text-[#E1FF01]">{icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <AnimatePresence>
            {isOpen && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/70 leading-relaxed overflow-hidden"
              >
                {description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <SafeIcon
          name={isOpen ? "minus" : "plus"}
          className="w-5 h-5 text-[#E1FF01] flex-shrink-0 mt-1"
        />
      </button>
    </div>
  )
}

// FAQ Accordion Item
const FaqItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-[#253FF6]/20 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-white group-hover:text-[#E1FF01] transition-colors pr-4">
          {question}
        </span>
        <SafeIcon
          name={isOpen ? "minus" : "plus"}
          className="w-5 h-5 text-[#E1FF01] flex-shrink-0"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/70 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Animated counter for Trust Bar
const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, end])

  return (
    <span ref={ref} className="text-[#E1FF01] font-black text-4xl md:text-5xl">
      {count}{suffix}
    </span>
  )
}

// Interactive Demo Component
const InteractiveDemo = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = () => {
    if (!prompt) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)
    }, 1500)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white/[0.03] border border-[#253FF6]/20 rounded-3xl overflow-hidden">
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-4">Опишите ваш сайт</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Например: лендинг для кофейни с тёмным дизайном и золотыми акцентами..."
          className="w-full h-32 bg-[#0F1212] border border-[#253FF6]/30 rounded-xl p-4 text-white placeholder-white/30 focus:border-[#E1FF01] focus:outline-none transition-colors resize-none mb-4"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="bg-[#E1FF01] hover:bg-[#E1FF01]/90 disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1212] px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0F1212]/30 border-t-[#0F1212] rounded-full animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <SafeIcon name="wand-2" className="w-5 h-5" />
              Сгенерировать
            </>
          )}
        </button>
      </div>
      <div className="bg-[#0F1212] border-l border-[#253FF6]/20 p-8 md:p-12 min-h-[300px] flex items-center justify-center relative overflow-hidden">
        {!showPreview ? (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#E1FF01]/10 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <p className="text-white/50">Ваш сайт появится здесь</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/5 rounded-xl p-6 border border-[#E1FF01]/20"
          >
            <div className="h-4 w-1/3 bg-[#E1FF01]/20 rounded mb-4" />
            <div className="h-3 w-full bg-white/10 rounded mb-2" />
            <div className="h-3 w-4/5 bg-white/10 rounded mb-2" />
            <div className="h-3 w-3/4 bg-white/10 rounded mb-6" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-20 bg-[#253FF6]/20 rounded" />
              <div className="h-20 bg-[#253FF6]/20 rounded" />
              <div className="h-20 bg-[#253FF6]/20 rounded" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [openFeatureIndex, setOpenFeatureIndex] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const features = [
    {
      icon: "🤖",
      title: "AI-генерация",
      description: "Опишите идею — получите готовый сайт за минуты. Наш алгоритм превращает текст в полноценный дизайн с оптимальной структурой."
    },
    {
      icon: "📦",
      title: "Умные компоненты",
      description: "Библиотека готовых блоков, адаптивных под ваш бренд. Просто перетаскивайте элементы и настраивайте под свои нужды."
    },
    {
      icon: "⚡️",
      title: "Мгновенный деплой",
      description: "От идеи до живого сайта в один клик. Хостинг, SSL и CDN включены автоматически. Никаких технических настроек."
    },
    {
      icon: "📱",
      title: "Адаптивность",
      description: "Идеально на всех устройствах по умолчанию. Каждый сайт автоматически оптимизируется для мобильных, планшетов и десктопов."
    }
  ]

  const faqs = [
    {
      question: "Что такое Webly AI?",
      answer: "Webly AI — это платформа для создания сайтов с помощью искусственного интеллекта. Она позволяет генерировать полноценные веб-сайты из текстового описания за считанные минуты, без необходимости знать программирование или дизайн."
    },
    {
      question: "Нужны ли навыки программирования?",
      answer: "Нет, Webly AI создан для пользователей без технического бэкграунда. Весь процесс создания сайта происходит через интуитивный интерфейс с помощью текстовых команд ИИ."
    },
    {
      question: "Могу ли я использовать свой домен?",
      answer: "Да, начиная с тарифа Pro вы можете подключить собственный домен (например, вашсайт.ru) бесплатно. Мы также предоставляем бесплатные поддомены вида вашсайт.webly.ai на всех тарифах."
    },
    {
      question: "Как работает AI-генерация?",
      answer: "Вы описываете желаемый сайт своими словами, а наш ИИ анализирует запрос, подбирает оптимальную структуру, генерирует тексты, подбирает цвета и создаёт уникальный дизайн под ваш запрос."
    },
    {
      question: "Что включено в бесплатный план?",
      answer: "Бесплатный план включает 5 проектов, базовые шаблоны, хостинг с доменом webly.ai и поддержку через сообщество. Это отличный способ протестировать платформу перед переходом на Pro."
    },
    {
      question: "Могу ли я экспортировать код?",
      answer: "Да, на тарифе Pro и выше вы можете экспортировать исходный код вашего сайта (HTML, CSS, JS) для самостоятельного хостинга или дальнейшей кастомизации разработчиками."
    },
    {
      question: "Есть ли возврат средств?",
      answer: "Да, мы предоставляем 14-дневную гарантию возврата средств на всех платных тарифах. Если вас что-то не устроит, просто напишите в поддержку в течение 14 дней."
    },
    {
      question: "Как получить поддержку?",
      answer: "Бесплатные пользователи получают поддержку через сообщество Discord и базу знаний. Пользователи Pro имеют доступ к приоритетной email-поддержке с ответом в течение 24 часов."
    }
  ]

  const resources = [
    {
      icon: "book-open",
      title: "Документация",
      description: "Полные руководства и справочник API для разработчиков и пользователей.",
      link: "Перейти →"
    },
    {
      icon: "layout",
      title: "Шаблоны",
      description: "Начните с проверенных дизайнов для разных ниш и задач.",
      link: "Смотреть →"
    },
    {
      icon: "users",
      title: "Сообщество",
      description: "Присоединяйтесь к тысячам создателей, делитесь опытом и получайте помощь.",
      link: "Присоединиться →"
    }
  ]

  return (
    <div className="min-h-screen bg-[#0F1212] text-white overflow-x-hidden font-sans selection:bg-[#E1FF01] selection:text-[#0F1212]">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0F1212]/90 backdrop-blur-md border-b border-[#253FF6]/20' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-[#E1FF01] rounded-lg flex items-center justify-center">
                <span className="text-[#0F1212] font-black text-xl">W</span>
              </div>
              <span className="text-xl font-bold text-white">Webly AI</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Возможности', 'Тарифы', 'Ресурсы', 'FAQ'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E1FF01] transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="hidden md:block">
              <button className="bg-[#E1FF01] hover:bg-[#E1FF01]/90 text-[#0F1212] px-6 py-2.5 rounded-lg font-bold text-sm transition-all transform hover:scale-105 hover:-translate-y-0.5">
                Начать бесплатно
              </button>
            </div>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <SafeIcon name={mobileMenuOpen ? "x" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0F1212]/95 backdrop-blur-md border-b border-[#253FF6]/20 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-4">
                {['Возможности', 'Тарифы', 'Ресурсы', 'FAQ'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block w-full text-left text-white/70 hover:text-[#E1FF01] transition-colors py-2"
                  >
                    {item}
                  </button>
                ))}
                <button className="w-full bg-[#E1FF01] text-[#0F1212] px-6 py-3 rounded-lg font-bold mt-4">
                  Начать бесплатно
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#253FF6]/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 inline-block">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#E1FF01] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#E1FF01]/10">
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-svg-1.svg"
                  alt="Webly AI Logo"
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Создавайте сайты<br />
              <span className="text-[#E1FF01]">силой AI</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              От идеи до запуска за минуты. Без кода, без сложностей — только результат.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-[#E1FF01] hover:bg-[#E1FF01]/90 text-[#0F1212] px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 hover:-translate-y-1 shadow-lg shadow-[#E1FF01]/20 flex items-center justify-center gap-2">
                Начать создавать
                <SafeIcon name="arrow-right" className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white border border-[#E1FF01]/50 hover:border-[#E1FF01] px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                <SafeIcon name="play" className="w-5 h-5" />
                Смотреть демо
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <SafeIcon name="chevron-down" className="w-6 h-6 text-white/30" />
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-[#253FF6]/10 bg-white/[0.02]">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <AnimatedCounter end={15} suffix="K+" />
              <p className="text-white/60 text-sm font-medium uppercase tracking-wider">активных пользователей</p>
            </div>
            <div className="space-y-2 border-x-0 md:border-x border-[#253FF6]/10 px-0 md:px-8">
              <AnimatedCounter end={50} suffix="K+" />
              <p className="text-white/60 text-sm font-medium uppercase tracking-wider">созданных сайтов</p>
            </div>
            <div className="space-y-2">
              <div className="text-[#E1FF01] font-black text-4xl md:text-5xl">99%</div>
              <p className="text-white/60 text-sm font-medium uppercase tracking-wider">довольных клиентов</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Can Be Created */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Создавайте что угодно
            </h2>
            <p className="text-white/60 text-lg">От идеи до запуска за минуты</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: "🚀", title: "Лендинги" },
              { icon: "🛍", title: "E-commerce" },
              { icon: "💼", title: "Портфолио" },
              { icon: "⚙️", title: "SaaS" },
              { icon: "📝", title: "Блоги" },
              { icon: "🎨", title: "Web Apps" }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white/[0.02] hover:bg-white/[0.04] border border-[#253FF6]/15 hover:border-[#E1FF01]/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="text-3xl mb-3 text-[#E1FF01]">{item.icon}</div>
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features (Accordion) */}
      <section id="возможности" className="py-24 px-6 bg-white/[0.01]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Почему Webly AI
            </h2>
            <p className="text-white/60 text-lg">Технологии, которые работают на вас</p>
          </div>

          <div className="bg-white/[0.02] rounded-3xl p-2 border border-[#253FF6]/10">
            {features.map((feature, index) => (
              <AccordionFeature
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isOpen={openFeatureIndex === index}
                onClick={() => setOpenFeatureIndex(openFeatureIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Попробуйте сами
            </h2>
            <p className="text-white/60 text-lg">Опишите сайт — и увидите магию</p>
          </div>

          <InteractiveDemo />
        </div>
      </section>

      {/* Resources */}
      <section id="ресурсы" className="py-24 px-6 bg-white/[0.01]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Всё для старта
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {resources.map((resource, idx) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white/[0.03] hover:bg-white/[0.05] border border-[#253FF6]/20 hover:border-[#E1FF01]/30 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E1FF01]/10 flex items-center justify-center mb-6 group-hover:bg-[#E1FF01]/20 transition-colors">
                  <SafeIcon name={resource.icon} className="w-7 h-7 text-[#E1FF01]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{resource.title}</h3>
                <p className="text-white/60 mb-6 leading-relaxed">{resource.description}</p>
                <button className="text-[#E1FF01] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  {resource.link}
                  <SafeIcon name="arrow-right" className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="тарифы" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Тарифы
            </h2>
            <p className="text-white/60 text-lg">Выберите подходящий план</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
            <div className="bg-white/[0.03] border border-[#253FF6]/20 rounded-3xl p-8 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Бесплатный</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">0₽</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {['5 проектов', 'Базовые шаблоны', 'Поддержка сообщества', 'Брендинг Webly'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <SafeIcon name="check" className="w-5 h-5 text-[#E1FF01] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full border border-[#E1FF01]/50 hover:border-[#E1FF01] text-white py-4 rounded-xl font-bold transition-all hover:bg-white/5">
                Начать бесплатно
              </button>
            </div>

            <div className="relative bg-white/[0.05] border-2 border-[#E1FF01]/50 rounded-3xl p-8 h-full flex flex-col shadow-2xl shadow-[#E1FF01]/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#E1FF01] text-[#0F1212] px-4 py-1 rounded-full text-sm font-bold">
                  ПОПУЛЯРНЫЙ
                </span>
              </div>

              <div className="mb-6 pt-2">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">2490₽</span>
                  <span className="text-white/50">/мес</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited проекты', 'Все AI-функции', 'Свои домены', 'Приоритет поддержки', 'Без брендинга'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <SafeIcon name="check" className="w-5 h-5 text-[#E1FF01] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#E1FF01] hover:bg-[#E1FF01]/90 text-[#0F1212] py-4 rounded-xl font-bold transition-all transform hover:scale-105">
                Выбрать Pro
              </button>
            </div>

            <div className="bg-white/[0.03] border border-[#253FF6]/20 rounded-3xl p-8 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">Custom</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {['White-label', 'API доступ', 'Выделенная поддержка', 'SLA гарантии', 'Кастомное обучение'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70">
                    <SafeIcon name="check" className="w-5 h-5 text-[#E1FF01] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full border border-[#E1FF01]/50 hover:border-[#E1FF01] text-white py-4 rounded-xl font-bold transition-all hover:bg-white/5">
                Связаться с нами
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-white/[0.01]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              Частые вопросы
            </h2>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#253FF6]/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6">
            Готовы создавать<br />будущее?
          </h2>
          <p className="text-white/60 text-xl mb-10 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам создателей с AI
          </p>

          <button className="bg-[#E1FF01] hover:bg-[#E1FF01]/90 text-[#0F1212] px-10 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl shadow-[#E1FF01]/20 mb-4">
            Начать создавать бесплатно
          </button>

          <p className="text-white/50 text-sm">Кредитная карта не требуется</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#253FF6]/20 bg-[#0F1212] pt-16 pb-8 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#E1FF01] rounded-lg flex items-center justify-center">
                  <span className="text-[#0F1212] font-black text-sm">W</span>
                </div>
                <span className="text-lg font-bold text-white">Webly AI</span>
              </div>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Создавайте сайты силой AI. Быстро, просто, без кода.
              </p>
              <div className="flex gap-3">
                {['twitter', 'github', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E1FF01] flex items-center justify-center transition-colors group"
                  >
                    <SafeIcon name={social} className="w-5 h-5 text-white group-hover:text-[#0F1212]" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[#E1FF01] font-bold mb-4">Продукт</h4>
              <ul className="space-y-3">
                {['Возможности', 'Тарифы', 'Шаблоны', 'Обновления'].map((item) => (
                  <li key={item}>
                    <button onClick={() => scrollToSection(item.toLowerCase())} className="text-white/60 hover:text-[#E1FF01] transition-colors text-sm">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#E1FF01] font-bold mb-4">Ресурсы</h4>
              <ul className="space-y-3">
                {['Документация', 'Справочник API', 'Туториалы', 'Сообщество'].map((item) => (
                  <li key={item}>
                    <button className="text-white/60 hover:text-[#E1FF01] transition-colors text-sm">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#E1FF01] font-bold mb-4">Компания</h4>
              <ul className="space-y-3">
                {['О нас', 'Блог', 'Карьера', 'Контакты'].map((item) => (
                  <li key={item}>
                    <button className="text-white/60 hover:text-[#E1FF01] transition-colors text-sm">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#253FF6]/20 pt-8 text-center">
            <p className="text-white/40 text-sm">© 2024 Webly AI. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App