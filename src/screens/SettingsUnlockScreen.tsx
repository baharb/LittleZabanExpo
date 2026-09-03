import React, { useContext } from 'react';
import PasswordGate from '../components/PasswordGate';
import { neliWorldAssets } from '../assets/neliWorldAssets';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';

export default function SettingsUnlockScreen() {
  const { verifySettingsPassword } = useContext(AppContext);
  const { goBack, navigate } = useNav();

  return (
    <PasswordGate
      iconSource={neliWorldAssets.ui.settings}
      title="ورود به تنظیمات"
      subtitle="برای باز کردن تنظیمات والدین، رمز عبور را وارد کنید."
      buttonLabel="باز کردن تنظیمات"
      errorText="رمز عبور درست نیست."
      onVerify={verifySettingsPassword}
      onSuccess={() => navigate({ name: 'Main', tab: 'Profile' })}
      onClose={goBack}
    />
  );
}
