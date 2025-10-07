import { useRoutes } from 'react-router-dom'

import Content from './pages'
import MainLayout from './layouts/MainLayout/MainLayout'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <Content />
        </MainLayout>
      )
    }
  ])
  return routeElements
}
