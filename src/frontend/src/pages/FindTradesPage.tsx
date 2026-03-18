import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Link } from "@/lib/router";
import {
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  CATEGORIES,
  NIGERIAN_STATES,
  SAMPLE_ARTISANS,
} from "../data/sampleData";

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "reviews", label: "Most Reviews" },
];

export function FindTradesPage() {
  const _qs = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const [search, setSearch] = useState(_qs.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    _qs.get("category") || "",
  );
  const [selectedState, setSelectedState] = useState(_qs.get("state") || "");
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...SAMPLE_ARTISANS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (selectedCategory) {
      const catName = CATEGORIES.find((c) => c.id === selectedCategory)?.name;
      if (catName)
        list = list.filter(
          (a) => a.category.toLowerCase() === catName.toLowerCase(),
        );
    }
    if (selectedState) {
      list = list.filter((a) => a.state === selectedState);
    }
    if (minRating > 0) {
      list = list.filter((a) => a.rating >= minRating);
    }
    if (availableOnly) {
      list = list.filter((a) => a.availability === "available");
    }
    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.hourlyRate - b.hourlyRate;
      if (sortBy === "price-high") return b.hourlyRate - a.hourlyRate;
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
      return 0;
    });
    return list;
  }, [
    search,
    selectedCategory,
    selectedState,
    minRating,
    availableOnly,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedState("");
    setMinRating(0);
    setAvailableOnly(false);
  };

  const FilterSidebar = () => (
    <aside className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Trade Category</h3>
        <div className="space-y-1.5">
          <button
            type="button"
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
            onClick={() => setSelectedCategory("")}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              onClick={() => setSelectedCategory(cat.id)}
              data-ocid={`filter.category.${cat.id}.button`}
            >
              {cat.name}{" "}
              <span className="text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">State</h3>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="text-sm" data-ocid="filter.state.select">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {NIGERIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">
          Minimum Rating: {minRating > 0 ? `${minRating}★` : "Any"}
        </h3>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[minRating]}
          onValueChange={([v]) => setMinRating(v)}
          className="py-1"
          data-ocid="filter.rating.slider"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="rounded"
            data-ocid="filter.available.checkbox"
          />
          <span className="text-sm font-medium">Available only</span>
        </label>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={clearFilters}
        data-ocid="filter.clear.button"
      >
        <X className="w-3 h-3 mr-1" /> Clear Filters
      </Button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-display font-bold mb-4">
            Find Skilled Artisans
          </h1>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by trade, skill or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-ocid="trades.search.input"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44" data-ocid="trades.sort.select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              data-ocid="trades.filter.button"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Desktop */}
          <div className="hidden md:block w-56 shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                role="presentation"
                className="absolute inset-0 bg-black/40"
                onClick={() => setSidebarOpen(false)}
                onKeyDown={() => setSidebarOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button type="button" onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                artisans found
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16" data-ocid="trades.empty_state">
                <SlidersHorizontal className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No artisans match your filters. Try adjusting your search.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="text-primary mt-2"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((artisan, i) => (
                  <motion.div
                    key={artisan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    data-ocid={`trades.artisan.item.${i + 1}`}
                  >
                    <div className="bg-white rounded-2xl shadow-card hover:shadow-hero transition-all overflow-hidden">
                      <div className="relative">
                        <img
                          src={artisan.portfolioImages[0]}
                          alt={artisan.name}
                          className="w-full h-40 object-cover"
                        />
                        <Badge
                          className={`absolute top-2 right-2 text-xs ${
                            artisan.availability === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {artisan.availability === "available"
                            ? "Available"
                            : "Busy"}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={artisan.avatar}
                            alt={artisan.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {artisan.name}
                            </p>
                            <p className="text-xs text-primary">
                              {artisan.category}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {artisan.city}, {artisan.state}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span className="text-xs font-semibold">
                              {artisan.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({artisan.reviewCount})
                            </span>
                          </div>
                          <p className="text-sm font-bold text-primary">
                            ₦{artisan.hourlyRate.toLocaleString()}/
                            {artisan.rateUnit}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {artisan.skills.slice(0, 2).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Link to={`/artisan/${artisan.id}`}>
                          <Button
                            size="sm"
                            className="w-full bg-primary text-primary-foreground text-xs"
                            data-ocid={`trades.view-profile.button.${i + 1}`}
                          >
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
