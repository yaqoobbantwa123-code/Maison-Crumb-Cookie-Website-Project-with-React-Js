import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import bakery from '../assets/editorial/bakery.jpg'

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.'),
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  subject: z.string().min(1, 'Choose a subject.'),
  orderNumber: z.string().trim().max(30, 'That order number looks too long.'),
  message: z
    .string()
    .trim()
    .min(20, 'A little more detail, please — at least 20 characters.')
    .max(1200, 'Please keep your message under 1,200 characters.'),
})

const SUBJECTS = [
  'A question about an order',
  'Gifting & corporate boxes',
  'Allergens & ingredients',
  'Press & collaborations',
  'Wholesale',
  'Something else',
]

const FAQS = [
  {
    question: 'How fresh are the cookies when they arrive?',
    answer:
      'Every box is baked to order on Tuesdays and Thursdays and dispatched within 24 hours. Cookies are best within ten days of baking; twenty seconds in a low oven brings the centre back to life.',
  },
  {
    question: 'How much is shipping, and where do you deliver?',
    answer:
      'Standard tracked delivery is $6.95 and complimentary on orders over $60. Express delivery is $12. We currently ship across Europe, North America, Australia, Japan and Singapore. Delivery is 3–5 working days standard, 1–2 express.',
  },
  {
    question: 'Can I send a box as a gift?',
    answer:
      'Yes — add a gift note at checkout and we will write it by hand. Prices are never included in the parcel, and every box arrives ribboned and ready to give.',
  },
  {
    question: 'Do you cater for allergies?',
    answer:
      'Our kitchen handles wheat, milk, eggs and nuts, so we cannot guarantee an allergen-free box. Full ingredients and allergen information are listed on each product page. If you have a serious allergy, please write to us before ordering.',
  },
  {
    question: 'Can I change or cancel an order?',
    answer:
      'Because we bake to order, please write to us within 12 hours of ordering. If the box has not gone into the oven, we will happily amend or cancel it. This demo store does not place real orders.',
  },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      subject: SUBJECTS[0],
      orderNumber: '',
      message: '',
    },
  })

  const onSubmit = (values) => {
    setSubmitted(values)
    reset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="border-b border-line bg-bg-soft">
        <div className="shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.16em] text-faint">
              <Link to="/" className="hover:text-accent">
                Home
              </Link>
              <span>/</span>
              <span className="text-muted">Contact</span>
            </nav>
            <p data-reveal="fade" className="eyebrow eyebrow-rule mt-8">
              Write to the maison
            </p>
            <h1 data-reveal="heading" className="display-lg mt-5">
              We read every
              <br />
              <em className="font-light italic text-accent">note.</em>
            </h1>
            <p
              data-reveal="fade"
              data-reveal-delay={0.08}
              className="mt-5 max-w-md font-sans text-[13px] leading-relaxed text-muted"
            >
              A question about an order, a gift you cannot quite decide on, or simply a cookie you
              think we should make — we would love to hear it.
            </p>
          </div>
          <div
            data-reveal="image"
            data-reveal-delay={0.08}
            className="media-frame hidden aspect-[4/3] rounded-card lg:block"
          >
            <img
              src={bakery}
              alt="The MAISON CRUMB bakery counter in Paris"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="shell py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Details */}
          <div data-reveal="stagger">
            <p className="eyebrow">The atelier</p>
            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                    Visit
                  </p>
                  <p className="mt-1 font-sans text-[12px] leading-relaxed text-muted">
                    14 Rue des Petits Pains
                    <br />
                    75011 Paris, France
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=14+Rue+des+Petits+Pains+75011+Paris"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-1.5 inline-flex items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-accent hover:text-ink"
                  >
                    Open in Maps <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                    Write
                  </p>
                  <a
                    href="mailto:bonjour@maisoncrumb.com"
                    className="mt-1 block font-sans text-[12px] text-muted transition-colors hover:text-accent"
                  >
                    bonjour@maisoncrumb.com
                  </a>
                  <a
                    href="mailto:orders@maisoncrumb.com"
                    className="mt-0.5 block font-sans text-[12px] text-muted transition-colors hover:text-accent"
                  >
                    orders@maisoncrumb.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                    Call
                  </p>
                  <a
                    href="tel:+33145678910"
                    className="mt-1 block font-sans text-[12px] text-muted transition-colors hover:text-accent"
                  >
                    +33 1 45 67 89 10
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.4} />
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                    Hours
                  </p>
                  <p className="mt-1 font-sans text-[12px] leading-relaxed text-muted">
                    Tuesday – Saturday
                    <br />
                    9am – 6pm CET
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="font-display text-2xl text-ink">Prefer a quick answer?</p>
              <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-muted">
                Our most-asked questions — shipping, gifting, allergens and freshness — are answered
                below.
              </p>
              <a
                href="#faq"
                className="mt-4 inline-flex items-center gap-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-accent hover:text-ink"
              >
                Read the FAQ <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Form */}
          <div data-reveal="fade" data-reveal-delay={0.08}>
            {submitted ? (
              <div className="surface-card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
                  <Check className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <p className="eyebrow mt-5">Message received</p>
                <h2 className="mt-2 font-display text-3xl text-ink">
                  Thank you, {submitted.name.split(' ')[0]}.
                </h2>
                <p className="mt-3 max-w-md font-sans text-[12.5px] leading-relaxed text-muted">
                  Your note about “{submitted.subject.toLowerCase()}” is with us. We usually reply
                  within one working day. This demo does not send or store the message on a server.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setSubmitted(null)} className="btn btn-primary">
                    Write another note
                  </button>
                  <Link to="/shop" className="btn btn-outline">
                    Browse the collection
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="surface-card p-6 sm:p-8" noValidate>
                <p className="eyebrow">Send a note</p>
                <h2 className="mt-2 font-display text-3xl text-ink">How can we help?</h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="field-label">
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      className="field"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      {...register('name')}
                    />
                    {errors.name ? (
                      <p id="contact-name-error" role="alert" className="mt-1.5 font-sans text-[10px] text-red-700 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="field-label">
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      className="field"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      {...register('email')}
                    />
                    {errors.email ? (
                      <p id="contact-email-error" role="alert" className="mt-1.5 font-sans text-[10px] text-red-700 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="field-label">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        id="contact-subject"
                        className="field appearance-none pr-9"
                        {...register('subject')}
                      >
                        {SUBJECTS.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-order" className="field-label">
                      Order number <span className="normal-case tracking-normal text-faint">(optional)</span>
                    </label>
                    <input
                      id="contact-order"
                      type="text"
                      placeholder="MC-261234-5678"
                      className="field"
                      aria-invalid={Boolean(errors.orderNumber)}
                      aria-describedby={errors.orderNumber ? 'contact-order-error' : undefined}
                      {...register('orderNumber')}
                    />
                    {errors.orderNumber ? (
                      <p id="contact-order-error" role="alert" className="mt-1.5 font-sans text-[10px] text-red-700 dark:text-red-400">
                        {errors.orderNumber.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className="field-label">
                      Your message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      placeholder="Tell us a little about what you need…"
                      className="field resize-none"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      {...register('message')}
                    />
                    {errors.message ? (
                      <p id="contact-message-error" role="alert" className="mt-1.5 font-sans text-[10px] text-red-700 dark:text-red-400">
                        {errors.message.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
                  <Send className="h-3.5 w-3.5" strokeWidth={1.6} /> Send message
                </button>
                <p className="mt-3 font-sans text-[9.5px] leading-relaxed text-faint">
                  This form is a front-end demonstration. Nothing is sent to a server.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-line bg-bg-soft">
        <div className="shell py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p data-reveal="fade" className="eyebrow eyebrow-rule">
                Good to know
              </p>
              <h2 data-reveal="heading" className="display-md mt-5">
                Frequently asked,
                <br />
                <em className="font-light italic text-accent">quietly answered.</em>
              </h2>
              <p
                data-reveal="fade"
                data-reveal-delay={0.08}
                className="mt-4 max-w-sm font-sans text-[12.5px] leading-relaxed text-muted"
              >
                Still unsure about something? Write to us at{' '}
                <a href="mailto:bonjour@maisoncrumb.com" className="text-ink underline underline-offset-4 hover:text-accent">
                  bonjour@maisoncrumb.com
                </a>
                .
              </p>
            </div>

            <div data-reveal="stagger" data-reveal-delay={0.08}>
              {FAQS.map((faq) => (
                <details key={faq.question} className="group border-t border-line py-5 last:border-b">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <span className="font-display text-xl leading-snug text-ink">{faq.question}</span>
                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" strokeWidth={1.5} />
                  </summary>
                  <p className="mt-3 max-w-2xl font-sans text-[12px] leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
