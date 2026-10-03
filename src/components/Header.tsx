import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Categories from backend
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const categories = categoriesData && Array.isArray(categoriesData) ? categoriesData : [];

  // Sync search term with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search') || '';
    setSearchTerm(urlSearch);
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
    setIsSearchOpen(false);
  };

  return (
    <header className="border-b bg-background fixed top-0 left-0 right-0 z-[100] w-full">
      <div className="w-full max-w-[1400px] mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.webp?v=4"
              alt="Makela Cosmetics"
              width={512}
              height={171}
              className="block h-12 w-auto shrink-0"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </Link>

          <div className="hidden min-w-0 flex-1 lg:flex">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full max-w-md xl:max-w-lg mx-auto">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-0 pl-10 pr-2 rounded-r-none h-9"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Button
                type="submit"
                className="shrink-0 rounded-l-none px-4 h-9"
                disabled={!searchTerm.trim()}
              >
                Search
              </Button>
            </form>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link to="/products" className="hover:text-primary">Products</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    Categories <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {categories.map((cat) => (
                    <DropdownMenuItem asChild key={cat.id}>
                      <Link to={`/products?category=${cat.id}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild aria-label="Login">
                <Link to="/login">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Login</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="relative" asChild aria-label="Cart">
              <Link to="/cart">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Search icon — mobile only (desktop has search bar in header) */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[110]">
                <div className="mt-6 flex flex-col space-y-4">
                  <nav className="flex flex-col space-y-4">
                    <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
                    <details className="group">
                      <summary className="cursor-pointer rounded px-1 py-2 font-medium transition-colors hover:bg-primary/10 hover:text-primary">Categories</summary>
                      <div className="flex flex-col pl-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/products?category=${cat.id}`}
                            onClick={() => setIsOpen(false)}
                            className="py-1 text-sm hover:text-primary"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </details>

                    {isAuthenticated ? (
                      <>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left">Logout</button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search overlay — appears when search icon is clicked */}
        {isSearchOpen && (
          <div className="fixed top-0 left-0 right-0 z-[110] bg-background border-b shadow-md lg:hidden">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex h-16 items-center gap-2 px-4"
            >
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8 h-10"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-10 px-4"
                disabled={!searchTerm.trim()}
              >
                Search
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-10 w-10 p-0"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
