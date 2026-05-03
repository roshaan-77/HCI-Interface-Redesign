import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Menu,
  Search,
  Send,
  X,
} from 'lucide-react'
import './App.css'

const imageBase = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'

const heroImages = {
  home: `${imageBase}Yale%20-%20University%20Art%20Gallery%20%2844517964724%29.jpg?width=2400`,
  about: `${imageBase}Yale%20Art%20Gallery.jpg?width=2200`,
  apply: `${imageBase}Stone%20art%20studio%20%28Unsplash%29.jpg?width=2200`,
  exhibitions: `${imageBase}Barjeel%20Art%20Foundation%20-%20Yale%20Art%20Gallery.jpg?width=2200`,
  publications: `${imageBase}Laptop%20on%20desk%20book%20stacks%20%28Unsplash%29.jpg?width=2200`,
  news: `${imageBase}Biblioteca%20Vasconcelos%20-%20Salas%20de%20lectura.jpg?width=2200`,
  events: `${imageBase}Gammage%20Auditorium%20%2832342650252%29.jpg?width=2200`,
} as const

type PageKey =
  | 'home'
  | 'about'
  | 'apply'
  | 'exhibitions'
  | 'publications'
  | 'news'
  | 'events'

type SitePage = {
  key: PageKey
  title: string
  path: string
  kicker: string
  intro: string
  image: string
}

type Notice = {
  title: string
  text: string
  tag: string
}

const pages: SitePage[] = [
  {
    key: 'home',
    title: 'Home',
    path: '/',
    kicker: 'Yale School of Art',
    intro:
      'A graduate school and public wiki for artists, designers, faculty, students, alumni, and visitors.',
    image: heroImages.home,
  },
  {
    key: 'about',
    title: 'About the School',
    path: '/about',
    kicker: 'Mission, people, facilities',
    intro:
      'The Yale School of Art confers MFA degrees in Graphic Design, Painting and Printmaking, Photography, and Sculpture.',
    image: heroImages.about,
  },
  {
    key: 'apply',
    title: 'Apply to the School',
    path: '/apply',
    kicker: 'Graduate admission',
    intro:
      'Application information for prospective MFA students, including portfolio expectations, deadlines, and financial aid routes.',
    image: heroImages.apply,
  },
  {
    key: 'exhibitions',
    title: 'Exhibitions',
    path: '/exhibitions',
    kicker: 'On view and upcoming',
    intro:
      'Student, faculty, alumni, and guest exhibitions across School of Art spaces and public venues.',
    image: heroImages.exhibitions,
  },
  {
    key: 'publications',
    title: 'Publications',
    path: '/publications',
    kicker: 'Books, catalogs, archives',
    intro:
      'Printed and digital publications from the School of Art community, organized for browsing and reference.',
    image: heroImages.publications,
  },
  {
    key: 'news',
    title: 'News',
    path: '/news',
    kicker: 'School announcements',
    intro:
      'Updates from the Yale School of Art community, including opportunities, awards, exhibitions, and lectures.',
    image: heroImages.news,
  },
  {
    key: 'events',
    title: 'Public Events',
    path: '/public-events',
    kicker: 'Lectures, talks, screenings',
    intro:
      'Public programs at the School of Art, made easier to scan by date, format, and location.',
    image: heroImages.events,
  },
]

const homeNotices: Notice[] = [
  {
    title: 'Happening at SOA',
    text: 'Open studios, talks, critiques, exhibitions, and community announcements for the week.',
    tag: 'Community',
  },
  {
    title: 'Community Bulletin Board',
    text: 'A shared space for opportunities, calls, resources, and notes from students and alumni.',
    tag: 'Wiki',
  },
  {
    title: 'Calendars and Newsletters',
    text: 'Academic dates, public events, and School of Art newsletters gathered in one clear place.',
    tag: 'Updates',
  },
]

const studyAreas = [
  'Graphic Design',
  'Painting and Printmaking',
  'Photography',
  'Sculpture',
]

const exhibitionItems = [
  ['Thesis Exhibition', 'Green Hall Gallery', 'May 6 to May 18'],
  ['Open Studios', '1156 Chapel Street', 'May 10'],
  ['Visiting Artist Projects', '32 Edgewood Avenue', 'May 16'],
]

const newsItems = [
  'Critic visits and lecture schedule updated for the spring term.',
  'Student work selected for campus and citywide exhibition programs.',
  'New faculty resources are available through the School of Art office.',
]

const publicationItems = [
  ['Yale Graphic Design MFA', 'Catalogs and thesis books from recent graduating classes.'],
  ['Painting and Printmaking Notes', 'Studio writing, exhibition records, and community references.'],
  ['Photography Publications', 'Student-led books, image archives, and public project documentation.'],
]

const eventItems = [
  ['Mon', 'Artist Lecture', 'A public conversation in Green Hall'],
  ['Wed', 'Film Screening', 'Moving-image work selected by students'],
  ['Fri', 'Gallery Walkthrough', 'Guided visit with exhibiting artists'],
]

function getPageFromPath(pathname: string) {
  return pages.find((page) => page.path === pathname) ?? pages[0]
}

function App() {
  const [activePage, setActivePage] = useState<SitePage>(() => getPageFromPath(window.location.pathname))
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [quickLinksOpen, setQuickLinksOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [checkedSteps, setCheckedSteps] = useState<string[]>(['Portfolio'])

  useEffect(() => {
    const onPopState = () => setActivePage(getPageFromPath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return pages
    return pages.filter((page) =>
      [page.title, page.kicker, page.intro].join(' ').toLowerCase().includes(normalized),
    )
  }, [query])

  const goToPage = (page: SitePage) => {
    setActivePage(page)
    setMenuOpen(false)
    window.history.pushState({}, page.title, page.path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    setMessage(email ? `Thanks. Updates will be sent to ${email}.` : 'Please enter an email address.')
    event.currentTarget.reset()
  }

  const submitVisit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? 'Visitor').trim() || 'Visitor'
    setMessage(`${name}, your visit request has been recorded for the admissions office.`)
    event.currentTarget.reset()
  }

  const toggleStep = (step: string) => {
    setCheckedSteps((current) =>
      current.includes(step) ? current.filter((item) => item !== step) : [...current, step],
    )
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>

        <button className="brand" type="button" onClick={() => goToPage(pages[0])}>
          <img src="/assets/yale-crest.svg" alt="" />
          <strong>Yale School of Art</strong>
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {pages.map((page) => (
            <button
              key={page.key}
              className={page.key === activePage.key ? 'active' : ''}
              type="button"
              onClick={() => goToPage(page)}
            >
              {page.title}
            </button>
          ))}
        </nav>

        <a className="contact-link" href="mailto:artschool.info@yale.edu">
          <Mail size={18} aria-hidden="true" />
          Contact
        </a>
      </header>

      <aside className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        <div className="drawer-top">
          <strong>Yale School of Art</strong>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        {pages.map((page) => (
          <button key={page.key} type="button" onClick={() => goToPage(page)}>
            {page.title}
          </button>
        ))}
      </aside>

      {menuOpen && <button className="drawer-backdrop" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <main>
        <section
          className={`hero hero-${activePage.key}`}
          style={{ '--hero-image': `url(${activePage.image})` } as CSSProperties}
        >
          <div className="hero-inner">
            <div className="address-strip">
              <span>Yale School of Art</span>
              <span>1156 Chapel Street, POB 208339</span>
              <span>New Haven, Connecticut, 06520-8339</span>
            </div>
            <p className="kicker">{activePage.kicker}</p>
            <h1>{activePage.title === 'Home' ? 'Yale School of Art' : activePage.title}</h1>
            <p className="hero-text">{activePage.intro}</p>
            <div className="hero-actions">
              <button type="button" onClick={() => goToPage(pages[2])}>
                Apply to the School <ArrowRight size={18} />
              </button>
              <button type="button" className="light" onClick={() => goToPage(pages[3])}>
                View exhibitions
              </button>
            </div>
          </div>
        </section>

        <section className="utility-row" aria-label="Site tools">
          <label className="site-search">
            <Search size={20} aria-hidden="true" />
            <span className="sr-only">Search pages</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages, events, admissions"
            />
          </label>
          <button className="quick-toggle" type="button" onClick={() => setQuickLinksOpen((open) => !open)}>
            Quick links <ChevronDown size={20} className={quickLinksOpen ? 'rotated' : ''} />
          </button>
        </section>

        {query && (
          <section className="search-results" aria-label="Search results">
            {filteredPages.map((page) => (
              <button key={page.key} type="button" onClick={() => goToPage(page)}>
                <strong>{page.title}</strong>
                <span>{page.intro}</span>
              </button>
            ))}
          </section>
        )}

        {quickLinksOpen && (
          <section className="quick-links" aria-label="Quick links">
            {['Mission Statement', 'Graduate Admission', 'Financial Aid', 'Academic Calendar'].map((link) => (
              <button key={link} type="button" onClick={() => goToPage(link === 'Graduate Admission' || link === 'Financial Aid' ? pages[2] : pages[1])}>
                {link}
              </button>
            ))}
          </section>
        )}

        <PageBody
          activePage={activePage}
          goToPage={goToPage}
          onNewsletterSubmit={submitNewsletter}
          onVisitSubmit={submitVisit}
          checkedSteps={checkedSteps}
          toggleStep={toggleStep}
        />

        {message && (
          <div className="status-message" role="status">
            <Check size={18} aria-hidden="true" />
            {message}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div>
          <strong>Yale School of Art</strong>
          <span>1156 Chapel Street, New Haven, CT</span>
        </div>
        <a href="https://www.art.yale.edu/" target="_blank" rel="noreferrer">
          art.yale.edu <ExternalLink size={16} aria-hidden="true" />
        </a>
      </footer>
    </div>
  )
}

type PageBodyProps = {
  activePage: SitePage
  goToPage: (page: SitePage) => void
  onNewsletterSubmit: (event: FormEvent<HTMLFormElement>) => void
  onVisitSubmit: (event: FormEvent<HTMLFormElement>) => void
  checkedSteps: string[]
  toggleStep: (step: string) => void
}

function PageBody({
  activePage,
  goToPage,
  onNewsletterSubmit,
  onVisitSubmit,
  checkedSteps,
  toggleStep,
}: PageBodyProps) {
  if (activePage.key === 'about') {
    return (
      <section className="page-section two-column">
        <article className="editorial-block">
          <p className="section-label">In About the School</p>
          <h2>Mission, land acknowledgement, study areas, people, resources, visiting, facilities, support, contact, history, and site information.</h2>
          <p>
            The School of Art provides an educational context where artists and designers can explore
            their own talents in a setting shaped by critique, studio practice, and conversation.
          </p>
        </article>
        <div className="info-grid">
          {studyAreas.map((area) => (
            <article key={area}>
              <h3>{area}</h3>
              <p>MFA study area with faculty critique, studios, exhibitions, and public programming.</p>
            </article>
          ))}
        </div>
        <form className="action-form" onSubmit={onVisitSubmit}>
          <h3>Plan a Visit</h3>
          <input name="name" placeholder="Your name" />
          <input name="date" type="date" />
          <button type="submit">
            Request visit <Send size={17} />
          </button>
        </form>
      </section>
    )
  }

  if (activePage.key === 'apply') {
    const steps = ['Portfolio', 'Statement', 'Recommendations', 'Transcripts', 'Application fee']
    return (
      <section className="page-section apply-layout">
        <article className="editorial-block">
          <p className="section-label">Apply to the School</p>
          <h2>Graduate admission is organized by study area, portfolio strength, and clear deadlines.</h2>
          <p>
            Prospective students can review requirements, prepare portfolio material, check financial
            aid information, and follow the admissions checklist from one place.
          </p>
          <button type="button" onClick={() => goToPage(pages[1])}>
            Review study areas <ArrowRight size={18} />
          </button>
        </article>
        <div className="check-panel">
          <h3>Application Checklist</h3>
          {steps.map((step) => (
            <button
              key={step}
              className={checkedSteps.includes(step) ? 'checked' : ''}
              type="button"
              onClick={() => toggleStep(step)}
            >
              <span>{checkedSteps.includes(step) && <Check size={16} />}</span>
              {step}
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (activePage.key === 'exhibitions') {
    return (
      <section className="page-section">
        <div className="section-heading">
          <p className="section-label">Exhibitions</p>
          <h2>Current and upcoming exhibitions are easier to compare by date and location.</h2>
        </div>
        <div className="listing-grid">
          {exhibitionItems.map(([title, place, date]) => (
            <article key={title}>
              <span>{date}</span>
              <h3>{title}</h3>
              <p><MapPin size={16} /> {place}</p>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (activePage.key === 'publications') {
    return (
      <section className="page-section">
        <div className="section-heading">
          <p className="section-label">Publications</p>
          <h2>A readable catalog for books, archives, and student-led publishing.</h2>
        </div>
        <div className="publication-list">
          {publicationItems.map(([title, text]) => (
            <article key={title}>
              <FileText size={28} aria-hidden="true" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (activePage.key === 'news') {
    return (
      <section className="page-section news-layout">
        <div>
          <p className="section-label">News</p>
          <h2>Announcements from the School of Art community.</h2>
        </div>
        {newsItems.map((item, index) => (
          <article key={item}>
            <span>0{index + 1}</span>
            <p>{item}</p>
          </article>
        ))}
        <form className="newsletter" onSubmit={onNewsletterSubmit}>
          <h3>Receive School updates</h3>
          <input name="email" type="email" placeholder="Email address" />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    )
  }

  if (activePage.key === 'events') {
    return (
      <section className="page-section event-layout">
        <div className="section-heading">
          <p className="section-label">Public Events</p>
          <h2>Lectures, screenings, critiques, and gallery programs.</h2>
        </div>
        {eventItems.map(([day, title, text]) => (
          <article key={title}>
            <CalendarDays size={24} aria-hidden="true" />
            <strong>{day}</strong>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className="page-section home-layout">
      <article className="editorial-block intro-card">
        <p className="section-label">The School of Art</p>
        <h2>An ongoing collaborative experiment in digital publishing and information sharing.</h2>
        <p>
          This website belongs to the School of Art community. Students, faculty, staff, and alumni
          can contribute pages while visitors get a clearer path to programs, events, exhibitions,
          admissions, and news.
        </p>
      </article>
      <div className="notice-list">
        {homeNotices.map((notice) => (
          <button key={notice.title} type="button" onClick={() => goToPage(notice.title.includes('Calendar') ? pages[6] : pages[5])}>
            <span>{notice.tag}</span>
            <strong>{notice.title}</strong>
            <p>{notice.text}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default App
