import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2';

export default function PublicHome({ theme, setTheme }) {
  const year = new Date().getFullYear();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const mobileBtnRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mobileNavOpen) {
      return undefined;
    }

    function onPointerDown(event) {
      const nav = mobileNavRef.current;
      const button = mobileBtnRef.current;

      if (!nav || !button) {
        return;
      }

      if (!nav.contains(event.target) && !button.contains(event.target)) {
        setMobileNavOpen(false);
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const scriptId = 'elfsight-platform-script';

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function closeMobileNav() {
    setMobileNavOpen(false);
  }

  return (
    <div className={isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}>
      <a
        href="#main"
        className={`sr-only fixed left-3 top-3 z-[9999] rounded-xl border bg-white px-4 py-2 shadow focus:not-sr-only ${focusRing}`}
      >
        Skip to content
      </a>

      <header className={`sticky top-0 z-50 border-b backdrop-blur ${isDark ? 'border-white/10 bg-slate-950/90' : 'bg-white/90'}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <a href="#top" className={`flex items-center ${focusRing}`} aria-label="M1llion Fitness home">
            <img src="/logoCropped.png" alt="M1llion Fitness" className="h-10 w-auto md:h-12" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#coaching" className={`hover:opacity-70 ${focusRing}`}>
              Coaching
            </a>
            <a href="#about" className={`hover:opacity-70 ${focusRing}`}>
              About
            </a>
            <a href="#instagram" className={`hover:opacity-70 ${focusRing}`}>
              Instagram
            </a>
            <a href="#contact" className={`hover:opacity-70 ${focusRing}`}>
              Contact
            </a>
            <Link to="/login" className={`hover:opacity-70 ${focusRing}`}>
              Login
            </Link>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </nav>

          <button
            ref={mobileBtnRef}
            type="button"
            className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium md:hidden ${focusRing}`}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileNavOpen((value) => !value)}
          >
            Menu
          </button>
        </div>

        <nav
          id="mobile-nav"
          ref={mobileNavRef}
          aria-label="Mobile primary"
          className={`border-t md:hidden ${isDark ? 'border-white/10 bg-slate-950' : 'bg-white'} ${mobileNavOpen ? 'block' : 'hidden'}`}
        >
          <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3 text-sm font-medium">
            {[
              ['#coaching', 'Coaching'],
              ['#about', 'About'],
              ['#instagram', 'Instagram'],
              ['#contact', 'Contact'],
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={closeMobileNav} className={`py-2 ${focusRing}`}>
                {label}
              </a>
            ))}
            <Link to="/login" onClick={closeMobileNav} className={`py-2 ${focusRing}`}>
              Login
            </Link>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="scroll-mt-24 px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-12">
            <div className="order-1 md:order-2">
              <div className="mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-slate-100 sm:max-w-md md:max-w-none">
                <img
                  src="/C14.jpeg"
                  alt="Carolina in the gym"
                  className="h-full w-full object-cover object-[center_24%]"
                />
              </div>
            </div>

            <div className="order-2 text-center md:order-1 md:text-left">
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                Train with Confidence. Wear with Purpose.
              </h1>
              <p className={`mt-4 text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Programs that get results and apparel built for the grind.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <a href="#coaching" className={`rounded-xl px-6 py-3 ${isDark ? 'bg-white text-slate-950' : 'bg-black text-white'} ${focusRing}`}>
                  Start Coaching
                </a>
                <Link to="/login" className={`rounded-xl border px-6 py-3 ${isDark ? 'border-white/20' : ''} ${focusRing}`}>
                  Client Portal
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="coaching" className={`scroll-mt-24 border-y ${isDark ? 'border-white/10 bg-slate-900' : 'bg-slate-50'}`}>
          <div className="mx-auto max-w-6xl space-y-8 px-4 py-14">
            <h2 className="text-center text-3xl font-bold md:text-left">Coaching</h2>
            <p className={`max-w-2xl text-center text-sm md:text-left md:text-base ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Whether you want fully personalized 1:1 support or to train in a group setting,
              you can work with Carolina in the way that fits your life best.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <article className={`flex flex-col justify-between rounded-2xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-slate-950' : 'bg-white'}`}>
                <div>
                  <h3 className="text-xl font-semibold">1:1 Online Coaching</h3>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Custom training plans, macros, and weekly check-ins delivered through a private client portal.
                  </p>
                  <ul className={`mt-4 list-disc space-y-1 pl-5 text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <li>Personalized training and nutrition</li>
                    <li>Weekly check-ins and form feedback</li>
                    <li>Habit tracking and performance focus</li>
                  </ul>
                </div>
                <a
                  href="https://kahunas.io/coach/packages/list/a13e6be5-d737-47e0-b37e-8e8efbcf2c4c"
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-6 inline-block rounded-xl px-5 py-3 text-center text-sm ${isDark ? 'bg-white text-slate-950' : 'bg-black text-white hover:bg-gray-900'} ${focusRing}`}
                >
                  Book 1:1 on Kahunas
                </a>
              </article>

              <article className={`flex flex-col justify-between rounded-2xl border p-6 shadow-sm ${isDark ? 'border-white/10 bg-slate-950' : 'bg-white'}`}>
                <div>
                  <h3 className="text-xl font-semibold">Group Classes</h3>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    High-energy classes designed to push you, support you, and make training fun.
                  </p>
                  <ul className={`mt-4 list-disc space-y-1 pl-5 text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <li>Strength and conditioning style workouts</li>
                    <li>Supportive, women-focused environment</li>
                    <li>Book single sessions or packs</li>
                  </ul>
                </div>
                <a
                  href="https://m1llionfitness.setmore.com/"
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-6 inline-block rounded-xl px-5 py-3 text-center text-sm ${isDark ? 'bg-white text-slate-950' : 'bg-black text-white hover:bg-gray-900'} ${focusRing}`}
                >
                  Book Classes on Setmore
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="about" className={`scroll-mt-24 border-y ${isDark ? 'border-white/10 bg-slate-900' : 'bg-slate-50'}`}>
          <div className="mx-auto grid max-w-6xl items-stretch gap-10 px-4 py-14 md:grid-cols-2">
            <div className="order-2 flex w-full justify-center md:order-1 md:justify-start">
              <div className="min-h-[480px] w-full max-w-lg overflow-hidden rounded-2xl bg-black">
                <img
                  src="/headshot.png"
                  alt="Carolina training clients in a gym"
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 flex flex-col justify-center text-center md:order-2 md:text-left">
              <h2 className="text-3xl font-bold">Meet Carolina</h2>
              <p className={`mt-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Certified trainer helping clients build strength and confidence, on and off the gym floor.
              </p>
            </div>
          </div>
        </section>

        <section id="instagram" className={`scroll-mt-24 border-y ${isDark ? 'border-white/10 bg-slate-900' : 'bg-slate-50'}`}>
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-3xl font-bold">Instagram</h2>
              <p className={`mt-1 text-sm md:text-base ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Latest posts from Carolina&apos;s feed.</p>
            </div>
            <div className={`overflow-hidden rounded-2xl shadow-sm ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
              <div className="elfsight-app-17c86385-c4ee-440f-bab3-a003bbe60d01" />
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold">Questions? Let&apos;s talk.</h2>
            <form
              action="https://formspree.io/f/xzzjagqp"
              method="POST"
              className="mt-6 grid w-full max-w-md gap-3 text-left"
              acceptCharset="UTF-8"
              aria-describedby="contact-help"
            >
              <input type="hidden" name="_subject" value="New contact from M1llion site" />
              <input
                type="text"
                name="_gotcha"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <input className={`w-full rounded-xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-950 placeholder:text-slate-500'} ${focusRing}`} name="name" placeholder="Your name" autoComplete="name" required />
              <input className={`w-full rounded-xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-950 placeholder:text-slate-500'} ${focusRing}`} name="email" type="email" placeholder="Email" autoComplete="email" required />
              <textarea className={`w-full rounded-xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-slate-900 text-white placeholder:text-slate-500' : 'border-slate-300 bg-white text-slate-950 placeholder:text-slate-500'} ${focusRing}`} name="message" rows={4} placeholder="How can we help?" />
              <button type="submit" className={`rounded-xl px-5 py-3 text-sm ${isDark ? 'bg-white text-slate-950' : 'bg-black text-white'} ${focusRing}`}>
                Send
              </button>
              <p id="contact-help" className="text-center text-xs text-slate-600">
                We&apos;ll respond as soon as possible.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className={`mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-8 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <span>© {year} M1llion. All rights reserved.</span>
          <div className="flex gap-4">
            <a className={`underline ${focusRing}`} href="/privacy">
              Privacy
            </a>
            <a className={`underline ${focusRing}`} href="/terms">
              Terms of use
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
