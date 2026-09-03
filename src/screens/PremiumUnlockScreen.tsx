import React, { useContext } from 'react';
import PasswordGate from '../components/PasswordGate';
import { AppContext } from '../store/AppContext';
import { useNav } from '../store/NavContext';

// Password checkpoint before anything premium. Reuses the same parent
// account password as Settings (a parent has already set one up), so kids
// can't reach the payment screen on their own from wherever a "Premium"
// entry point ends up living.
export default function PremiumUnlockScreen() {
  const { verifySettingsPassword } = useContext(AppContext);
  const { goBack, navigate } = useNav();

  return (
    <PasswordGate
      iconEmoji="👑"
      title="تایید رمز والدین"
      subtitle="برای دیدن نسخه ویژه و ادامه‌ی خرید، رمز عبور والدین را وارد کنید."
      buttonLabel="ادامه"
      errorText="رمز عبور درست نیست."
      onVerify={verifySettingsPassword}
      onSuccess={() => navigate({ name: 'Premium' })}
      onClose={goBack}
    />
  );
}
