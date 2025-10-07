import { brand, navItems } from "../../constants/constants";

export default function Header() {
  return (
    <header className='sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-slate-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <a href='#home' className='flex items-center gap-2 group' aria-label='Camp brand home'>
            <span
              className='inline-flex h-8 w-8 rounded-xl items-center justify-center shadow-sm ring-1 ring-slate-200'
              style={{ background: brand.light }}
            >
              {/* simple mark */}
              <svg viewBox='0 0 24 24' className='h-5 w-5 text-teal-700'>
                <path fill='currentColor' d='M3 18l9-15 9 15H3zm9-9l5 9H7l5-9z' />
              </svg>
            </span>
            <span className='font-semibold tracking-tight text-slate-900'>PineTrail Camp</span>
          </a>

          {/* Accessible mobile menu without React state */}
          <nav className='hidden md:flex items-center gap-6'>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'
              >
                {item.label}
              </a>
            ))}
          </nav>

          <details className='md:hidden relative'>
            <summary className='list-none cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition'>
              Menu
            </summary>
            <div className='absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2 space-y-1'>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50'
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
