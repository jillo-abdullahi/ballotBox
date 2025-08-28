import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import ProposalPage from './pages/ProposalPage'
import CreateProposal from './pages/CreateProposal'

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

// Create the create proposal route
const createProposalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateProposal,
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, proposalRoute, createProposalRoute])

// Create the router
export const router = createRouter({ routeTree })
