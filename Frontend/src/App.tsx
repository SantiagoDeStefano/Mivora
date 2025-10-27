import './App.css'
import useRouteElements from './useRouteElements'
// import { useContext, useEffect } from 'react'
// import { localStorageEventTarget } from './pages/Profile/auth'
// import { AppContext } from './contexts/app.context'

function App() {
  const routeElements = useRouteElements()
  // const { reset } = useContext(AppContext)
  // useEffect(() => {
  //   localStorageEventTarget.addEventListener('clearLocalStorage', reset)
  //   return () => {
  //     localStorageEventTarget.removeEventListener('clearLocalStorage', reset)
  //   }
  // }, [reset])
  return (
    <div>
      {routeElements}
    </div>
  )
}

export default App
