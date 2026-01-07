import React, { useState } from 'react';
import { Menu, X, ArrowRight, Check, Rocket, Zap, Shield, Star, ChevronRight, Eye } from 'lucide-react';

const NorthPixelLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    siteType: '',
    description: ''
  });
  
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'ManuFarm',
      description: 'Современный лендинг для агробизнеса с интеграцией каталога продукции',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
      tags: ['Лендинг', 'E-commerce']
    }
  ]);
  
  const [submissions, setSubmissions] = useState([]);

  const packages = [
    {
      name: 'Лендинг Start',
      price: 'от 300€',
      duration: '3-5 дней',
      features: [
        'Одностраничный сайт',
        'Адаптивный дизайн',
        'Форма обратной связи',
        'SEO-оптимизация',
        'Хостинг на 1 год'
      ],
      popular: false
    },
    {
      name: 'Лендинг Pro',
      price: 'от 600€',
      duration: '5-7 дней',
      features: [
        'Расширенный функционал',
        'Админ-панель',
        'Интеграция аналитики',
        'Анимации и эффекты',
        'Чат-бот поддержки',
        'Техподдержка 3 месяца'
      ],
      popular: true
    },
    {
      name: 'Business Site',
      price: 'от 1200€',
      duration: '10-14 дней',
      features: [
        'Многостраничный сайт',
        'Полная админка',
        'CRM интеграция',
        'Блог система',
        'E-commerce модуль',
        'Техподдержка 6 месяцев'
      ],
      popular: false
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email || !formData.siteType || !formData.description) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    
    const newSubmission = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleString('ru-RU')
    };
    setSubmissions([...submissions, newSubmission]);
    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      siteType: '',
      description: ''
    });
  };

  const deleteSubmission = (id) => {
    setSubmissions(submissions.filter(s => s.id !== id));
  };

  const addCase = () => {
    const title = prompt('Название кейса:');
    const description = prompt('Описание:');
    if (title && description) {
      setCases([...cases, {
        id: Date.now(),
        title,
        description,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        tags: ['Новый проект']
      }]);
    }
  };

  const deleteCase = (id) => {
    setCases(cases.filter(c => c.id !== id));
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Админ-панель NorthPixel</h1>
            <button
              onClick={() => setIsAdmin(false)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Выйти
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Заявки ({submissions.length})</h2>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {submissions.length === 0 ? (
                  <p className="text-gray-300">Заявок пока нет</p>
                ) : (
                  submissions.map(sub => (
                    <div key={sub.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-semibold">{sub.firstName} {sub.lastName}</p>
                          <p className="text-gray-300 text-sm">{sub.date}</p>
                        </div>
                        <button
                          onClick={() => deleteSubmission(sub.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm">📱 {sub.phone}</p>
                      <p className="text-gray-300 text-sm">📧 {sub.email}</p>
                      <p className="text-gray-300 text-sm mt-2"><strong>Тип:</strong> {sub.siteType}</p>
                      <p className="text-gray-300 text-sm"><strong>Описание:</strong> {sub.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Кейсы ({cases.length})</h2>
                <button
                  onClick={addCase}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  + Добавить
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cases.map(c => (
                  <div key={c.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{c.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{c.description}</p>
                        <div className="flex gap-2">
                          {c.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCase(c.id)}
                        className="text-red-400 hover:text-red-300 ml-4"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold text-white">NorthPixel</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-white transition">Главная</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-white transition">О нас</button>
              <button onClick={() => scrollToSection('packages')} className="text-gray-300 hover:text-white transition">Пакеты</button>
              <button onClick={() => scrollToSection('cases')} className="text-gray-300 hover:text-white transition">Кейсы</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white transition">Контакты</button>
            </div>

            <button onClick={() => scrollToSection('contact')} className="hidden md:block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-xl transition transform hover:scale-105">
              Заказать сайт
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              <button onClick={() => scrollToSection('home')} className="block text-gray-300 hover:text-white transition">Главная</button>
              <button onClick={() => scrollToSection('about')} className="block text-gray-300 hover:text-white transition">О нас</button>
              <button onClick={() => scrollToSection('packages')} className="block text-gray-300 hover:text-white transition">Пакеты</button>
              <button onClick={() => scrollToSection('cases')} className="block text-gray-300 hover:text-white transition">Кейсы</button>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-300 hover:text-white transition">Контакты</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Создаем сайты для
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> вашего бизнеса</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Быстрые и качественные решения для малого бизнеса. Лендинги, корпоративные сайты и интернет-магазины за несколько дней.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => scrollToSection('contact')} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-2">
              Начать проект <ArrowRight size={20} />
            </button>
            <button onClick={() => scrollToSection('cases')} className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-lg text-lg font-semibold border border-white/20 hover:bg-white/20 transition">
              Посмотреть кейсы
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Почему NorthPixel?</h2>
            <p className="text-xl text-gray-300">Мы знаем, что нужно вашему бизнесу</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Быстрая разработка</h3>
              <p className="text-gray-300">Запускаем ваш сайт за 3-14 дней. Никаких долгих ожиданий - только результат.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Современные технологии</h3>
              <p className="text-gray-300">Используем передовые решения для создания быстрых и красивых сайтов.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Надежность и поддержка</h3>
              <p className="text-gray-300">Техническая поддержка, хостинг и все необходимое для бесперебойной работы.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Наши пакеты</h2>
            <p className="text-xl text-gray-300">Выберите подходящее решение для вашего бизнеса</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className={`relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border ${pkg.popular ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-white/10'} hover:border-purple-500/50 transition`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star size={14} /> Популярный
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{pkg.price}</span>
                  <p className="text-gray-400 mt-2">Срок: {pkg.duration}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollToSection('contact')} className={`w-full py-3 rounded-lg font-semibold transition ${pkg.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  Выбрать пакет
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Наши работы</h2>
            <p className="text-xl text-gray-300">Проекты, которыми мы гордимся</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition group">
                <div className="relative h-48 overflow-hidden">
                  <img src={caseItem.image} alt={caseItem.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{caseItem.title}</h3>
                  <p className="text-gray-300 mb-4">{caseItem.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {caseItem.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Готовы начать?</h2>
            <p className="text-xl text-gray-300">Заполните форму, и мы свяжемся с вами в течение 24 часов</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white mb-2 font-semibold">Имя *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition"
                  placeholder="Иван"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-semibold">Фамилия *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition"
                  placeholder="Иванов"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white mb-2 font-semibold">Телефон *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition"
                  placeholder="+372 1234 5678"
                />
              </div>
              <div>
                <label className="block text-white mb-2 font-semibold">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition"
                  placeholder="ivan@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Тип сайта *</label>
              <select
                value={formData.siteType}
                onChange={(e) => setFormData({...formData, siteType: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none transition"
              >
                <option value="" className="bg-slate-900">Выберите тип сайта</option>
                <option value="Лендинг Start" className="bg-slate-900">Лендинг Start (от 300€)</option>
                <option value="Лендинг Pro" className="bg-slate-900">Лендинг Pro (от 600€)</option>
                <option value="Business Site" className="bg-slate-900">Business Site (от 1200€)</option>
                <option value="Другое" className="bg-slate-900">Другое</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Описание проекта *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition resize-none"
                placeholder="Расскажите о вашем проекте, целях и пожеланиях..."
              />
            </div>

            <button onClick={handleSubmit} className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105 flex items-center justify-center gap-2">
              Отправить заявку <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold text-white">NorthPixel</span>
          </div>
          <p className="text-gray-400 mb-4">Быстрые решения для вашего бизнеса</p>
          <p className="text-gray-500 text-sm">© 2025 NorthPixel. Все права защищены.</p>
          <button 
            onClick={() => {
              const password = prompt('Введите пароль администратора:');
              if (password === 'northpixel2025') {
                setIsAdmin(true);
              } else if (password) {
                alert('Неверный пароль');
              }
            }}
            className="mt-4 text-gray-600 hover:text-gray-400 text-xs transition"
          >
            <Eye size={16} className="inline mr-1" />
            Вход для администратора
          </button>
        </div>
      </footer>
    </div>
  );
};

export default NorthPixelLanding;