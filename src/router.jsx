import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import Intro from './components/Intro'
import Menu from './components/Menu'
import RuoloDonne from './components/RuoloDonne'
import FotoVideo from './components/FotoVideo'
import FotoVideoDetail from './components/FotoVideoDetail'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const introRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Intro,
})

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: Menu,
})

const donneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donne',
  component: RuoloDonne,
})

const fotoVideoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donne/$sectionId/foto',
  component: FotoVideo,
})

const fotoVideoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donne/$sectionId/foto/$itemId',
  component: FotoVideoDetail,
})

const routeTree = rootRoute.addChildren([
  introRoute,
  menuRoute,
  donneRoute,
  fotoVideoRoute,
  fotoVideoDetailRoute,
])

export const router = createRouter({ routeTree })
