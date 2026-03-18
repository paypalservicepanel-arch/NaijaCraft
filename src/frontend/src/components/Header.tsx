import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "@/lib/router";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, openAuthModal, logout } = useApp();
  const location = useLocation();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Find Trades", href: "/find-trades" },
    { label: "Categories", href: "/find-trades?tab=categories" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  const getDashboardLink = () => {
    if (!currentUser) return "/";
    if (currentUser.role === "artisan") return "/artisan-dashboard";
    if (currentUser.role === "admin") return "/admin";
    return "/customer-dashboard";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-bold text-primary">Naija</span>
            <span className="text-2xl font-bold text-foreground">Craft</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to={getDashboardLink()}
                      data-ocid="nav.dashboard.link"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    data-ocid="nav.logout.button"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={openAuthModal}
                data-ocid="nav.signin.button"
              >
                Sign In
              </Button>
            )}
            <Link to="/find-trades">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5"
                data-ocid="nav.post-project.button"
              >
                Post a Project
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile-menu.button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block px-3 py-2 text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    openAuthModal();
                    setMobileOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}
              <Link to="/find-trades" onClick={() => setMobileOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-primary text-primary-foreground rounded-full"
                >
                  Post a Project
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
