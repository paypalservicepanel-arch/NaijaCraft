import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "@/lib/router";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  MapPin,
  Quote,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CategoryIcon } from "../components/CategoryIcons";
import {
  CATEGORIES,
  NIGERIAN_STATES,
  SAMPLE_ARTISANS,
} from "../data/sampleData";

const TESTIMONIALS = [
  {
    name: "Oluwafemi Alabi",
    location: "Lagos",
    avatar: "https://i.pravatar.cc/150?img=30",
    comment:
      "Found a brilliant tailor through NaijaCraft in less than 10 minutes. She made my aso-ebi for my sister's wedding and it was perfect. Delivery was on time and the quality was top notch.",
    rating: 5,
  },
  {
    name: "Ngozi Umeh",
    location: "Enugu",
    avatar: "https://i.pravatar.cc/150?img=26",
    comment:
      "As a caterer, NaijaCraft has transformed my business. I get steady clients every week. The platform is easy to use and payment is always secure.",
    rating: 5,
  },
  {
    name: "Babatunde Olusanya",
    location: "Ibadan",
    avatar: "https://i.pravatar.cc/150?img=32",
    comment:
      "Hired a plumber to fix a burst pipe emergency at 9pm. NaijaCraft connected me within 20 minutes. Professional, fast, and fairly priced.",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search & Discover",
    description:
      "Browse thousands of verified artisans by trade, location, and ratings. Find exactly who you need.",
    icon: Search,
  },
  {
    step: "02",
    title: "Connect & Hire",
    description:
      "Send a job request, chat directly with the artisan, and agree on terms before work begins.",
    icon: Users,
  },
  {
    step: "03",
    title: "Pay & Review",
    description:
      "Pay securely through our platform. Once done, leave a review to help others make great choices.",
    icon: CheckCircle,
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchState) params.set("state", searchState);
    navigate(`/find-trades?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* warm background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.96_0.03_162)] via-white to-[oklch(0.91_0.04_75/0.3)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[580px] py-16">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <Badge className="bg-secondary text-primary border-primary/20 w-fit text-xs font-semibold">
                ✦ Nigeria's #1 Artisan Marketplace
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Discover
                <span className="text-primary"> Top-Rated</span>
                <br />
                Nigerian Artisans
                <br />
                &amp; Skilled Trades
              </h1>
              <p className="text-base text-muted-foreground max-w-md leading-relaxed">
                Connect with verified, trusted artisans and skilled
                professionals across all 36 states of Nigeria. Quality work,
                secure payments, guaranteed results.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-hero border-2 border-accent/30 p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    data-ocid="hero.search.input"
                  />
                </div>
                <div className="w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 px-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Select onValueChange={setSearchState}>
                    <SelectTrigger
                      className="border-0 bg-transparent shadow-none h-9 text-sm p-0 w-36 focus:ring-0"
                      data-ocid="hero.state.select"
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-primary text-primary-foreground rounded-xl px-6 shrink-0"
                  onClick={handleSearch}
                  data-ocid="hero.search.button"
                >
                  Find Now
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {[
                  { value: "10,000+", label: "Verified Artisans" },
                  { value: "50,000+", label: "Jobs Completed" },
                  { value: "36", label: "States Covered" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right – Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-hero">
                <img
                  src="/assets/generated/hero-artisan.dim_800x600.jpg"
                  alt="Nigerian artisan at work"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.07_162/0.3)] to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This week</p>
                  <p className="text-sm font-bold">1,200+ jobs posted</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xs font-semibold">4.9 avg. rating</p>
                <p className="text-xs text-muted-foreground">
                  from 12k reviews
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold mb-3">
              Popular Trade Categories
            </h2>
            <p className="text-muted-foreground">
              Find skilled professionals across all major trades in Nigeria
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/find-trades?category=${cat.id}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary border border-border hover:border-primary hover:shadow-card transition-all group"
                  data-ocid={`category.${cat.id}.link`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs group-hover:bg-primary/10 transition-colors">
                    <CategoryIcon
                      name={cat.icon}
                      className="w-6 h-6 text-primary"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {cat.name}
                    </p>
                    <p className="text-xs text-primary mt-0.5">
                      {cat.count} artisans
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold mb-3">
              Featured Artisans
            </h2>
            <p className="text-muted-foreground">
              Top-rated professionals ready to help with your next project
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_ARTISANS.slice(0, 3).map((artisan, index) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/artisan/${artisan.id}`}
                  className="block bg-white rounded-2xl shadow-card hover:shadow-hero transition-all overflow-hidden group"
                  data-ocid={`featured.artisan.item.${index + 1}`}
                >
                  <div className="relative">
                    <img
                      src={artisan.portfolioImages[0]}
                      alt={artisan.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold flex items-center justify-center shadow">
                      {index + 1}
                    </span>
                    <Badge
                      className={`absolute top-3 right-3 text-xs font-medium ${
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
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {artisan.name}
                        </p>
                        <p className="text-sm text-primary font-medium">
                          {artisan.category}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {artisan.city}, {artisan.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-semibold">
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
                    <Button
                      className="w-full mt-4 bg-primary text-primary-foreground text-sm"
                      size="sm"
                    >
                      Hire Now
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/find-trades">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
              >
                View All Artisans <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Getting quality work done has never been simpler
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold mb-3">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground">
              Trusted by thousands of Nigerians nationwide
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  "{t.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.location}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].slice(0, t.rating).map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-accent text-accent"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 mb-8">
              Join over 10,000 artisans and 50,000 customers already using
              NaijaCraft
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-trades">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                  data-ocid="cta.find-artisan.button"
                >
                  Find an Artisan
                </Button>
              </Link>
              <Link to="/find-trades">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8"
                  data-ocid="cta.post-job.button"
                >
                  Post Your Skills
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
