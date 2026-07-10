export default function Hero({
  title,
  subtitle,
  bannerUrl,
}: {
  title: string;
  subtitle: string;
  bannerUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
      {bannerUrl && (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bannerUrl} alt="" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05070d]/60 to-[#05070d]" />
        </div>
      )}

      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 sm:text-lg">{subtitle}</p>
      </div>
    </section>
  );
}
