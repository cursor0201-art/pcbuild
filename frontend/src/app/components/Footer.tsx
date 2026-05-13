import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#020617] border-t border-white/5 py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-50" />
                <svg viewBox="0 0 24 24" className="relative h-full w-full text-blue-500 fill-current">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                GameZone<span className="text-blue-500">Build</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              {language === 'ru'
                ? 'Создаем высокопроизводительные игровые машины для следующего поколения игроков. Ваша мощь — наша страсть.'
                : "Keyingi avlod o'yinchilari uchun yuqori unumdor o'yin mashinalarini yaratamiz. Sizning quvvatingiz — bizning ishtiyoqimiz."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-24 lg:gap-32">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="mb-6 font-black text-white text-[10px] uppercase tracking-[0.3em]">
                {language === 'ru' ? 'Навигация' : 'Navigatsiya'}
              </h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><Link to="/" className="hover:text-blue-500 transition-colors">{language === 'ru' ? 'Главная' : 'Asosiy'}</Link></li>
                <li><Link to="/builder" className="hover:text-blue-400 transition-colors">{language === 'ru' ? 'Конструктор' : 'Konstruktor'}</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">{language === 'ru' ? 'О нас' : 'Biz haqimizda'}</Link></li>
              </ul>
            </div>

            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <h4 className="mb-6 font-black text-white text-[10px] uppercase tracking-[0.3em]">
                {language === 'ru' ? 'Контакты' : 'Aloqa'}
              </h4>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li><a href="tel:+99899991994" className="hover:text-blue-500 transition-colors">+998 99 999 19 94</a></li>
                <li><a href="mailto:support@gamezone.uz" className="hover:text-blue-500 transition-colors">support@gamezone.uz</a></li>
                <li className="text-slate-500">{language === 'ru' ? 'Ташкент, Узбекистан' : 'Toshkent, O\'zbekiston'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            © 2026 GameZoneBuild. {language === 'ru' ? 'Все права защищены' : 'Barcha huquqlar himoyalangan'}.
          </p>
        </div>
      </div>
    </footer>
  );
}
