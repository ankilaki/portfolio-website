import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import LoadingSpinner from "./components/LoadingSpinner";

const Admin = lazy(() => import("./pages/Admin"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="min-h-screen pt-24"><LoadingSpinner /></div>}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
