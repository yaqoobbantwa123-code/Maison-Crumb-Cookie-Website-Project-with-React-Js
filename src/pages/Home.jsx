import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import {
  ArrowRight,
  ArrowUpRight,
  Cookie,
  Hand,
  Move,
  RotateCcw,
  Sparkles,
  Timer,
} from 'lucide-react'
import 'swiper/css'
import 'swiper/css/pagination'

import SectionHeading from '../components/SectionHeading'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import CookiePhysics from '../components/CookiePhysics'
import CookieBoxBuilder from '../components/CookieBoxBuilder'
import ReviewCard from '../components/ReviewCard'
import Newsletter from '../components/Newsletter'
import RatingStars from '../components/RatingStars'
import { featuredProducts } from '../data/products'
import { categories, collectionEdits } from '../data/categories'
import { testimonials } from '../data/reviews'
import { animateHero, initPhysicsStory } from '../animations/scrollAnimations'
import { scrollToElement } from '../utils/smoothScroll'

import lifestyle from '../assets/editorial/lifestyle.jpg'
import breakCookie from '../assets/editorial/break-cookie.jpg'
import craftHands from '../assets/editorial/craft-hands.jpg'
import ingredients from '../assets/editorial/ingredients.jpg'
import bakery from '../assets/editorial/bakery.jpg'
import craftBaker from '../assets/editorial/craft-baker.jpg'
import giftBox from '../assets/editorial/gift-box.jpg'
import aboutStill from '../assets/editorial/about-still.jpg'

const PILLARS = [
  {
    number: '01',
    title: 'French butter',
    copy: 'Cultured butter from a small dairy in Normandy. Browned slowly, never rushed.',
  },
  {
    number: '02',
    title: '72-hour dough',
    copy: 'The dough rests for three days. Time builds flavour that no shortcut can fake.',
  },
  {
    number: '03',
    title: 'Baked to order',
    copy: 'Nothing sits on a shelf. Every box is baked, cooled and wrapped the day it leaves us.',
  },
]

const CRAFT_STEPS = [
  {
    number: '01',
    title: 'Source',
    copy: 'Single-origin chocolate, Sicilian pistachios, Tahitian vanilla, fleur de sel. We buy less, but better.',
  },
  {
    number: '02',
    title: 'Rest',
    copy: 'The dough is cold-fermented for 72 hours, so the flour hydrates fully and the flavour deepens.',
  },
  {
    number: '03',
    title: 'Bake',
    copy: 'Small trays, short ovens, a baker watching. Pulled at the exact moment the centre stops wobbling.',
  },
]

const GALLERY = [
  { image: breakCookie, alt: 'A cookie broken in half, showing a soft centre', position: 'object-center' },
  { image: craftBaker, alt: 'A baker shaping cookie dough by hand', position: 'object-center' },
  { image: giftBox, alt: 'A ribboned MAISON CRUMB gift box', position: 'object-center' },
  { image: bakery, alt: 'The warm interior of the MAISON CRUMB bakery', position: 'object-center' },
  { image: aboutStill, alt: 'Cookies and coffee styled on a linen table', position: 'object-center' },
  { image: ingredients, alt: 'Ingredients laid out on a marble worktop', position: 'object-center' },
]

export default function Home() {
  const [quickView, setQuickView] = useState(null)
  const [physicsStatus, setPhysicsStatus] = useState('falling')
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const storyCopyRef = useRef(null)
  const storyStageRef = useRef(null)
  const storySceneRef = useRef(null)

  useEffect(() => {
    const cleanup = animateHero(heroRef.current)
    return cleanup
  }, [])

  useEffect(() => {
    const controller = initPhysicsStory({
      root: storyRef.current,
      stage: storyStageRef.current,
      copy: storyCopyRef.current,
    })
    return () => {
      controller?.cleanup()
      storySceneRef.current = null
    }
  }, [])

  const handleStorySceneReady = useCallback((scene) => {
    storySceneRef.current = scene
  }, [])

  const handleActivity = useCallback(({ active }) => {
    setPhysicsStatus(active ? 'falling' : 'settled')
  }, [])

  const handleDropCookie = useCallback(() => {
    storySceneRef.current?.dropCookie()
  }, [])

  const handleRefillBag = useCallback(() => {
    storySceneRef.current?.refill()
  }, [])

  return (
    <>
      {/* 2 · Hero */}
      <section ref={heroRef} className="relative overflow-hidden pb-14 pt-8 sm:pt-12 lg:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-accent/[0.06] blur-3xl"
        />
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div className="relative z-10">
            <p data-hero-eyebrow className="eyebrow eyebrow-rule">
              Maison Crumb · Paris · Est. 2018
            </p>
            <h1 className="display-xl mt-7 text-ink">
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block">
                  The art of
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block font-light italic text-accent">
                  perfect
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span data-hero-line className="block">
                  cookies.
                </span>
              </span>
            </h1>
            <p
              data-hero-copy
              className="mt-6 max-w-md font-sans text-[13.5px] leading-relaxed text-muted"
            >
              Small-batch cookies, made slowly with French butter, single-origin chocolate and a
              great deal of patience. Baked in Paris, sent everywhere.
            </p>

            <div data-hero-cta className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" data-magnetic="0.16" className="btn btn-primary">
                Shop the collection <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </Link>
              <Link to="/about" data-magnetic="0.12" className="btn btn-outline">
                Our story
              </Link>
            </div>

            <div
              data-hero-trust
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-line pt-6"
            >
              <div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={4.9} size="md" />
                  <span className="font-sans text-[11px] font-medium text-ink">4.9 / 5</span>
                </div>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
                  1,240 verified reviews
                </p>
              </div>
              <span className="hidden h-8 w-px bg-line sm:block" />
              <div>
                <p className="font-sans text-[11px] font-medium text-ink">Baked to order</p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
                  Shipped within 24 hours
                </p>
              </div>
              <span className="hidden h-8 w-px bg-line sm:block" />
              <div>
                <p className="font-sans text-[11px] font-medium text-ink">Complimentary</p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
                  Delivery over $60
                </p>
              </div>
            </div>
          </div>

          <div data-hero-stage className="relative mx-auto w-full max-w-[540px]">
            <span
              data-float
              aria-hidden="true"
              className="pointer-events-none absolute left-[7%] top-[13%] h-2 w-2 rounded-full bg-gold/70 shadow-[0_0_18px_rgba(190,147,90,0.55)]"
            />
            <span
              data-float
              aria-hidden="true"
              className="pointer-events-none absolute left-[2%] top-[44%] h-1.5 w-1.5 rounded-full bg-accent/50"
            />
            <span
              data-float
              aria-hidden="true"
              className="pointer-events-none absolute right-[4%] bottom-[28%] h-1 w-1 rounded-full bg-gold/50"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-card bg-bg-soft">
              <img
                src={lifestyle}
                alt="A hand holding a freshly baked MAISON CRUMB cookie"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/25 via-transparent to-transparent" />
            </div>

            <div
              data-hero-caption
              className="absolute -left-2 bottom-8 hidden max-w-[200px] rounded-card border border-line bg-bg/92 p-4 shadow-[0_18px_50px_rgba(40,26,16,0.14)] backdrop-blur-md sm:-left-6 sm:bottom-12 sm:block"
            >
              <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.22em] text-accent">
                The house rule
              </p>
              <p className="mt-1.5 font-display text-xl leading-tight text-ink">
                72 hours of rest. 12 minutes in the oven.
              </p>
            </div>

            <div
              data-hero-meta
              className="absolute -right-1 top-10 flex h-24 w-24 items-center justify-center rounded-full border border-ink/15 bg-bg/70 backdrop-blur-sm sm:-right-4 sm:h-28 sm:w-28"
            >
              <div className="text-center">
                <p className="font-display text-2xl leading-none text-ink">No. 01</p>
                <p className="mt-1 font-sans text-[7px] uppercase tracking-[0.22em] text-muted">
                  Paris · 48.86° N
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial marquee */}
        <div className="mt-14 overflow-hidden border-y border-line py-3.5 lg:mt-20">
          <div className="flex w-max animate-marquee items-center">
            {[0, 1].map((group) => (
              <div key={group} className="flex items-center" aria-hidden={group === 1}>
                {[
                  'French cultured butter',
                  'Single-origin chocolate',
                  '72-hour cold-fermented dough',
                  'Baked in small batches',
                  'Hand-finished in Paris',
                ].map((item) => (
                  <span key={`${group}-${item}`} className="flex items-center">
                    <span className="px-7 font-sans text-[9px] font-semibold uppercase tracking-[0.24em] text-muted">
                      {item}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-accent/60" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Interactive physics */}
      <section
        ref={storyRef}
        id="play"
        aria-labelledby="physics-title"
        className="relative overflow-hidden bg-espresso text-ivory"
      >
        <div className="relative flex items-center py-16 lg:py-24">
          <div
            data-story-glow
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_66%_48%,rgba(190,147,90,0.2),transparent_58%)]"
          />

          <div className="shell relative grid w-full gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <div ref={storyCopyRef} data-story-copy>
              <p className="eyebrow flex items-center gap-3 !text-ivory/50">
                <span className="h-px w-8 bg-gold/70" /> A small amusement
              </p>
              <h2 id="physics-title" className="display-md mt-5 text-ivory">
                Play with your food.
                <br />
                <em className="font-light italic text-gold">We insist.</em>
              </h2>
              <p className="mt-5 max-w-md font-sans text-[13px] leading-relaxed text-ivory/60">
                Our packaging, rebuilt as a little physics playground. Drag a cookie out of the
                bag, lift it over the opening, and let go. Gravity, mass and collisions do the rest
                — no smoke and mirrors.
              </p>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Move, title: 'Drag with mouse or finger', copy: 'Touch-ready, on any device.' },
                  { icon: Sparkles, title: 'Real gravity & collisions', copy: 'Powered by Matter.js.' },
                  { icon: Timer, title: 'Pauses off-screen', copy: 'Quiet when you are not looking.' },
                  { icon: Cookie, title: 'Twelve cookies, one bag', copy: 'Each with its own character.' },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                    <div>
                      <p className="font-sans text-[11px] font-semibold text-ivory/90">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-sans text-[10px] text-ivory/45">{item.copy}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button type="button" onClick={handleDropCookie} className="btn btn-light">
                  Drop a cookie <Hand className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToElement('#build-your-box')}
                  className="btn btn-outline !border-ivory/20 !text-ivory hover:!border-gold hover:!text-gold"
                >
                  Build a box <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={handleRefillBag}
                  className="inline-flex items-center gap-2 rounded-full px-2 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/45 transition-colors hover:text-gold"
                  aria-label="Refill the bag and drop all cookies again"
                >
                  <RotateCcw className="h-3 w-3" strokeWidth={1.6} /> Refill
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3 font-sans text-[8px] uppercase tracking-[0.2em] text-ivory/40">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full bg-gold transition-opacity duration-500 ${
                      physicsStatus === 'falling' ? 'animate-ping opacity-60' : 'opacity-0'
                    }`}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <span aria-live="polite">
                  {physicsStatus === 'falling'
                    ? 'Physics running · cookies in motion'
                    : 'Physics at rest · cookies settled'}
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px]">
              <div ref={storyStageRef} data-story-stage className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 rounded-[3rem] bg-gold/10 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#18100b]/70 p-2 shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
                  <CookiePhysics
                    compact
                    cookieCount={12}
                    showOrbit={false}
                    onSceneReady={handleStorySceneReady}
                    onActivity={handleActivity}
                    className="aspect-[5/6]"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 font-sans text-[8px] uppercase tracking-[0.18em] text-ivory/40">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full bg-gold ${
                        physicsStatus === 'falling' ? 'animate-pulse' : ''
                      }`}
                    />
                    Live physics · Matter.js
                  </span>
                  <span>{physicsStatus === 'falling' ? 'Falling in' : 'Settled'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Brand intro */}
      <section className="border-b border-line bg-bg-soft">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:py-24">
          <div data-reveal className="flex flex-col justify-between gap-8">
            <div>
              <p className="eyebrow eyebrow-rule">The maison</p>
              <p className="mt-5 max-w-[220px] font-sans text-[12px] leading-relaxed text-muted">
                A small kitchen in the 11th arrondissement. Six bakers, one oven, and a stubborn
                belief that a cookie can be a serious thing.
              </p>
            </div>
            <Link
              to="/about"
              className="link-line w-fit font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ink"
            >
              Read our story <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>

          <div>
            <p
              data-reveal="heading"
              className="max-w-3xl font-display text-[clamp(1.9rem,3.4vw,3.15rem)] leading-[1.12] tracking-[-0.02em] text-ink"
            >
              We are not in a hurry. Neither is the dough. We make cookies the slow way — because
              the slow way is the only way we know to make them{' '}
              <em className="font-light italic text-accent">this good</em>.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {PILLARS.map((pillar, index) => (
                <div
                  key={pillar.number}
                  data-reveal
                  data-reveal-delay={index * 0.08}
                  className="border-t border-line pt-5"
                >
                  <p className="font-sans text-[9px] font-semibold tracking-[0.2em] text-accent">
                    {pillar.number}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ink">{pillar.title}</h3>
                  <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-muted">
                    {pillar.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Best sellers */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            eyebrow="The bestsellers"
            title={
              <>
                The ones that keep <em className="font-light italic text-accent">selling out</em>.
              </>
            }
            description="Six recipes define the maison. These are the boxes our regulars reorder without thinking — and the ones we suggest you begin with."
            action={{ label: 'Shop all cookies', to: '/shop' }}
          />
          <div className="mt-12">
            <ProductGrid
              products={featuredProducts.slice(0, 4)}
              onQuickView={setQuickView}
              priorityCount={2}
            />
          </div>
        </div>
      </section>

      {/* 6 · Collection */}
      <section className="border-y border-line bg-bg-soft">
        <div className="shell section-pad">
          <SectionHeading
            eyebrow="The collection"
            title={
              <>
                Three edits, <em className="font-light italic text-accent">one obsession</em>.
              </>
            }
            description="Start with a mood. Each edit gathers the recipes that belong together — dark and serious, quietly floral, or unmistakably signature."
            action={{ label: 'Browse the full collection', to: '/shop' }}
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {collectionEdits.map((edit, index) => (
              <Link
                key={edit.id}
                to={edit.href}
                data-reveal="image"
                data-reveal-delay={index * 0.07}
                className="group relative block aspect-[3/4] overflow-hidden rounded-card bg-bg"
              >
                <img
                  src={edit.image}
                  alt={edit.title}
                  className="h-full w-full object-cover transition-transform duration-[1.5s] ease-luxe group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory/60">
                      Edit {edit.index}
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-500 group-hover:border-ivory group-hover:bg-ivory group-hover:text-espresso">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-3xl text-ivory">{edit.title}</h3>
                  <p className="mt-1.5 font-sans text-[11.5px] text-ivory/65">{edit.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-7">
            <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-faint">
              By flavour
            </span>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="font-sans text-[11px] text-muted transition-colors hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · Craftsmanship */}
      <section id="craftsmanship" className="section-pad">
        <div className="shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-bg-soft">
              <img
                src={craftHands}
                alt="Hands shaping cookie dough on a floured worktop"
                className="h-full w-full scale-105 object-cover"
                data-parallax="6"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-8 -right-3 hidden w-[46%] overflow-hidden rounded-card border-4 border-bg bg-bg-soft shadow-xl sm:block lg:-right-8" data-reveal="image">
              <img
                src={ingredients}
                alt="Vanilla, chocolate and sea salt ready for baking"
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -left-3 top-6 hidden -rotate-90 font-sans text-[8px] uppercase tracking-[0.3em] text-muted sm:block">
              The craft · Paris
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              The craft
            </p>
            <h2 data-reveal="heading" className="display-md mt-5 text-balance">
              Slow is the only <em className="font-light italic text-accent">shortcut</em>.
            </h2>
            <p
              data-reveal="fade"
              data-reveal-delay={0.08}
              className="mt-5 max-w-lg font-sans text-[13px] leading-relaxed text-muted"
            >
              A cookie is a small thing. It is also a hundred small decisions — the temperature of
              the butter, the grind of the chocolate, the exact second you pull the tray. We make
              every one of them deliberately.
            </p>

            <div className="mt-9 space-y-0">
              {CRAFT_STEPS.map((step, index) => (
                <div
                  key={step.number}
                  data-reveal
                  data-reveal-delay={index * 0.06}
                  className="grid grid-cols-[42px_1fr] gap-4 border-t border-line py-5 last:border-b"
                >
                  <span className="font-sans text-[9px] font-semibold tracking-[0.2em] text-accent">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-ink">{step.title}</h3>
                    <p className="mt-1.5 max-w-md font-sans text-[11.5px] leading-relaxed text-muted">
                      {step.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/about" className="btn btn-outline">
                Inside the maison
              </Link>
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
                Six bakers · One oven · Since 2018
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · Build your box */}
      <section id="build-your-box" className="scroll-mt-24 border-y border-line bg-bg-soft">
        <div className="shell section-pad">
          <SectionHeading
            eyebrow="Made to order"
            title={
              <>
                Build your own <em className="font-light italic text-accent">box</em>.
              </>
            }
            description="Choose a size, then mix the collection to your taste. We will bake it the morning it leaves us and wrap it by hand."
            action={{ label: 'See all flavours', to: '/shop' }}
          />
          <div data-reveal className="mt-12">
            <CookieBoxBuilder />
          </div>
        </div>
      </section>

      {/* 9 · Reviews */}
      <section className="section-pad">
        <div className="shell">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Kind words
              </p>
              <h2 data-reveal="heading" className="display-md mt-5 max-w-xl text-balance">
                Eaten quietly, <em className="font-light italic text-accent">remembered</em> loudly.
              </h2>
            </div>
            <div data-reveal="fade" className="flex items-center gap-4 border-t border-line pt-5 lg:border-none lg:pt-0">
              <p className="font-display text-5xl leading-none text-ink">4.9</p>
              <div>
                <RatingStars rating={4.9} size="md" />
                <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.16em] text-muted">
                  1,240 verified reviews · 96% would reorder
                </p>
              </div>
            </div>
          </div>

          <div className="swiper-luxe mt-12">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 5200, disableOnInteraction: true }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              aria-label="Customer reviews"
            >
              {testimonials.map((review) => (
                <SwiperSlide key={review.id} className="!h-auto pb-1">
                  <ReviewCard review={review} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* 10 · Newsletter */}
      <section className="border-t border-line bg-bg-soft">
        <div className="shell py-16 lg:py-20">
          <div data-reveal="fade">
            <Newsletter />
          </div>
        </div>
      </section>

      {/* 11 · Instagram */}
      <section className="section-pad">
        <div className="shell">
          <SectionHeading
            eyebrow="From the maison"
            title={
              <>
                A little life, <em className="font-light italic text-accent">unposed</em>.
              </>
            }
            description="Crumbs on the counter, boxes on the table, the occasional 7am oven. Follow along for the less polished side of the maison."
            action={{ label: 'Instagram', to: 'https://www.instagram.com/' }}
          />
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {GALLERY.map((item, index) => (
              <a
                key={`${item.alt}-${index}`}
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer noopener"
                data-reveal="image"
                data-reveal-delay={index * 0.04}
                className="group relative aspect-square overflow-hidden rounded-card bg-bg-soft"
                aria-label={`${item.alt} — view on Instagram`}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110 ${item.position}`}
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-espresso/0 text-ivory opacity-0 transition-all duration-500 group-hover:bg-espresso/35 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={1.3} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}
