import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import HomePage from "./pages/HomePage";
import ProposalPage from "./pages/ProposalPage";
import CreateProposal from "./pages/CreateProposal";
import NotFoundPage from "./pages/NotFoundPage";
import { Navbar } from "./components";
import { ScrollToTop } from "./components/ScrollToTop";

// Create a root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <ScrollToTop />
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundPage,
});

// Create the home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// Create the proposal route
const proposalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/proposal/$id",
  component: ProposalPage,
});

// Create the create proposal route
const createProposalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: CreateProposal,
});

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  proposalRoute,
  createProposalRoute,
]);

// Create the router
export const router = createRouter({ routeTree });
