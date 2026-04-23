import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import Intro from './components/Intro'
import Menu from './components/Menu'
import TopicPage from './components/TopicPage'
import GridPage from './components/GridPage'
import DetailPage from './components/DetailPage'

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

const topicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/t/$topicId',
  component: TopicPage,
})

const gridRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/t/$topicId/$sectionId/$subType',
  component: GridPage,
})

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/t/$topicId/$sectionId/$subType/$itemId',
  component: DetailPage,
})

const routeTree = rootRoute.addChildren([
  introRoute,
  menuRoute,
  topicRoute,
  gridRoute,
  detailRoute,
])

export const router = createRouter({ routeTree })
