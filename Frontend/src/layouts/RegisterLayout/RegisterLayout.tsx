import Footer from '../../components/Footer'
import RegisterHeader from '../../components/RegisterHeader'
import PageTransition from '../../components/PageTransition/PageTransition'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  )
}
