import Footer from '../../components/Footer'
import NavHeader from '../../components/NavHeader'
import PageTransition from '../../components/PageTransition/PageTransition'

interface Props {
  children?: React.ReactNode
}

export default function UserLayout({ children }: Props) {
  return (
    <div>
      <NavHeader />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  )
}
