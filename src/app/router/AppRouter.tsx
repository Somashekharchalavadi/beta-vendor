import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "../../components/common/PageLoader";
import { AuthProvider } from "../../features/auth/AuthContext";
import { GuestRoute } from "../../features/auth/GuestRoute";
import { ProtectedRoute } from "../../features/auth/ProtectedRoute";
import { VendorLayout } from "../../layouts/VendorLayout";

const LoginPage = lazy(() =>
  import("../../pages/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const EditorPage = lazy(() =>
  import("../../pages/editor/EditorPage").then((m) => ({ default: m.EditorPage })),
);
const DashboardPage = lazy(() =>
  import("../../pages/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const SheetsPage = lazy(() =>
  import("../../pages/sheets/SheetsPage").then((m) => ({ default: m.SheetsPage })),
);
const TemplatesPage = lazy(() =>
  import("../../pages/templates/TemplatesPage").then((m) => ({ default: m.TemplatesPage })),
);
const TemplateDetailPage = lazy(() =>
  import("../../pages/templates/TemplateDetailPage").then((m) => ({ default: m.TemplateDetailPage })),
);
const AnalyticsPage = lazy(() =>
  import("../../pages/analytics/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
);
const WalletPage = lazy(() =>
  import("../../pages/wallet/WalletPage").then((m) => ({ default: m.WalletPage })),
);
const PlaceholderPage = lazy(() =>
  import("../../pages/PlaceholderPage").then((m) => ({ default: m.PlaceholderPage })),
);
const SearchPage = lazy(() =>
  import("../../pages/search/SearchPage").then((m) => ({ default: m.SearchPage })),
);
const NotificationsPage = lazy(() =>
  import("../../pages/notifications/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const OrganizationsPage = lazy(() =>
  import("../../pages/organizations/OrganizationsPage").then((m) => ({
    default: m.OrganizationsPage,
  })),
);
const StudentsPage = lazy(() =>
  import("../../pages/students/StudentsPage").then((m) => ({ default: m.StudentsPage })),
);
const SettingsPage = lazy(() =>
  import("../../pages/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const SupportPage = lazy(() =>
  import("../../pages/support/SupportPage").then((m) => ({ default: m.SupportPage })),
);
const PaymentResultPage = lazy(() =>
  import("../../pages/payment/PaymentResultPage").then((m) => ({ default: m.PaymentResultPage })),
);

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route
              path="/login"
              element={
                <LazyPage>
                  <LoginPage />
                </LazyPage>
              }
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/editor"
              element={
                <LazyPage>
                  <EditorPage />
                </LazyPage>
              }
            />
            <Route
              path="/payment/result"
              element={
                <LazyPage>
                  <PaymentResultPage />
                </LazyPage>
              }
            />
            <Route element={<VendorLayout />}>
              <Route
                index
                element={
                  <LazyPage>
                    <DashboardPage />
                  </LazyPage>
                }
              />
              <Route
                path="sheets"
                element={
                  <LazyPage>
                    <SheetsPage />
                  </LazyPage>
                }
              />
              <Route
                path="templates"
                element={
                  <LazyPage>
                    <TemplatesPage />
                  </LazyPage>
                }
              />
              <Route
                path="templates/:id"
                element={
                  <LazyPage>
                    <TemplateDetailPage />
                  </LazyPage>
                }
              />
              <Route
                path="analytics"
                element={
                  <LazyPage>
                    <AnalyticsPage />
                  </LazyPage>
                }
              />
              <Route
                path="wallet"
                element={
                  <LazyPage>
                    <WalletPage />
                  </LazyPage>
                }
              />
              <Route
                path="organizations"
                element={
                  <LazyPage>
                    <OrganizationsPage />
                  </LazyPage>
                }
              />
              <Route
                path="students"
                element={
                  <LazyPage>
                    <StudentsPage />
                  </LazyPage>
                }
              />
              <Route
                path="notifications"
                element={
                  <LazyPage>
                    <NotificationsPage />
                  </LazyPage>
                }
              />
              <Route
                path="security"
                element={
                  <LazyPage>
                    <PlaceholderPage title="Security" description="Session and account security settings coming soon." />
                  </LazyPage>
                }
              />
              <Route
                path="support"
                element={
                  <LazyPage>
                    <SupportPage />
                  </LazyPage>
                }
              />
              <Route
                path="settings"
                element={
                  <LazyPage>
                    <SettingsPage />
                  </LazyPage>
                }
              />
              <Route
                path="search"
                element={
                  <LazyPage>
                    <SearchPage />
                  </LazyPage>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
