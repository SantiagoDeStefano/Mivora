export default function Footer() {
  return (
    <div>
      <footer className='border-t border-slate-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
            <p className='text-sm text-slate-500'>© {new Date().getFullYear()} PineTrail Camp. All rights reserved.</p>
            <ul className='flex flex-wrap items-center gap-4 text-sm'>
              <li>
                <a href='#' className='hover:underline'>
                  Brand Guide
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Privacy
                </a>
              </li>
              <li>
                <a href='#' className='hover:underline'>
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
