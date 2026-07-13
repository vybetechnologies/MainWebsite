'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Show, useUser, useClerk } from '@clerk/react';
import { useListBookingRequests } from '@workspace/api-client-react';

const STAFF_ALLOWED_EMAILS = ['mason@vybetechnologies.net', 'mavis@vybetechnologies.net'];

function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: '/staff/sign-in' })}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Sign out
    </button>
  );
}

function SubmissionsTable() {
  const { data, isLoading, isError } = useListBookingRequests();

  if (isLoading) {
    return <p className="text-muted-foreground">Loading submissions…</p>;
  }
  if (isError) {
    return (
      <p className="text-destructive">
        Couldn&rsquo;t load submissions. Make sure your account is authorized and try again.
      </p>
    );
  }

  const requests = data?.requests ?? [];
  if (requests.length === 0) {
    return <p className="text-muted-foreground">No submissions yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-card text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {requests.map((r) => (
            <tr key={r.id} className="align-top">
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {new Date(r.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {r.firstName} {r.lastName}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                  {r.email}
                </a>
                {r.phone ? <div className="text-muted-foreground">{r.phone}</div> : null}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{r.service}</td>
              <td className="px-4 py-3 max-w-md">{r.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StaffDashboardPage() {
  const { user, isLoaded } = useUser();

  const isAuthorized = useMemo(() => {
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
    return Boolean(email && STAFF_ALLOWED_EMAILS.includes(email));
  }, [user]);

  return (
    <div className="container mx-auto px-6 md:px-12 py-16 flex-1">
      <Show when="signed-out">
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Staff sign-in required</h1>
          <p className="text-muted-foreground max-w-sm">
            This page is for authorized VYBE staff only.
          </p>
          <Link
            href="/staff/sign-in"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      </Show>
      <Show when="signed-in">
        {!isLoaded ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !isAuthorized ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
            <p className="text-muted-foreground max-w-sm">
              {user?.primaryEmailAddress?.emailAddress} isn&rsquo;t on the staff list. Contact an
              administrator if you believe this is a mistake.
            </p>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-semibold">Submissions</h1>
                <p className="text-muted-foreground">
                  Contact, booking, and careers requests submitted through the site.
                </p>
              </div>
              <SignOutButton />
            </div>
            <SubmissionsTable />
          </div>
        )}
      </Show>
    </div>
  );
}
