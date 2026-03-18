import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "@/lib/router";
import { useNavigate } from "@/lib/router";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { HireModal } from "../components/HireModal";
import { useApp } from "../contexts/AppContext";
import { SAMPLE_ARTISANS, SAMPLE_REVIEWS } from "../data/sampleData";

function StarRating({
  rating,
  size = "sm",
}: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={`star-${i}`}
          className={`${cls} ${
            i <= Math.floor(rating)
              ? "fill-accent text-accent"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function ArtisanProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, openAuthModal, addConversation } = useApp();
  const [hireOpen, setHireOpen] = useState(false);

  const artisan = SAMPLE_ARTISANS.find((a) => a.id === id);
  const reviews = SAMPLE_REVIEWS.filter((r) => r.artisanId === id);

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Artisan not found.</p>
          <Link to="/find-trades">
            <Button>Browse Artisans</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleMessage = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    const convId = addConversation(artisan.id, artisan.name, artisan.avatar);
    navigate(`/messages?conv=${convId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <div className="flex gap-5 items-start">
                <Avatar className="w-24 h-24 border-4 border-secondary">
                  <AvatarImage src={artisan.avatar} />
                  <AvatarFallback>{artisan.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h1 className="text-2xl font-display font-bold">
                        {artisan.name}
                      </h1>
                      <p className="text-primary font-medium">
                        {artisan.category}
                      </p>
                    </div>
                    <Badge
                      className={`text-sm ${
                        artisan.availability === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {artisan.availability === "available"
                        ? "✓ Available"
                        : "⏳ Busy"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {artisan.city}, {artisan.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <strong className="text-foreground">
                        {artisan.rating}
                      </strong>{" "}
                      ({artisan.reviewCount} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {artisan.completedJobs} jobs done
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Joined {new Date(artisan.joinDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {artisan.bio}
              </p>
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {artisan.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h2 className="text-lg font-bold mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artisan.portfolioImages.map((img, _idx) => (
                  <div
                    key={img}
                    className="aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={img}
                      alt="Portfolio work"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h2 className="text-lg font-bold mb-4">
                Reviews ({reviews.length || artisan.reviewCount})
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div
                      key={review.id}
                      className="border-b border-border pb-4 last:border-0"
                      data-ocid={`profile.review.item.${i + 1}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={review.customerAvatar} />
                          <AvatarFallback>
                            {review.customerName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">
                              {review.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-xs text-primary mb-1">
                            {review.jobTitle}
                          </p>
                          <StarRating rating={review.rating} />
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="profile.reviews.empty_state"
                >
                  <Star className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                  No reviews yet. Be the first to leave a review!
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-card p-6 sticky top-20"
            >
              <div className="text-center mb-5">
                <p className="text-3xl font-bold text-primary">
                  ₦{artisan.hourlyRate.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  per {artisan.rateUnit}
                </p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={artisan.rating} />
                    <span className="font-semibold ml-1">{artisan.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jobs Completed</span>
                  <span className="font-semibold">{artisan.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Rate</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`font-semibold ${
                      artisan.availability === "available"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {artisan.availability === "available"
                      ? "Available"
                      : "Busy"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => setHireOpen(true)}
                  data-ocid="profile.hire.button"
                >
                  <Briefcase className="w-4 h-4 mr-2" /> Hire This Artisan
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={handleMessage}
                  data-ocid="profile.message.button"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </div>

              <div className="mt-5 pt-5 border-t border-border space-y-2">
                {[
                  "Verified Identity",
                  "Background Checked",
                  "Insured Work",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <HireModal
        artisan={artisan}
        open={hireOpen}
        onClose={() => setHireOpen(false)}
      />
    </div>
  );
}
