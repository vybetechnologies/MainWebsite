import Link from 'next/link';

/**
 * Sticky "Get Support" action shown only on mobile/tablet, per the plan's
 * mobile layout requirements (large tap target, always reachable).
 */
export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background/95 to-transparent lg:hidden">
      <Link
        href="/tech-rescue"
        className="flex w-full items-center justify-center rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground glow-primary"
      >
        Get Support
      </Link>
    </div>
  );
}
