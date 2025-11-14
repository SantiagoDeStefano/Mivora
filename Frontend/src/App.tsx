import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import './App.css'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLocalStorage', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLocalStorage', reset)
    }
  }, [reset])
  return <div>{routeElements}</div>
}

export default App
