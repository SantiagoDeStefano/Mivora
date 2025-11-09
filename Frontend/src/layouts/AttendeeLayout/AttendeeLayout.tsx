import Footer from '../../components/Footer'
import NavHeader from '../../components/NavHeader'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <NavHeader />
      {children}
      <Footer />
    </div>
  )
}
