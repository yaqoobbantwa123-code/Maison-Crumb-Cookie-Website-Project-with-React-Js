export default function AnnouncementBar() {
  return (
    <div className="relative z-[55] bg-espresso text-ivory">
      <div className="shell flex h-9 items-center justify-between gap-4">
        <p data-announcement className="hidden font-sans text-[8.5px] uppercase tracking-[0.22em] text-ivory/55 md:block">
          Complimentary shipping over $60
        </p>
        <p data-announcement className="font-sans text-[8.5px] uppercase tracking-[0.2em] text-ivory/90 sm:text-[9px]">
          Freshly baked happiness, delivered to your door.
        </p>
        <p data-announcement className="hidden font-sans text-[8.5px] uppercase tracking-[0.22em] text-ivory/55 md:block">
          Baked in small batches · Paris
        </p>
      </div>
    </div>
  )
}
