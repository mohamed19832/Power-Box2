import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink, Outlet } from "react-router-dom";

const adminSections = [
  { id: "dashboard", label: "Dashboard", path: "/admin" },
  { id: "hero", label: "Hero", path: "/admin/hero" },
  { id: "why-choose", label: "Why Choose", path: "/admin/why-choose" },
  { id: "walmart", label: "Walmart", path: "/admin/walmart" },
  { id: "inside-box", label: "Inside Box", path: "/admin/inside-box" },
  { id: "testimonials", label: "Testimonials", path: "/admin/testimonials" },
  {
    id: "offer-pricing",
    label: "Offer / Pricing",
    path: "/admin/offer-pricing",
  },
  { id: "footer", label: "Footer (Social Links)", path: "/admin/footer" },
  { id: "seo", label: "SEO", path: "/admin/seo" },
  { id: "popups", label: "Popups", path: "/admin/popups" },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Snack Box Admin</h1>
      </header>

      <div className="flex">
        {/* Fixed Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] fixed">
          <nav className="p-6">
            <ul className="space-y-2">
              {adminSections.map((section) => (
                <li key={section.id}>
                  <NavLink
                    to={section.path}
                    end={section.path === "/admin"}
                    className={({ isActive }) =>
                      cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )
                    }
                  >
                    {section.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
