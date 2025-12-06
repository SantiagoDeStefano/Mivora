import Footer from '../../components/Footer'
import Header from '../../components/Header'
import NavHeader from '../../components/NavHeader'
import PageTransition from '../../components/PageTransition/PageTransition'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  const { isAuthenticated } = useContext(AppContext)

  return (
    <div>
      {isAuthenticated ? <NavHeader /> : <Header />}
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  )
}
