import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackgroundGrid } from './BackgroundGrid';
import { LanguageProvider } from '../context/LanguageContext';

export function Root() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#020617]">
        <div className="relative z-10">
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}
