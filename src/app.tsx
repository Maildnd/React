import 'src/global.css';

// ----------------------------------------------------------------------

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { LocalizationProvider } from 'src/locales'; // Can be removed
import { I18nProvider } from 'src/locales/i18n-provider'; // Can be removed
import { ThemeProvider } from 'src/theme/theme-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings'; // Can be removed

// import { AuthProvider } from 'src/auth/context/supabase';
import { AuthProvider } from 'src/auth/context/jwt'; // Can be removed

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <I18nProvider>
      <LocalizationProvider>
        <AuthProvider>
          <SettingsProvider settings={defaultSettings}>
            <ThemeProvider>
              <MotionLazy>
                  {/* Useed to keep track of the checkout car. Can be removed */}
                  <Snackbar /> {/* Used to show notifications? */}
                  <ProgressBar /> {/* Used to show progess bar on the landing page by scroll? */}
                  <SettingsDrawer /> {/* Used to ssettings drawer. Can be removed. */}
                  <Router />
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
