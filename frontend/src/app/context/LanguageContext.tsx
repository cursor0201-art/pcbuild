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
    'nav.about': 'О нас',

    // Landing
    'hero.title_part1': 'ЗАРЯДИ СВОЮ',
    'hero.title_part2': 'ИГРУ',
    'hero.description': 'Открой для себя ультимативную коллекцию высокопроизводительных комплектующих, кастомных сборок и игрового снаряжения.',
    'hero.tagline_extra': 'Создано для геймеров. Спроектировано для побед.',
    'hero.cta_primary': 'В МАГАЗИН',
    'hero.cta_secondary': 'СОБРАТЬ ПК',
    'hero.next_gen': 'ПРОИЗВОДИТЕЛЬНОСТЬ СЛЕДУЮЩЕГО ПОКОЛЕНИЯ',

    'stats.shipping.label': 'БЕСПЛАТНАЯ ДОСТАВКА',
    'stats.shipping.sub': 'На все заказы свыше 1 000 000 UZS',
    'stats.warranty.label': '1 ГОД ГАРАНТИИ',
    'stats.warranty.sub': 'Премиальное качество гарантировано',
    'stats.support.label': '24/7 ПОДДЕРЖКА',
    'stats.support.sub': 'Всегда готовы помочь',

    'category.title': 'КАТЕГОРИИ',
    'category.starting': 'ОТ',
    'category.specs': 'Характеристики',
    'category.performance': 'Производительность',
    'category.price': 'Цена',

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
    'ai.neural_network': 'Нейросеть GameZone',
    'ai.description': 'Опишите, какой компьютер вам нужен. Чем подробнее, тем лучше ИИ подберет детали со склада!',
    'ai.label': 'Ваш запрос к ИИ',
    'ai.placeholder': 'Например: Собери комп для CS2, чтобы было стабильно 200+ ФПС, и уложиться надо примерно в 15 миллионов...',
    'ai.thinking': 'ИИ ДУМАЕТ...',
    'ai.success.title': 'СБОРКА ГОТОВА!',
    'ai.success.desc': 'ИИ подобрал оптимальную конфигурацию под ваши требования',
    'ai.total': 'ИТОГО',
    'ai.regenerate': 'ПЕРЕГЕНЕРИРОВАТЬ',
    'ai.error.title': 'Ошибка ИИ',
    'ai.error.fallback': 'Не удалось подобрать сборку',
    'ai.ask_satisfaction': 'Вам понравилась эта сборка?',
    'ai.add_to_cart': 'В КОРЗИНУ',
    'ai.checkout_now': 'ОФОРМИТЬ ЗАКАЗ',
    'ai.welcome': 'Привет! Я ваш ИИ-помощник GameZone. Чем могу помочь? Собрать мощный ПК или ответить на вопросы по железу?',

    // About
    'about.title': 'О сервисе',
    'about.p1': 'GameZoneBuild — это премиальный сервис сборки игровых ПК и рабочих станций в Узбекистане. Мы не просто продаем компьютеры, мы создаем индивидуальные решения под конкретные задачи и бюджет каждого клиента.',
    'about.p2': 'В GameZoneBuild вы можете быть уверены в качестве каждой детали. Наши специалисты вручную подбирают комплектующие, гарантируя их идеальную совместимость. От мощных киберспортивных машин до тихих систем для 3D-моделирования — GameZoneBuild предлагает лучшие решения на рынке.',
    'about.p3': 'Почему выбирают GameZoneBuild? Прозрачное ценообразование, профессиональный кабель-менеджмент, стресс-тестирование каждой системы перед выдачей и полноценная гарантия. Доверьте сборку профессионалам GameZoneBuild.',

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
    'checkout.success.title': 'ЗАКАЗ ПРИНЯТ',
    'checkout.success.message': 'Мы свяжемся с вами в ближайшее время для подтверждения заказа.',
    'checkout.empty.title': 'КОРЗИНА ПУСТА',
    'checkout.empty.message': 'Пожалуйста, добавьте комплектующие в корзину перед оформлением заказа.',
    'checkout.empty.button': 'В КОНСТРУКТОР',

    // SEO Content
    'seo.title': 'Профессиональная сборка ПК на заказ',
    'seo.p1': 'GameZoneBuild специализируется на индивидуальной сборке игровых и рабочих компьютеров. Мы подбираем оптимальные конфигурации, от бюджетных машин для киберспортивных дисциплин до сверхмощных рабочих станций для 3D-моделирования, видеомонтажа и стриминга.',
    'seo.p2': 'Почему выбирают нас? Мы предлагаем прозрачные цены, гарантию на все комплектующие и профессиональный кабель-менеджмент. Наша цель — собрать ПК, который будет идеально решать ваши задачи без переплат за ненужные функции.',
    'seo.p3': 'Ищете компьютер для новинок на максималках? Наш умный конфигуратор поможет собрать сбалансированную систему, проверив совместимость видеокарты, процессора, материнской платы и других деталей. Забудьте о "узких горлышках" и перегреве.',
    'seo.p4': 'Как заказать: просто соберите желаемый ПК в нашем конфигураторе, добавьте в корзину и оформите заказ. Наши специалисты свяжутся с вами для уточнения деталей, после чего мы соберем, протестируем и доставим ваш идеальный компьютер.',

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
    'nav.about': 'Biz haqimizda',

    // Landing
    'hero.title_part1': 'Kompyuteringizni',
    'hero.title_part2': 'yangi darajaga ko\'taring',
    'hero.description': "Yuqori unumdorlikka ega butlovchi qismlar, maxsus yig'malar va o'yin jihozlarining ajoyib to'plamini kashf eting.",
    'hero.tagline_extra': "Geymerlar uchun yaratilgan. G'alaba uchun mo'ljallangan.",
    'hero.cta_primary': "DO'KONGA",
    'hero.cta_secondary': "PK YIG'ISH",
    'hero.next_gen': 'YANGI AVLOD UNUMDORLIGI',

    'stats.shipping.label': 'BEPUL YETKAZIB BERISH',
    'stats.shipping.sub': "1 000 000 UZS dan yuqori barcha buyurtmalar uchun",
    'stats.warranty.label': '1 YILLIK KAFOLAT',
    'stats.warranty.sub': 'Yuqori sifat kafolatlangan',
    'stats.support.label': '24/7 QO\'LLAB-QUVVATLASH',
    'stats.support.sub': 'Har doim yordamga tayyormiz',

    'category.title': 'KATEGORIYALAR',
    'category.starting': 'DAN',
    'category.specs': 'Xususiyatlari',
    'category.performance': 'Unumdorligi',
    'category.price': 'Narxi',

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
    'ai.neural_network': 'GameZone Neyrotarmog\'i',
    'ai.description': 'Sizga qanday kompyuter kerakligini tasvirlab bering. Qanchalik batafsil bo\'lsa, AI shunchalik yaxshi qismlarni tanlaydi!',
    'ai.label': 'AI\'ga so\'rovingiz',
    'ai.placeholder': 'Masalan: CS2 uchun kompyuter yig\'ib ber, 200+ FPS barqaror bo\'lsin va byudjet 15 million atrofida...',
    'ai.thinking': 'AI O\'YLAMOQDA...',
    'ai.success.title': 'YIG\'INDISI TAYYOR!',
    'ai.success.desc': 'AI talablaringizga mos keladigan eng yaxshi konfiguratsiyani tanladi',
    'ai.total': 'JAMI',
    'ai.regenerate': 'QAYTA YARATISH',
    'ai.error.title': 'AI Xatosi',
    'ai.error.fallback': 'Yig\'indini tanlab bo\'lmadi',
    'ai.ask_satisfaction': 'Ushbu yig\'indi sizga yoqdimi?',
    'ai.add_to_cart': 'SAVATGA QO\'SHISH',
    'ai.checkout_now': 'BUYURTMA BERISH',
    'ai.welcome': 'Salom! Men GameZone AI yordamchisiman. Sizga qanday yordam bera olaman? Kuchli PK yig\'ish yoki hardware bo\'yicha savollarga javob berish kerakmi?',

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
    'checkout.success.title': 'BUYURTMA QABUL QILINDI',
    'checkout.success.message': 'Buyurtmani tasdiqlash uchun tez orada siz bilan bog\'lanamiz.',
    'checkout.empty.title': 'SAVAT BO\'SH',
    'checkout.empty.message': 'Iltimos, buyurtma berishdan oldin savatga butlovchi qismlarni qo\'shing.',
    'checkout.empty.button': 'KONSTRUKTORGA O\'TISH',
    
    // SEO Content
    'seo.title': 'Buyurtma asosida professional PK yig\'ish',
    'seo.p1': 'GameZoneBuild o\'yin va ishchi kompyuterlarini individual yig\'ishga ixtisoslashgan. Biz kibersport yo\'nalishidagi byudjetli mashinalardan tortib, 3D modellashtirish, videomontaj va striming uchun o\'ta kuchli ish stansiyalarigacha bo\'lgan optimal konfiguratsiyalarni tanlaymiz.',
    'seo.p2': 'Nima uchun bizni tanlashadi? Biz shaffof narxlar, barcha butlovchi qismlarga kafolat va professional kabel menejmentini taklif etamiz. Bizning maqsadimiz — ortiqcha funktsiyalar uchun pul to\'lamasdan, sizning vazifalaringizni mukammal darajada hal qiladigan PK yig\'ishdir.',
    'seo.p3': 'Maksimal sozlamalarda yangi o\'yinlar uchun kompyuter qidiryapsizmi? Bizning aqlli konfiguratorimiz videokarta, protsessor, anakart va boshqa detallarning mosligini tekshirib, muvozanatli tizimni yig\'ishga yordam beradi. "Tor joylar" va qizib ketish haqida unuting.',
    'seo.p4': 'Qanday buyurtma berish mumkin: shunchaki bizning konfiguratorimizda o\'zingiz xohlagan PKni yig\'ing, savatga qo\'shing va buyurtma bering. Mutaxassislarimiz tafsilotlarni aniqlashtirish uchun siz bilan bog\'lanishadi, shundan so\'ng biz sizning ideal kompyuteringizni yig\'amiz, sinovdan o\'tkazamiz va yetkazib beramiz.',

    // About
    'about.title': 'Servis haqida',
    'about.p1': "GameZoneBuild — O'zbekistonda o'yin PKlari va ish stansiyalarini yig'ish bo'yicha premium servisdir. Biz shunchaki kompyuter sotmaymiz, biz har bir mijozning aniq vazifalari va byudjeti uchun individual yechimlar yaratamiz.",
    'about.p2': "GameZoneBuild'da siz har bir detalning sifatiga amin bo'lishingiz mumkin. Mutaxassislarimiz butlovchi qismlarni qo'lda tanlab, ularning mukammal mosligini kafolatlaydi. Kuchli kibersport mashinalaridan tortib, 3D modellashtirish uchun jim tizimlargacha — GameZoneBuild bozordagi eng yaxshi yechimlarni taklif etadi.",
    'about.p3': "Nima uchun GameZoneBuild tanlanadi? Shaffof narxlar, professional kabel menejmenti, har bir tizimni topshirishdan oldin stress-testdan o'tkazish va to'liq kafolat. Yig'ishni GameZoneBuild professionallariga ishoning.",

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
