import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-[#0d0d12] py-12">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="mb-2 font-black text-2xl uppercase tracking-tighter text-white">
              GameZone<span className="text-[#00d4ff]">Build</span>
            </div>
            <p className="text-white/40 text-sm">
              {language === 'ru'
                ? 'Кастомные игровые ПК на заказ'
                : "Buyurtmaga maxsus o'yin kompyuterlari"}
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="mb-3 font-bold text-[#00d4ff] text-xs uppercase tracking-wider">
                {language === 'ru' ? 'Навигация' : 'Navigatsiya'}
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>{language === 'ru' ? 'Главная' : 'Asosiy'}</li>
                <li>{language === 'ru' ? 'Конструктор' : 'Konstruktor'}</li>
                <li>{language === 'ru' ? 'Каталог' : 'Katalog'}</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-bold text-[#00d4ff] text-xs uppercase tracking-wider">
                {language === 'ru' ? 'Контакты' : 'Aloqa'}
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>+998 99 999 19 94</li>
                <li>info@gamezonebuild.uz</li>
                <li>{language === 'ru' ? 'Ташкент, Узбекистан' : 'Toshkent, O\'zbekiston'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-white/30 text-xs">
          © 2026 GameZoneBuild. {language === 'ru' ? 'Все права защищены' : 'Barcha huquqlar himoyalangan'}.
        </div>
      </div>
    </footer>
  );
}
