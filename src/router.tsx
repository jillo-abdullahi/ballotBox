import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import ProposalPage from './pages/ProposalPage'
import MyProposals from './pages/MyProposals'

// Create a root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Create the home route  
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Create the proposal route
const proposalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proposal/$id',
  component: ProposalPage,
})

// Create the my proposals route
const myProposalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-proposals',
  component: MyProposals,
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, proposalRoute, myProposalsRoute])

// Create the router
export const router = createRouter({ routeTree })
