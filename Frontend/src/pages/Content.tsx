import React from 'react'
import { brand } from '../constants/constants'

function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {children}
    </section>
  )
}

export default function Content() {
  return (
    <div>
      {/* Hero / Home */}
      <Section id='home' className='relative overflow-hidden'>
        <div
          className='absolute inset-0 -z-10 opacity-10'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28'>
          <div className='grid lg:grid-cols-2 gap-10 items-center'>
            <div>
              <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900'>
                Adventure Training Camp 2025
              </h1>
              <p className='mt-4 text-lg text-slate-600 max-w-prose'>
                Sharpen your skills, make friends, and explore the outdoors. Join us for a week of hands-on workshops,
                games, and guided hikes.
              </p>
              {/* Countdown placeholder */}
              <div className='mt-6 grid grid-cols-4 gap-3 max-w-md'>
                {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
                  <div key={label} className='rounded-2xl bg-white border border-slate-200 p-3 text-center shadow-sm'>
                    <div className='text-2xl font-bold' aria-live='polite'>
                      00
                    </div>
                    <div className='text-[11px] uppercase tracking-wider text-slate-500'>{label}</div>
                  </div>
                ))}
              </div>
              <div className='mt-8 flex gap-3'>
                <a
                  href='#register'
                  className='inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl active:shadow border border-teal-800'
                  style={{ backgroundColor: brand.primary }}
                >
                  Reserve a Spot
                </a>
                <a
                  href='#about'
                  className='inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-teal-800 ring-1 ring-inset ring-teal-800/40 hover:ring-teal-800/70'
                >
                  Learn more
                </a>
              </div>
            </div>
            <div className='relative'>
              <div className='aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200'>
                <img
                  src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1932&auto=format&fit=crop'
                  alt='Campers hiking at sunrise'
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='absolute -bottom-4 -left-4 hidden sm:block rotate-[-3deg]'>
                <span className='rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold text-amber-900 shadow'>
                  Starts July 14
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* About */}
      <Section id='about' className='py-16 sm:py-20 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2'>
              <h2 className='text-3xl font-bold text-slate-900'>About the Camp</h2>
              <p className='mt-4 text-slate-600 leading-relaxed'>
                PineTrail Camp blends outdoor adventures with hands‑on learning. Expect guided treks, teamwork
                challenges, and workshops led by experienced instructors. Our objective is to build confidence,
                collaboration, and a love for nature. By the end, you’ll have new friends, new skills, and unforgettable
                memories.
              </p>
              <ul className='mt-6 space-y-3 text-slate-700'>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-5 w-5 text-teal-700'>✓</span> Expert mentors & safety‑first approach
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-5 w-5 text-teal-700'>✓</span> Eco‑friendly, leave‑no‑trace principles
                </li>
                <li className='flex items-start gap-3'>
                  <span className='mt-1 h-5 w-5 text-teal-700'>✓</span> Inclusive, beginner‑friendly activities
                </li>
              </ul>
            </div>
            <aside className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
              <h3 className='font-semibold text-slate-900'>Quick Facts</h3>
              <dl className='mt-4 grid grid-cols-2 gap-4 text-sm'>
                <div className='space-y-1'>
                  <dt className='text-slate-500'>Duration</dt>
                  <dd className='font-medium'>7 days</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-slate-500'>Location</dt>
                  <dd className='font-medium'>Spruce Valley</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-slate-500'>Group Size</dt>
                  <dd className='font-medium'>~40 campers</dd>
                </div>
                <div className='space-y-1'>
                  <dt className='text-slate-500'>Difficulty</dt>
                  <dd className='font-medium'>Beginner+</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </Section>

      {/* Schedule */}
      <Section id='schedule' className='py-16 sm:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-slate-900'>Tentative Schedule</h2>
          <ol className='mt-8 relative border-s border-transparent'>
            {[
              { day: 'Day 1', title: 'Arrival & Orientation', desc: 'Check‑in, cabin assignments, welcome campfire.' },
              { day: 'Day 2', title: 'Trail Skills', desc: 'Map reading, knot tying, and safety basics.' },
              { day: 'Day 3', title: 'Team Challenges', desc: 'Low‑rope course and cooperative games.' },
              { day: 'Day 4', title: 'Wilderness Workshop', desc: 'Shelter building and outdoor cooking.' },
              { day: 'Day 5', title: 'Summit Hike', desc: 'Sunrise trek and nature photography.' },
              { day: 'Day 6', title: 'Water Day', desc: 'Kayaking and lakeside picnic.' },
              { day: 'Day 7', title: 'Showcase & Farewell', desc: 'Talent show, awards, and goodbyes.' }
            ].map((item) => (
              <li key={item.day} className='group grid gap-2 sm:grid-cols-[10ch,1fr] sm:gap-6 py-6'>
                <div className='text-sm font-semibold text-teal-800 tracking-wider'>{item.day}</div>
                <div className='relative pl-6 sm:pl-0'>
                  <span
                    className='absolute left-0 top-2 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-white'
                    style={{ backgroundColor: brand.accent }}
                  />
                  <h3 className='ml-4 text-lg font-semibold text-slate-900'>{item.title}</h3>
                  <p className='text-slate-600'>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Gallery */}
      <Section id='gallery' className='py-16 sm:py-20 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-end justify-between gap-4'>
            <h2 className='text-3xl font-bold text-slate-900'>Gallery</h2>
            <a href='#' className='text-sm font-medium text-teal-800 hover:underline'>
              View all
            </a>
          </div>
          <div className='mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {[
              'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1974&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2000&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=2074&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1932&auto=format&fit=crop'
            ].map((src, i) => (
              <figure key={i} className='group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                <img
                  src={src}
                  alt='Camp activity'
                  className='aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                />
              </figure>
            ))}
          </div>
        </div>
      </Section>

      {/* Registration Form (HTML5 validation only, no JS logic) */}
      <Section id='register' className='py-16 sm:py-20'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl'>
            <h2 className='text-3xl font-bold text-slate-900'>Register</h2>
            <p className='mt-2 text-slate-600'>Secure your spot using the form below. Required fields are marked.</p>

            <form className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6' action='#' method='post'>
              <div className='col-span-full sm:col-span-1'>
                <label className='block text-sm font-medium text-slate-700'>First name *</label>
                <input
                  required
                  name='firstName'
                  className='mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-4 focus:ring-teal-100'
                  placeholder='Alex'
                />
              </div>
              <div className='col-span-full sm:col-span-1'>
                <label className='block text-sm font-medium text-slate-700'>Last name *</label>
                <input
                  required
                  name='lastName'
                  className='mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-4 focus:ring-teal-100'
                  placeholder='Kim'
                />
              </div>
              <div className='col-span-full'>
                <label className='block text-sm font-medium text-slate-700'>Email *</label>
                <input
                  required
                  type='email'
                  name='email'
                  className='mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-4 focus:ring-teal-100'
                  placeholder='you@example.com'
                />
              </div>
              <div className='col-span-full sm:col-span-1'>
                <label className='block text-sm font-medium text-slate-700'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  pattern='[0-9\-\+\s()]{7,}'
                  title='Please enter a valid phone number'
                  className='mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-4 focus:ring-teal-100'
                  placeholder='(+84) 0123 456 789'
                />
              </div>
              <div className='col-span-full sm:col-span-1'>
                <label className='block text-sm font-medium text-slate-700'>Age *</label>
                <input
                  required
                  type='number'
                  min='8'
                  max='70'
                  name='age'
                  className='mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-4 focus:ring-teal-100'
                  placeholder='16'
                />
              </div>
              <div className='col-span-full'>
                <label className='block text-sm font-medium text-slate-700'>Notes (optional)</label>
                <textarea
                  name='notes'
                  rows={4}
                  className='mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:ring-4 focus:ring-teal-100'
                  placeholder='Allergies, preferences, etc.'
                />
              </div>

              <div className='col-span-full flex items-center justify-between gap-4'>
                <div className='text-xs text-slate-500'>
                  By registering, you agree to our{' '}
                  <a href='#' className='underline'>
                    code of conduct
                  </a>
                  .
                </div>
                <button
                  type='submit'
                  className='rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl active:shadow border border-teal-800'
                  style={{ backgroundColor: brand.primary }}
                >
                  Submit
                </button>
              </div>

              {/* Placeholder confirmation notice */}
              <div role='status' aria-live='polite' className='col-span-full hidden' id='form-success'>
                <div className='rounded-xl bg-green-50 text-green-800 px-4 py-3 border border-green-200'>
                  Thanks for registering! A confirmation email will arrive shortly.
                </div>
              </div>
            </form>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id='contact' className='py-16 sm:py-20 bg-slate-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2'>
              <h2 className='text-3xl font-bold text-slate-900'>Contact Us</h2>
              <p className='mt-2 text-slate-600'>
                Reach out with questions about accessibility, dietary needs, or sponsorships.
              </p>
              <div className='mt-6 grid sm:grid-cols-2 gap-6'>
                <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                  <h3 className='font-semibold text-slate-900'>Camp Office</h3>
                  <address className='not-italic mt-2 text-sm text-slate-600'>
                    123 Spruce Lane, Spruce Valley
                    <br />
                    Phone:{' '}
                    <a href='tel:+18005551234' className='text-teal-800 hover:underline'>
                      +1 (800) 555‑1234
                    </a>
                    <br />
                    Email:{' '}
                    <a href='mailto:hello@pinetrail.camp' className='text-teal-800 hover:underline'>
                      hello@pinetrail.camp
                    </a>
                  </address>
                </div>
                <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                  <h3 className='font-semibold text-slate-900'>Follow & Share</h3>
                  <p className='mt-2 text-sm text-slate-600'>Help spread the word!</p>
                  <div className='mt-4 flex flex-wrap items-center gap-3'>
                    <a
                      href='#'
                      aria-label='Share on Facebook'
                      className='inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition'
                    >
                      <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                        <path d='M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.25 10.44 22v-7.02H7.9v-2.91h2.54V9.86c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.62.77-1.62 1.56v1.88h2.76l-.44 2.91h-2.32V22C18.34 21.25 22 17.1 22 12.07z' />
                      </svg>
                      Facebook
                    </a>
                    <a
                      href='#'
                      aria-label='Share on Twitter'
                      className='inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition'
                    >
                      <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                        <path d='M22 5.92c-.77.35-1.6.59-2.47.7a4.27 4.27 0 0 0 1.88-2.36 8.54 8.54 0 0 1-2.7 1.03 4.26 4.26 0 0 0-7.27 3.89A12.08 12.08 0 0 1 3.15 4.6a4.25 4.25 0 0 0 1.32 5.68 4.2 4.2 0 0 1-1.93-.53v.05c0 2.06 1.47 3.78 3.42 4.17-.36.1-.75.15-1.15.15-.28 0-.56-.03-.82-.08.56 1.76 2.19 3.05 4.13 3.08A8.54 8.54 0 0 1 2 19.54a12.05 12.05 0 0 0 6.54 1.92c7.85 0 12.14-6.51 12.14-12.14l-.01-.55A8.7 8.7 0 0 0 22 5.92z' />
                      </svg>
                      Twitter
                    </a>
                    <a
                      href='#'
                      aria-label='Copy link'
                      className='inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition'
                    >
                      <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                        <path d='M3.9 12a4.1 4.1 0 0 1 4.1-4.1h3v2h-3a2.1 2.1 0 1 0 0 4.2h3v2h-3A4.1 4.1 0 0 1 3.9 12zm6-1h4.2v2H9.9v-2zM16 6h-3v2h3a2.1 2.1 0 1 1 0 4.2h-3v2h3A4.1 4.1 0 1 0 16 6z' />
                      </svg>
                      Copy link
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:col-span-1'>
              <div className='aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm'>
                <img
                  src='https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop'
                  alt='Camp lake'
                  className='h-full w-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
