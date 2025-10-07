import Footer from '../../components/Footer'
import Header from '../../components/Header'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      {/* grows to fill leftover space */}
      <main className='flex-1'>{children}</main>

      <Footer />
    </div>
  )
}
