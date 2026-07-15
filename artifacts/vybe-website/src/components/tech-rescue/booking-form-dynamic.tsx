'use client';

import dynamic from 'next/dynamic';

// BookingForm uses React Query hooks — must be loaded client-side only.
const BookingForm = dynamic(
  () => import('./booking-form').then((m) => ({ default: m.BookingForm })),
  { ssr: false, loading: () => <div className="h-32 animate-pulse rounded-xl bg-card/50" /> },
);

export function BookingFormDynamic() {
  return <BookingForm />;
}
