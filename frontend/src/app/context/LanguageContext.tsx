import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'uz';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Header
    'nav.home': 'Главная',
    'nav.builder': 'Конструктор',
    'nav.catalog': 'Каталог',
    'nav.cart': 'Корзина',

    // Landing
    'hero.title': 'СОБЕРИ СВОЕГО',
    'hero.subtitle': 'ЗВЕРЯ',
    'hero.tagline': 'Кастомные игровые ПК на заказ',
    'hero.cta': 'Начать сборку',
    'hero.ai': 'ИИ подберет мне ПК',

    'features.title': 'ПОЧЕМУ МЫ',
    'features.ai.title': 'ИИ-ПОМОЩНИК',
    'features.ai.desc': 'Умный подбор компонентов под твои задачи и бюджет',
    'features.compatibility.title': 'СОВМЕСТИМОСТЬ',
    'features.compatibility.desc': 'Автоматическая проверка совместимости всех деталей',
    'features.price.title': 'ЛУЧШИЕ ЦЕНЫ',
    'features.price.desc': 'Актуальные рыночные цены и выгодные предложения',

    // Builder
    'builder.title': 'КОНСТРУКТОР ПК',
    'builder.select': 'Выбери комплектующие',
    'builder.total': 'ИТОГО',
    'builder.checkout': 'Оформить заказ',
    'builder.ai.button': 'Спросить ИИ',
    'builder.compatibility.ok': 'Совместимо',
    'builder.compatibility.error': 'Проблема совместимости',

    // Components
    'component.cpu': 'ПРОЦЕССОР',
    'component.gpu': 'ВИДЕОКАРТА',
    'component.motherboard': 'МАТЕРИНСКАЯ ПЛАТА',
    'component.ram': 'ОПЕРАТИВНАЯ ПАМЯТЬ',
    'component.storage': 'НАКОПИТЕЛЬ',
    'component.psu': 'БЛОК ПИТАНИЯ',
    'component.case': 'КОРПУС',
    'component.cooling': 'ОХЛАЖДЕНИЕ',

    'component.select': 'Выбрать',
    'component.selected': 'Выбрано',
    'component.add': 'Добавить',

    // AI Builder
    'ai.title': 'ИИ-ПОМОЩНИК',
    'ai.budget': 'Твой бюджет',
    'ai.usage': 'Для чего будешь использовать?',
    'ai.usage.gaming': 'Игры',
    'ai.usage.streaming': 'Стриминг',
    'ai.usage.work': 'Работа',
    'ai.usage.all': 'Все сразу',
    'ai.performance': 'Уровень производительности',
    'ai.performance.entry': 'Начальный',
    'ai.performance.mid': 'Средний',
    'ai.performance.high': 'Высокий',
    'ai.performance.ultra': 'Максимальный',
    'ai.generate': 'Сгенерировать сборку',
    'ai.use': 'Использовать эту сборку',

    // Cart
    'cart.title': 'КОРЗИНА',
    'cart.empty': 'Корзина пуста',
    'cart.total': 'Итого',
    'cart.checkout': 'Оформить заказ',

    // Checkout
    'checkout.title': 'ОФОРМЛЕНИЕ ЗАКАЗА',
    'checkout.contact': 'Контактные данные',
    'checkout.name': 'Имя',
    'checkout.phone': 'Телефон',
    'checkout.email': 'Email',
    'checkout.delivery': 'Адрес доставки',
    'checkout.address': 'Адрес',
    'checkout.city': 'Город',
    'checkout.submit': 'Подтвердить заказ',

    // Common
    'currency': 'UZS',
    'close': 'Закрыть',
  },
  uz: {
    // Header
    'nav.home': 'Asosiy',
    'nav.builder': 'Konstruktor',
    'nav.catalog': 'Katalog',
    'nav.cart': 'Savat',

    // Landing
    'hero.title': "O'Z YIRTQICHINGNI",
    'hero.subtitle': 'YARAT',
    'hero.tagline': "Buyurtmaga maxsus o'yin kompyuterlari",
    'hero.cta': 'Yig\'ishni boshlash',
    'hero.ai': 'AI menga kompyuter tanlaydi',

    'features.title': 'NIMA UCHUN BIZ',
    'features.ai.title': 'AI-YORDAMCHI',
    'features.ai.desc': "Vazifalaringiz va byudjetingizga mos komponentlarni aqlli tanlash",
    'features.compatibility.title': 'MOS KELISH',
    'features.compatibility.desc': "Barcha qismlarning mosligi avtomatik tekshiriladi",
    'features.price.title': 'ENG YAXSHI NARXLAR',
    'features.price.desc': "Joriy bozor narxlari va foydali takliflar",

    // Builder
    'builder.title': 'KOMPYUTER KONSTRUKTORI',
    'builder.select': 'Komponentlarni tanlang',
    'builder.total': 'JAMI',
    'builder.checkout': 'Buyurtma berish',
    'builder.ai.button': "AI'dan so'rash",
    'builder.compatibility.ok': 'Mos keladi',
    'builder.compatibility.error': 'Moslik muammosi',

    // Components
    'component.cpu': 'PROTSESSOR',
    'component.gpu': 'VIDEOKARTA',
    'component.motherboard': 'ANAKART',
    'component.ram': 'OPERATIV XOTIRA',
    'component.storage': 'XOTIRA',
    'component.psu': 'QUVVAT MANBAI',
    'component.case': 'KORPUS',
    'component.cooling': 'SOVUTISH',

    'component.select': 'Tanlash',
    'component.selected': 'Tanlangan',
    'component.add': "Qo'shish",

    // AI Builder
    'ai.title': 'AI-YORDAMCHI',
    'ai.budget': 'Byudjetingiz',
    'ai.usage': 'Nima uchun ishlatiladi?',
    'ai.usage.gaming': "O'yinlar",
    'ai.usage.streaming': 'Striming',
    'ai.usage.work': 'Ish',
    'ai.usage.all': 'Hammasi',
    'ai.performance': 'Unumdorlik darajasi',
    'ai.performance.entry': 'Boshlang\'ich',
    'ai.performance.mid': "O'rta",
    'ai.performance.high': 'Yuqori',
    'ai.performance.ultra': 'Maksimal',
    'ai.generate': "Yig'indini yaratish",
    'ai.use': "Ushbu yig'indini ishlatish",

    // Cart
    'cart.title': 'SAVAT',
    'cart.empty': "Savat bo'sh",
    'cart.total': 'Jami',
    'cart.checkout': 'Buyurtma berish',

    // Checkout
    'checkout.title': 'BUYURTMA BERISH',
    'checkout.contact': "Aloqa ma'lumotlari",
    'checkout.name': 'Ism',
    'checkout.phone': 'Telefon',
    'checkout.email': 'Email',
    'checkout.delivery': 'Yetkazib berish manzili',
    'checkout.address': 'Manzil',
    'checkout.city': 'Shahar',
    'checkout.submit': 'Buyurtmani tasdiqlash',

    // Common
    'currency': 'UZS',
    'close': 'Yopish',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ru] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
