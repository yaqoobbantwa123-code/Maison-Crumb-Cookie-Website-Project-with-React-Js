import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Leaf, Timer, Wheat } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import bakery from '../assets/editorial/bakery.jpg'
import aboutStill from '../assets/editorial/about-still.jpg'
import craftHands from '../assets/editorial/craft-hands.jpg'
import craftBaker from '../assets/editorial/craft-baker.jpg'
import ingredients from '../assets/editorial/ingredients.jpg'

const NUMBERS = [
  { value: '2018', label: 'The first oven' },
  { value: '06', label: 'Bakers in the kitchen' },
  { value: '72h', label: 'Cold-fermented dough' },
  { value: '12', label: 'Recipes, no more' },
]

const VALUES = [
  {
    icon: Wheat,
    title: 'Fewer, better ingredients',
    copy: 'Cultured butter from Normandy, single-origin chocolate, Sicilian pistachios, fleur de sel. If it does not earn its place, it does not go in.',
  },
  {
    icon: Timer,
    title: 'Time as an ingredient',
    copy: 'Three days of cold fermentation. Slow browning. A baker watching the oven. The parts you cannot rush are the parts that matter.',
  },
  {
    icon: Leaf,
    title: 'Small on purpose',
    copy: 'We bake in trays, not factories. It means we sell out, and it means every box that leaves us is one we would happily eat ourselves.',
  },
]

const CRAFT = [
  {
    number: '01',
    title: 'Weigh, precisely',
    copy: 'Every recipe is weighed to the gram. Baking is chemistry before it is art, and we treat it that way.',
  },
  {
    number: '02',
    title: 'Rest, patiently',
    copy: 'The dough sleeps for 72 hours. Flour hydrates, enzymes work, and the flavour becomes deeper and rounder than same-day dough can ever be.',
  },
  {
    number: '03',
    title: 'Bake, attentively',
    copy: 'Small trays at a time. Pulled when the edge is set and the centre still has a slight wobble. The difference is measured in seconds.',
  },
]

const TIMELINE = [
  {
    year: '2018',
    title: 'One oven, one recipe',
    copy: 'MAISON CRUMB begins in a tiny Paris kitchen with a second-hand oven and a stubborn brown butter chocolate chip recipe.',
  },
  {
    year: '2020',
    title: 'The postal years',
    copy: 'When the city went quiet, we started wrapping boxes for the post. The first 1,000 orders were packed on a kitchen table.',
  },
  {
    year: '2023',
    title: 'The atelier',
    copy: 'We move into the 11th arrondissement, add a second oven, and hire the first proper team of bakers.',
  },
  {
    year: '2026',
    title: 'Still small, still slow',
    copy: 'Twelve recipes, six bakers and a waiting list on Fridays. The kitchen has grown; the rules have not changed.',
  },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="shell grid gap-10 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted">Our story</span>
          </nav>
          <p data-reveal="fade" className="eyebrow eyebrow-rule mt-8">
            The maison
          </p>
          <h1 data-reveal="heading" className="display-xl mt-6">
            A small maison
            <br />
            with a <em className="font-light italic text-accent">long memory</em>.
          </h1>
          <p
            data-reveal="fade"
            data-reveal-delay={0.08}
            className="mt-6 max-w-lg font-sans text-[13.5px] leading-relaxed text-muted"
          >
            We are a bakery in the 11th arrondissement of Paris, making a deliberately small
            collection of cookies. We use French butter, rest our dough for three days, and bake in
            batches small enough to watch every tray.
          </p>
          <div data-reveal="stagger" data-reveal-delay={0.1} className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop the collection <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Visit the atelier
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[500px]">
          <div data-reveal="image" className="aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-card bg-bg-soft">
            <img
              src={bakery}
              alt="The MAISON CRUMB bakery in Paris, with trays of cookies cooling"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -left-3 bottom-8 rounded-card border border-line bg-bg/92 px-5 py-4 shadow-lg backdrop-blur-md sm:-left-6">
            <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.2em] text-accent">
              Paris · 11e
            </p>
            <p className="mt-1 font-display text-2xl leading-none text-ink">Est. 2018</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-line bg-bg-soft">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-24">
          <div data-reveal="image" className="media-frame aspect-[4/3] rounded-card">
            <img
              src={aboutStill}
              alt="A table set with MAISON CRUMB cookies, coffee and linen"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              Why cookies
            </p>
            <h2 data-reveal="heading" className="display-md mt-5">
              Because a small thing,
              <br />
              done well, is <em className="font-light italic text-accent">enough</em>.
            </h2>
            <div
              data-reveal="stagger"
              data-reveal-delay={0.08}
              className="mt-5 space-y-4 font-sans text-[12.5px] leading-relaxed text-muted"
            >
              <p>
                We did not set out to build a cookie company. We set out to make one cookie we could
                not stop thinking about — the kind with a crackled edge, a soft middle and enough salt
                to keep you coming back.
              </p>
              <p>
                It took two years and a great many trays. Along the way we learned that the best
                results came from doing less, more carefully: fewer flavours, better butter, longer
                rests, smaller batches.
              </p>
              <p>
                That is still the whole philosophy. Twelve recipes, six bakers, one very particular
                oven schedule. Nothing on the shelf that we would not serve at our own table.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-line pt-5">
              <RatingStars rating={5} />
              <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted">
                4.9 average · 1,240 verified reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="shell py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {NUMBERS.map((item, index) => (
            <div
              key={item.label}
              data-reveal
              data-reveal-delay={index * 0.05}
              className="border-l border-line pl-5"
            >
              <p className="font-display text-4xl leading-none text-ink sm:text-5xl">{item.value}</p>
              <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.18em] text-faint">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-line bg-bg-soft">
        <div className="shell section-pad">
          <div className="max-w-2xl">
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              What we believe
            </p>
            <h2 data-reveal="heading" className="display-md mt-5 text-balance">
              Three rules we have never <em className="font-light italic text-accent">broken</em>.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                data-reveal
                data-reveal-delay={index * 0.06}
                className="border-t border-line pt-6"
              >
                <value.icon className="h-5 w-5 text-accent" strokeWidth={1.3} />
                <h3 className="mt-4 font-display text-2xl text-ink">{value.title}</h3>
                <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-muted">{value.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft */}
      <section id="craft" className="section-pad scroll-mt-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <div className="relative">
            <div data-reveal="image" className="aspect-[4/5] overflow-hidden rounded-card bg-bg-soft">
              <img
                src={craftHands}
                alt="A baker's hands shaping cookie dough"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              data-reveal="image"
              data-reveal-delay={0.12}
              className="absolute -bottom-6 -right-3 hidden w-[42%] overflow-hidden rounded-card border-4 border-bg bg-bg-soft shadow-xl sm:block lg:-right-8"
            >
              <img
                src={ingredients}
                alt="Chocolate, vanilla and salt on a worktop"
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              In the kitchen
            </p>
            <h2 data-reveal="heading" className="display-md mt-5">
              The recipe is
              <br />
              mostly <em className="font-light italic text-accent">patience</em>.
            </h2>
            <div className="mt-8">
              {CRAFT.map((step, index) => (
                <div
                  key={step.number}
                  data-reveal
                  data-reveal-delay={index * 0.05}
                  className="grid grid-cols-[36px_1fr] gap-4 border-t border-line py-5 last:border-b"
                >
                  <span className="font-sans text-[9px] font-semibold tracking-[0.18em] text-accent">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-ink">{step.title}</h3>
                    <p className="mt-1 font-sans text-[11.5px] leading-relaxed text-muted">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/shop"
              className="link-line mt-7 inline-flex font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Taste the result <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-line bg-bg-soft">
        <div className="shell section-pad">
          <div className="max-w-xl">
            <p data-reveal="fade" className="eyebrow eyebrow-rule">
              A short history
            </p>
            <h2 data-reveal="heading" className="display-md mt-5">
              Eight years, <em className="font-light italic text-accent">one recipe at a time</em>.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item, index) => (
              <div
                key={item.year}
                data-reveal
                data-reveal-delay={index * 0.05}
                className="relative border-t border-line pt-5"
              >
                <span className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-accent" />
                <p className="font-display text-3xl text-ink">{item.year}</p>
                <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {item.title}
                </p>
                <p className="mt-2 font-sans text-[11px] leading-relaxed text-muted">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-pad">
        <div className="shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          <div>
            <p data-reveal="heading" className="font-display text-3xl leading-snug text-ink sm:text-4xl lg:text-[2.8rem]">
              “A cookie is a small thing. It is also a hundred small decisions. We make every one of
              them <em className="font-light italic text-accent">deliberately</em>.”
            </p>
            <div data-reveal="fade" data-reveal-delay={0.1} className="mt-7 flex items-center gap-3 border-t border-line pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft font-sans text-[10px] font-semibold text-ink">
                CM
              </span>
              <div>
                <p className="font-sans text-[11.5px] font-semibold text-ink">Camille Marchand</p>
                <p className="font-sans text-[9px] uppercase tracking-[0.14em] text-faint">
                  Founder & head baker
                </p>
              </div>
            </div>
          </div>
          <div data-reveal="image" className="media-frame aspect-[4/3] rounded-card">
            <img
              src={craftBaker}
              alt="The head baker at work in the MAISON CRUMB kitchen"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-bg-soft">
        <div className="shell flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
          <div>
            <p data-reveal="fade" className="eyebrow">
              The best introduction
            </p>
            <h2 data-reveal="heading" className="mt-3 font-display text-4xl text-ink">
              A box of six, <em className="font-light italic text-accent">we suggest</em>.
            </h2>
          </div>
          <div data-reveal="stagger" className="flex flex-wrap gap-3">
            <Link to="/product/maison-signature" className="btn btn-primary">
              The Signature Box <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
            </Link>
            <Link to="/#build-your-box" className="btn btn-outline">
              Build your own
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
