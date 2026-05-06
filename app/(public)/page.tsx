'use client';

import Image from 'next/image';
import { OrangeButton } from '@/components/button/button';
import { FAQSection } from '@/components/faq-section';
import { SearchBar } from '@/components/search-bar';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    const query = value.trim();

    if (!query) return;

    router.push(`/property?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <section
        className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[85vh] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/homebackground.jpg)' }}
        aria-label="Home Background"
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/15" aria-hidden>
          {/* content container */}

          <div className="relative z-10 flex min-h-[60vh] lg:min-h-[90vh] flex-col items-center justify-center px-4 pt-20 sm:px-6 sm:pt-2 sm:pb-16">
            <div className="w-full max-w-4xl mx-auto text-center ">
              <h1 className="text-[42px] font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-7xl">
                Find Your <span className="text-brand-400">Dream</span>
              </h1>
              <h3 className="text-[40px] sm:text-[68px] leading-tight text-white font-bold">
                Home With Ease
              </h3>
              <p className="mt-3 text-[12px] text-white/90 sm:mt-4 sm:text-[6px] md:text-lg md:max-w-137.5 md:mx-auto lg:mt-5">
                Rurblist connects you with trusted agents, verified properties, and <br /> escrow
                services , so your next deal is clean, clear, and worry-free
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>
      {/* key features */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-medium text-muted-foreground uppercase tracking-wide">Key Features</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            What Makes Us Your Perfect Partner
          </h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-4 p-8 sm:grid-cols-3 sm:gap-5 sm:p-10">
          <div className="rounded-xl bg-muted/50 p-5 shadow-sm sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400 text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="mt-13">
              <h3 className="text-base font-bold text-foreground">Verified Properties</h3>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                We are your one stop home destination,
                <br /> from search to sold!
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-5 shadow-sm sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400 text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="mt-13">
              <h3 className="mt-4 text-base font-bold text-foreground">Escrow</h3>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                We can be part of your realtor journey <br /> and we help build your realtor profile
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-5 shadow-sm sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-400 text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="mt-13">
              <h3 className="text-base font-bold text-foreground">Trust score</h3>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                Our properties are rated highly, we <br /> provide a great service.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* how it works */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Access your dream home with a few clicks
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
              <Image
                src="/Rectangle.svg"
                alt="Modern house with pool"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-8 sm:space-y-10">
              <div className="flex gap-3">
                <div className="h-35 w-1.25 shrink-0 rounded-full bg-brand-400" aria-hidden />
                <div>
                  <h1 className="font-semibold text-3xl">Step 1</h1>
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">
                      Find a Verified Property
                    </h3>
                    <p className="pt-2 text-muted-foreground">
                      Browse hundreds of listings with trust scores and verified <br />
                      documents
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2.75 shrink-0" aria-hidden />
                <div>
                  <h1 className="font-semibold text-3xl">Step 2</h1>
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">
                      Pay Safely with Escrow
                    </h3>
                    <p className="pt-2 text-muted-foreground">
                      Your money is held securely until we confirm everything is legit
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2.75 shrink-0" aria-hidden />
                <div>
                  <h1 className="font-semibold text-3xl">Step 3</h1>
                  <div className="mt-6">
                    {' '}
                    <h3 className="text-lg font-bold text-foreground sm:text-xl">
                      Close the Deal with Peace of Mind
                    </h3>
                    <p className="pt-2 text-muted-foreground">
                      You receive the documents. Seller gets paid. No drama.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured listings: 1 large left, 4 small in 2x2 right */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Featured listings
          </h2>
          <p className="mt-2 text-muted-foreground sm:text-lg">
            Dive into our extensive listings and discover apartments that match your lifestyle!
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Large image – left */}
            <article className="overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src="/Rectangle.svg"
                  alt="Featured listing"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 to-transparent"
                  aria-hidden
                />
                <p className="absolute bottom-4 left-4 text-base font-medium text-white sm:text-lg">
                  Warri, Delta state
                </p>
              </div>
            </article>
            {/* 4 smaller images – right, 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <article
                  key={i}
                  className="overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src="/Rectangle.svg"
                      alt={`Listing ${i}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/70 to-transparent"
                      aria-hidden
                    />
                    <p className="absolute bottom-3 left-3 text-sm font-medium text-white sm:bottom-4 sm:left-4 sm:text-base">
                      Warri, Delta state
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Expert Help Before You Pay – image left, content right (arranged as design) */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr] lg:items-center lg:gap-12">
            <div className="relative min-h-85 w-full overflow-hidden rounded-xl bg-muted sm:min-h-100 lg:min-h-130">
              <Image
                src="/laptop.svg"
                alt="Expert help - legal and inspection team"
                fill
                className="object-cover object-center rounded-xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            </div>
            <div className="flex flex-col items-center text-center lg:items-center lg:text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                Get Expert Help Before You Pay
              </h2>
              <p className="mt-4 text-muted-foreground sm:text-lg">
                Let our legal & inspection team confirm everything - from titles to government
                acquisition status.
              </p>
              <div className="mt-6">
                <OrangeButton onClick={() => router.push('/property-advisory')}>
                  Request Property Advisory
                </OrangeButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Rurblist Promise – text left, image right */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                The Rurblist Promise
              </h2>
              <ul className="mt-6 space-y-4" role="list">
                <li className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-green-500"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-foreground">Your money stays safe in escrow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-green-500"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-foreground">
                    Your property is verified by legal professionals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-green-500"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-foreground">Your peace of mind is our first product</span>
                </li>
              </ul>
              <div className="mt-6">
                <OrangeButton>See full trust promise</OrangeButton>
              </div>
            </div>
            <div className="relative aspect-540/667 overflow-hidden rounded-lg bg-muted">
              <Image
                src="/house.svg"
                alt="The Rurblist Promise - trust and verification"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* Confused about a property? – homebackground.jpg as background */}
      <section
        className="relative min-h-100 w-full bg-cover bg-center bg-no-repeat py-20 sm:min-h-125 sm:py-24 lg:min-h-140 lg:py-28"
        style={{ backgroundImage: 'url(/background.svg)' }}
        aria-label="Request Property Advisory"
      >
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Confused about a property? Need a land background check?
          </h2>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">
            Let our legal & inspection team confirm everything - from titles to government
            acquisition status.
          </p>
          <div className="mt-8 flex justify-center">
            <OrangeButton onClick={() => router.push('/property-advisory')}>
              Request Property Advisory
            </OrangeButton>
          </div>
        </div>
      </section>

      {/* Testimonials – what our clients are saying + lady image (human.svg) */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Testimonials
            </h2>
            <p className="mt-2 text-muted-foreground sm:text-lg">
              See what our customers are saying about our services
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                What our clients are saying
              </h3>
              <blockquote className="mt-6">
                <p className="text-muted-foreground sm:text-lg">
                  After going through the frustrations and stress of looking for a house that suits
                  my needs and with the frustrations from agents, I found rubrlist and decided to
                  give it a trial and it was the best decision I made because i found an amazing
                  home. Their stress free and affordable services are top notch.
                </p>
                <div className="mt-4 flex items-start gap-20">
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-foreground">Peter Adams</span>
                    <span className="text-muted-foreground text-sm">
                      65 Old gra road, Maryland.
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="flex text-amber-500" aria-label="5 stars">
                      ★★★★★
                    </span>
                    <span className="mt-1 text-sm text-muted-foreground">06/02/23</span>
                  </div>
                </div>
              </blockquote>
              <div className="mt-6 flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted"
                  aria-label="Previous testimonial"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted"
                  aria-label="Next testimonial"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative aspect-458/441 w-full overflow-hidden rounded-lg">
              <Image
                src="/human.svg"
                alt="Happy customer - testimonial"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
      <FAQSection />

      {/* CTA: Ready to find your dream home – orange background + search (contained, not full width) */}
      <section className="py-16 sm:py-20 lg:py-24" aria-label="Explore listings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand-500 py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-10 text-center">
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              Ready to find your dream home? Explore our listings <br /> now
            </h2>
            <div className="mt-8 flex justify-center">
              <SearchBar buttonLabel="Search" onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
