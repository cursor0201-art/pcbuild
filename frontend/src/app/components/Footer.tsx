import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#020617] border-t border-white/5 py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="relative h-6 w-6">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-50" />
                <svg viewBox="0 0 24 24" className="relative h-full w-full text-blue-500 fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tighter text-white uppercase">
                Neon <span className="text-blue-500">Tech</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs">
              {language === 'ru'
                ? 'Создаем высокопроизводительные игровые машины для следующего поколения игроков.'
                : "Keyingi avlod o'yinchilari uchun yuqori unumdor o'yin mashinalarini yaratamiz."}
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.2em]">
                {language === 'ru' ? 'Навигация' : 'Navigatsiya'}
              </h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">{language === 'ru' ? 'Главная' : 'Asosiy'}</Link></li>
                <li><Link to="/builder" className="hover:text-blue-400 transition-colors">{language === 'ru' ? 'Конструктор' : 'Konstruktor'}</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">{language === 'ru' ? 'О нас' : 'Biz haqimizda'}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.2em]">
                {language === 'ru' ? 'Контакты' : 'Aloqa'}
              </h4>
              <ul className="space-y-3 text-slate-500 text-sm">
                <li>+998 99 999 19 94</li>
                <li>support@neontech.uz</li>
                <li>{language === 'ru' ? 'Ташкент, Узбекистан' : 'Toshkent, O\'zbekiston'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center text-slate-600 text-xs">
          © 2026 Neon Tech. {language === 'ru' ? 'Все права защищены' : 'Barcha huquqlar himoyalangan'}.
        </div>
      </div>
    </footer>
  );
}
