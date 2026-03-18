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
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@/lib/router";
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import {
  NIGERIAN_STATES,
  SAMPLE_ARTISANS,
  SAMPLE_JOB_LISTINGS,
  SAMPLE_TRANSACTIONS,
} from "../data/sampleData";
import type { JobListing } from "../types";

type Tab =
  | "overview"
  | "jobs"
  | "listings"
  | "earnings"
  | "messages"
  | "settings";

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ElementType }[] = [
  { tab: "overview", label: "Overview", icon: LayoutDashboard },
  { tab: "jobs", label: "My Jobs", icon: Briefcase },
  { tab: "listings", label: "Job Listings", icon: List },
  { tab: "earnings", label: "Earnings", icon: DollarSign },
  { tab: "messages", label: "Messages", icon: MessageSquare },
  { tab: "settings", label: "Profile Settings", icon: Settings },
];

export function ArtisanDashboard() {
  const { currentUser, logout, jobRequests, setJobRequests } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState<JobListing[]>(SAMPLE_JOB_LISTINGS);
  const [showAddListing, setShowAddListing] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
  });

  const artisan =
    SAMPLE_ARTISANS.find((a) => a.id === currentUser?.artisanId) ||
    SAMPLE_ARTISANS[0];
  const myJobs = jobRequests.filter((j) => j.artisanId === artisan.id);
  const myTransactions = SAMPLE_TRANSACTIONS.filter(
    (t) => t.artisanId === artisan.id,
  );
  const totalEarnings = myTransactions.reduce((sum, t) => sum + t.payout, 0);
  const pendingJobs = myJobs.filter((j) => j.status === "pending").length;
  const activeJobs = myJobs.filter((j) => j.status === "accepted").length;

  const handleJobAction = (jobId: string, action: "accepted" | "declined") => {
    setJobRequests((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: action } : j)),
    );
    toast.success(
      action === "accepted" ? "Job request accepted!" : "Job request declined.",
    );
  };

  const handleAddListing = () => {
    if (!newListing.title || !newListing.budget) {
      toast.error("Fill in required fields");
      return;
    }
    const listing: JobListing = {
      id: `jl-${Date.now()}`,
      artisanId: artisan.id,
      artisanName: artisan.name,
      title: newListing.title,
      description: newListing.description,
      skillsRequired: [],
      budget: Number(newListing.budget),
      location: newListing.location,
      postedAt: new Date().toISOString().split("T")[0],
      status: "open",
    };
    setListings((prev) => [listing, ...prev]);
    setShowAddListing(false);
    setNewListing({ title: "", description: "", budget: "", location: "" });
    toast.success("Job listing posted!");
  };

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
          <p className="text-xs text-white/50 mt-1">Artisan Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
              data-ocid={`artisan-nav.${tab}.tab`}
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
            data-ocid="artisan-nav.logout.button"
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

      {/* Main */}
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
          <div className="ml-auto flex items-center gap-2">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium hidden sm:block">
              {artisan.name}
            </span>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Earnings",
                    value: `₦${totalEarnings.toLocaleString()}`,
                    icon: TrendingUp,
                    color: "text-green-600 bg-green-50",
                  },
                  {
                    label: "Active Jobs",
                    value: activeJobs,
                    icon: Briefcase,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    label: "Pending Requests",
                    value: pendingJobs,
                    icon: Clock,
                    color: "text-yellow-600 bg-yellow-50",
                  },
                  {
                    label: "Rating",
                    value: artisan.rating,
                    icon: Star,
                    color: "text-accent bg-yellow-50",
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
                <h3 className="font-bold mb-4">Recent Job Requests</h3>
                {myJobs.slice(0, 3).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No job requests yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myJobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-3 bg-background rounded-xl"
                      >
                        <div>
                          <p className="text-sm font-semibold">{job.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.customerName} &bull; ₦
                            {job.budget.toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusBadge(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "jobs" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {myJobs.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="artisan.jobs.empty_state"
                >
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>
                    No job requests yet. Keep your profile updated to attract
                    clients!
                  </p>
                </div>
              ) : (
                myJobs.map((job, i) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl shadow-card p-5"
                    data-ocid={`artisan.jobs.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          From: {job.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span>
                            Budget:{" "}
                            <strong className="text-foreground">
                              ₦{job.budget.toLocaleString()}
                            </strong>
                          </span>
                          <span>Date: {job.proposedDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusBadge(job.status)}>
                          {job.status}
                        </Badge>
                        {job.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground text-xs"
                              onClick={() =>
                                handleJobAction(job.id, "accepted")
                              }
                              data-ocid={`artisan.accept.button.${i + 1}`}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() =>
                                handleJobAction(job.id, "declined")
                              }
                              data-ocid={`artisan.decline.button.${i + 1}`}
                            >
                              <X className="w-3 h-3 mr-1" /> Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "listings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-end mb-4">
                <Button
                  className="bg-primary text-primary-foreground gap-2"
                  onClick={() => setShowAddListing(true)}
                  data-ocid="artisan.add-listing.button"
                >
                  <Plus className="w-4 h-4" /> Post New Listing
                </Button>
              </div>

              {showAddListing && (
                <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                  <h3 className="font-bold mb-4">New Job Listing</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Job Title *</Label>
                      <Input
                        placeholder="e.g. Electrical Assistant Needed"
                        value={newListing.title}
                        onChange={(e) =>
                          setNewListing((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        data-ocid="listing.title.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Budget (₦) *</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 80000"
                        value={newListing.budget}
                        onChange={(e) =>
                          setNewListing((p) => ({
                            ...p,
                            budget: e.target.value,
                          }))
                        }
                        data-ocid="listing.budget.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Location</Label>
                      <Input
                        placeholder="e.g. Lagos Island"
                        value={newListing.location}
                        onChange={(e) =>
                          setNewListing((p) => ({
                            ...p,
                            location: e.target.value,
                          }))
                        }
                        data-ocid="listing.location.input"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the role..."
                        value={newListing.description}
                        onChange={(e) =>
                          setNewListing((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        data-ocid="listing.description.textarea"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={handleAddListing}
                      data-ocid="listing.submit.button"
                    >
                      Post Listing
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddListing(false)}
                      data-ocid="listing.cancel.button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {listings
                  .filter((l) => l.artisanId === artisan.id)
                  .map((listing, i) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-2xl shadow-card p-5"
                      data-ocid={`artisan.listing.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{listing.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {listing.description}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            <span>₦{listing.budget.toLocaleString()}</span>
                            <span>{listing.location}</span>
                            <span>{listing.postedAt}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            listing.status === "open"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "Total Earned",
                    value: `₦${totalEarnings.toLocaleString()}`,
                  },
                  {
                    label: "Platform Commission",
                    value: `₦${myTransactions.reduce((s, t) => s + t.commission, 0).toLocaleString()}`,
                  },
                  { label: "Transactions", value: myTransactions.length },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-5 shadow-card"
                  >
                    <p className="text-xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold">Transaction History</h3>
                </div>
                <div className="divide-y divide-border">
                  {myTransactions.map((t, i) => (
                    <div
                      key={t.id}
                      className="p-4 flex items-center justify-between"
                      data-ocid={`artisan.transaction.item.${i + 1}`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{t.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.date} &bull; From: {t.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">
                          ₦{t.payout.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          -₦{t.commission.toLocaleString()} commission
                        </p>
                      </div>
                    </div>
                  ))}
                  {myTransactions.length === 0 && (
                    <p className="p-6 text-center text-sm text-muted-foreground">
                      No transactions yet.
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
                  View all your conversations in the Messages section.
                </p>
                <Link to="/messages">
                  <Button
                    className="bg-primary text-primary-foreground"
                    data-ocid="artisan.goto-messages.button"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Open Messages
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card p-6 max-w-xl">
                <h3 className="font-bold mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Full Name</Label>
                      <Input
                        defaultValue={artisan.name}
                        data-ocid="settings.name.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Category</Label>
                      <Input
                        defaultValue={artisan.category}
                        data-ocid="settings.category.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>City</Label>
                      <Input
                        defaultValue={artisan.city}
                        data-ocid="settings.city.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>State</Label>
                      <Select defaultValue={artisan.state}>
                        <SelectTrigger data-ocid="settings.state.select">
                          <SelectValue />
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
                    <div className="space-y-1">
                      <Label>Hourly Rate (₦)</Label>
                      <Input
                        type="number"
                        defaultValue={artisan.hourlyRate}
                        data-ocid="settings.rate.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Availability</Label>
                      <Select defaultValue={artisan.availability}>
                        <SelectTrigger data-ocid="settings.availability.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="away">Away</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Bio</Label>
                    <Textarea
                      defaultValue={artisan.bio}
                      rows={4}
                      data-ocid="settings.bio.textarea"
                    />
                  </div>
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={() => toast.success("Profile updated!")}
                    data-ocid="settings.save.button"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
