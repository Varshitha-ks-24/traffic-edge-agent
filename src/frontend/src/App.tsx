import { createActor } from "@/backend";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimulationStore } from "@/lib/simulationStore";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Suspense, lazy } from "react";

// Lazy-load pages
const Dashboard = lazy(() =>
  import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Anomalies = lazy(() =>
  import("@/pages/Anomalies").then((m) => ({ default: m.Anomalies })),
);
const Routing = lazy(() =>
  import("@/pages/Routing").then((m) => ({ default: m.Routing })),
);
const Emergency = lazy(() =>
  import("@/pages/Emergency").then((m) => ({ default: m.Emergency })),
);
const Incidents = lazy(() =>
  import("@/pages/Incidents").then((m) => ({ default: m.Incidents })),
);
const Monitor = lazy(() =>
  import("@/pages/Monitor").then((m) => ({ default: m.Monitor })),
);

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {(["a", "b", "c", "d"] as const).map((k) => (
          <Skeleton key={k} className="h-28 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}

function AppLayout() {
  const { actor } = useActor(createActor);
  const { setActor, fetchSnapshot } = useSimulationStore();

  useEffect(() => {
    if (actor) {
      setActor(actor);
      fetchSnapshot();

      const id = setInterval(() => {
        fetchSnapshot();
      }, 5000);
      return () => clearInterval(id);
    }
  }, [actor, setActor, fetchSnapshot]);

  return (
    <div className="dark flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute({ component: AppLayout });

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  ),
});

const anomaliesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/anomalies",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Anomalies />
    </Suspense>
  ),
});

const routingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/routing",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Routing />
    </Suspense>
  ),
});

const emergencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emergency",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Emergency />
    </Suspense>
  ),
});

const incidentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incidents",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Incidents />
    </Suspense>
  ),
});

const monitorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/monitor",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Monitor />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  anomaliesRoute,
  routingRoute,
  emergencyRoute,
  incidentsRoute,
  monitorRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
