import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@/lib/router";
import {
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Send,
  Settings,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { SAMPLE_TRANSACTIONS } from "../data/sampleData";
import type { JobRequest, Review } from "../types";

type Tab = "overview" | "requests" | "payments" | "messages" | "settings";

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ElementType }[] = [
  { tab: "overview", label: "Overview", icon: LayoutDashboard },
  { tab: "requests", label: "My Requests", icon: FileText },
  { tab: "payments", label: "Payments", icon: CreditCard },
  { tab: "messages", label: "Messages", icon: MessageSquare },
  { tab: "settings", label: "Settings", icon: Settings },
];

export function CustomerDashboard() {
  const { currentUser, logout, jobRequests, setJobRequests } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviewJob, setReviewJob] = useState<JobRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const userId = currentUser?.id || "c1";
  const myRequests = jobRequests.filter((j) => j.customerId === userId);
  const myPayments = SAMPLE_TRANSACTIONS.filter((t) => t.customerId === userId);
  const totalSpent = myPayments.reduce((s, t) => s + t.amount, 0);
  const active = myRequests.filter((j) =>
    ["pending", "accepted"].includes(j.status),
  ).length;
  const completed = myRequests.filter(
    (j) => j.status === "completed" || j.status === "paid",
  ).length;

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      paid: "bg-purple-100 text-purple-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const submitReview = () => {
    if (!reviewText) {
      toast.error("Please write a review");
      return;
    }
    if (!reviewJob) return;
    setJobRequests((prev) =>
      prev.map((j) => (j.id === reviewJob.id ? { ...j, reviewLeft: true } : j)),
    );
    toast.success("Review submitted! Thank you.");
    setReviewJob(null);
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-footer flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-accent">Naija</span>
            <span className="text-xl font-bold text-white">Craft</span>
          </Link>
          <p className="text-xs text-white/50 mt-1">Customer Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
            <button
              type="button"
              key={tab}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }}
              data-ocid={`customer-nav.${tab}.tab`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white"
            onClick={() => {
              logout();
              navigate("/");
            }}
            data-ocid="customer-nav.logout.button"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-base capitalize">
            {activeTab === "overview"
              ? "Dashboard"
              : activeTab.replace("-", " ")}
          </h1>
          <div className="ml-auto">
            <span className="text-sm text-muted-foreground">
              {currentUser?.name}
            </span>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    label: "Active Requests",
                    value: active,
                    icon: Clock,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    label: "Completed Jobs",
                    value: completed,
                    icon: CheckCircle,
                    color: "text-green-600 bg-green-50",
                  },
                  {
                    label: "Total Spent",
                    value: `₦${totalSpent.toLocaleString()}`,
                    icon: CreditCard,
                    color: "text-purple-600 bg-purple-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl p-5 shadow-card"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-bold mb-4">Recent Requests</h3>
                {myRequests.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-background rounded-xl mb-2"
                  >
                    <div>
                      <p className="text-sm font-semibold">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        To: {job.artisanName}
                      </p>
                    </div>
                    <Badge className={getStatusBadge(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                ))}
                {myRequests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No requests yet.{" "}
                    <Link
                      to="/find-trades"
                      className="text-primary hover:underline"
                    >
                      Find an artisan
                    </Link>
                    .
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {myRequests.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="customer.requests.empty_state"
                >
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You haven't sent any job requests yet.</p>
                  <Link to="/find-trades">
                    <Button className="mt-3 bg-primary text-primary-foreground">
                      Find an Artisan
                    </Button>
                  </Link>
                </div>
              ) : (
                myRequests.map((job, i) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl shadow-card p-5"
                    data-ocid={`customer.request.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Artisan: {job.artisanName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {job.description.slice(0, 100)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Budget: ₦{job.budget.toLocaleString()} &bull; Date:{" "}
                          {job.proposedDate}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusBadge(job.status)}>
                          {job.status}
                        </Badge>
                        {(job.status === "completed" ||
                          job.status === "paid") &&
                          !job.reviewLeft && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-accent text-accent hover:bg-accent hover:text-foreground"
                              onClick={() => setReviewJob(job)}
                              data-ocid={`customer.leave-review.button.${i + 1}`}
                            >
                              <Star className="w-3 h-3 mr-1" /> Leave Review
                            </Button>
                          )}
                        {job.reviewLeft && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Review submitted
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-bold">Payment History</h3>
                </div>
                <div className="divide-y divide-border">
                  {myPayments.map((t, i) => (
                    <div
                      key={t.id}
                      className="p-4 flex items-center justify-between"
                      data-ocid={`customer.payment.item.${i + 1}`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{t.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.date} &bull; To: {t.artisanName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          ₦{t.amount.toLocaleString()}
                        </p>
                        <Badge
                          className={
                            t.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {myPayments.length === 0 && (
                    <p className="p-6 text-center text-sm text-muted-foreground">
                      No payments yet.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  All your conversations with artisans are in Messages.
                </p>
                <Link to="/messages">
                  <Button
                    className="bg-primary text-primary-foreground"
                    data-ocid="customer.goto-messages.button"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Open Messages
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card p-6 max-w-lg">
                <h3 className="font-bold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input
                      defaultValue={currentUser?.name}
                      data-ocid="customer-settings.name.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      defaultValue={currentUser?.email}
                      data-ocid="customer-settings.email.input"
                    />
                  </div>
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={() => toast.success("Settings saved!")}
                    data-ocid="customer-settings.save.button"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog
        open={!!reviewJob}
        onOpenChange={(o) => {
          if (!o) setReviewJob(null);
        }}
      >
        <DialogContent data-ocid="review.modal">
          <DialogHeader>
            <DialogTitle>
              Leave a Review for {reviewJob?.artisanName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-2 block">Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    data-ocid={`review.star.${star}`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= reviewRating
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Your Review</Label>
              <Textarea
                placeholder="Share your experience..."
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                data-ocid="review.text.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewJob(null)}
              data-ocid="review.cancel.button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={submitReview}
              data-ocid="review.submit.button"
            >
              <Send className="w-4 h-4 mr-2" /> Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
