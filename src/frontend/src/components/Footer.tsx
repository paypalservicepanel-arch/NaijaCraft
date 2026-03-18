import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router";
import { Facebook, Instagram, Send, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-footer text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-accent">Naija</span>
              <span className="text-2xl font-bold text-white">Craft</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-xs">
              Nigeria's trusted marketplace connecting skilled artisans with
              customers across all 36 states. Quality work, guaranteed.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <button
                  type="button"
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">About</h4>
            <ul className="space-y-2">
              {["About Us", "How It Works", "Blog", "Press", "Careers"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-sm text-white/70 hover:text-accent transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                "Find Artisans",
                "Post a Project",
                "Categories",
                "Pricing",
                "Gift Cards",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/find-trades"
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-white/70 mb-3">
              Get the latest artisan updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm h-9"
                data-ocid="footer.newsletter.input"
              />
              <Button
                size="sm"
                className="bg-accent text-foreground hover:bg-accent/90 h-9 px-3 shrink-0"
                data-ocid="footer.newsletter.button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 text-sm text-white/50">
            <Link to="/" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-white/80">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-white/80">
              Support
            </Link>
          </div>
          <p className="text-sm text-white/50">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              className="text-accent hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
