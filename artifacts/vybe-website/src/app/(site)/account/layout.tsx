import { ReactNode } from 'react';
import AccountClientLayout from './account-client-layout';

export const metadata = {
  title: 'My Account',
  description: 'Manage your VYBE Technologies account, repairs, and applications.',
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountClientLayout>{children}</AccountClientLayout>;
}
