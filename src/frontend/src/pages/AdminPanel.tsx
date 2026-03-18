import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "@/lib/router";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Percent,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { SAMPLE_TRANSACTIONS, SAMPLE_USERS } from "../data/sampleData";
import type { User } from "../types";

type Tab = "overview" | "users" | "transactions" | "commission" | "stripe";

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ElementType }[] = [
  { tab: "overview", label: "Overview", icon: LayoutDashboard },
  { tab: "users", label: "Users", icon: Users },
  { tab: "transactions", label: "Transactions", icon: CreditCard },
  { tab: "commission", label: "Commission Settings", icon: Percent },
  { tab: "stripe", label: "Platform Settings", icon: Settings },
];

export function AdminPanel() {
  const { logout, commissionRate, setCommissionRate } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [stripeKey, setStripeKey] = useState("");
  const [pendingRate, setPendingRate] = useState(commissionRate);

  const totalTransactions = SAMPLE_TRANSACTIONS.length;
  const platformEarnings = SAMPLE_TRANSACTIONS.reduce(
    (s, t) => s + t.commission,
    0,
  );
  const totalArtisans = users.filter((u) => u.role === "artisan").length;
  const totalUsers = users.length;

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );
    toast.success("User status updated.");
  };

  const saveCommission = () => {
    setCommissionRate(pendingRate);
    toast.success(`Commission rate set to ${pendingRate}%`);
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
          <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Admin Panel
          </p>
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
              data-ocid={`admin-nav.${tab}.tab`}
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
            data-ocid="admin-nav.logout.button"
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
              ? "Platform Overview"
              : activeTab.replace("-", " ")}
          </h1>
          <Badge className="ml-2 bg-primary/10 text-primary text-xs">
            Admin
          </Badge>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Users",
                    value: totalUsers,
                    icon: Users,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    label: "Total Artisans",
                    value: totalArtisans,
                    icon: ShieldCheck,
                    color: "text-primary bg-secondary",
                  },
                  {
                    label: "Transactions",
                    value: totalTransactions,
                    icon: CreditCard,
                    color: "text-purple-600 bg-purple-50",
                  },
                  {
                    label: "Platform Earnings",
                    value: `₦${platformEarnings.toLocaleString()}`,
                    icon: TrendingUp,
                    color: "text-green-600 bg-green-50",
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

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-bold mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {SAMPLE_TRANSACTIONS.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium">{t.jobTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            ₦{t.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600">
                            +₦{t.commission.toLocaleString()} comm.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-bold mb-2">Commission Rate</h3>
                  <p className="text-5xl font-display font-bold text-primary mb-1">
                    {commissionRate}%
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Applied to every transaction
                  </p>
                  <div className="p-3 bg-secondary rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Change in Commission Settings tab
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, i) => (
                      <TableRow
                        key={user.id}
                        data-ocid={`admin.user.item.${i + 1}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.joinDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs ${
                              user.status === "active"
                                ? "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                            }`}
                            onClick={() => toggleUserStatus(user.id)}
                            data-ocid={`admin.toggle-user.button.${i + 1}`}
                          >
                            {user.status === "active" ? (
                              <>
                                <XCircle className="w-3 h-3 mr-1" /> Suspend
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                Activate
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {activeTab === "transactions" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Artisan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_TRANSACTIONS.map((t, i) => (
                      <TableRow
                        key={t.id}
                        data-ocid={`admin.transaction.item.${i + 1}`}
                      >
                        <TableCell className="text-sm font-medium">
                          {t.jobTitle}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {t.customerName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {t.artisanName}
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          ₦{t.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-green-600 font-medium">
                          ₦{t.commission.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {t.date}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              t.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {activeTab === "commission" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card p-6 max-w-lg">
                <h3 className="font-bold text-lg mb-2">
                  Commission Rate Settings
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  The platform charges this percentage on every transaction as a
                  service fee.
                </p>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-base font-semibold">
                      Current Rate
                    </Label>
                    <span className="text-3xl font-bold text-primary">
                      {pendingRate}%
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={30}
                    step={0.5}
                    value={[pendingRate]}
                    onValueChange={([v]) => setPendingRate(v)}
                    className="py-2"
                    data-ocid="admin.commission.slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                </div>
                <div className="p-4 bg-secondary rounded-xl mb-6">
                  <p className="text-sm">
                    On a <strong>₦100,000</strong> transaction, the platform
                    earns{" "}
                    <strong className="text-primary">
                      ₦{((100000 * pendingRate) / 100).toLocaleString()}
                    </strong>{" "}
                    and the artisan receives{" "}
                    <strong>
                      ₦{(100000 * (1 - pendingRate / 100)).toLocaleString()}
                    </strong>
                    .
                  </p>
                </div>
                <Button
                  className="bg-primary text-primary-foreground"
                  onClick={saveCommission}
                  data-ocid="admin.commission.save.button"
                >
                  Save Commission Rate
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "stripe" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl shadow-card p-6 max-w-lg">
                <h3 className="font-bold text-lg mb-2">
                  Stripe Payment Configuration
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Configure your Stripe API keys to enable payment processing on
                  the platform.
                </p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label>Stripe Secret Key</Label>
                    <Input
                      type="password"
                      placeholder="sk_live_..."
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      data-ocid="admin.stripe-key.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Allowed Countries</Label>
                    <Input
                      defaultValue="NG"
                      placeholder="e.g. NG, GH, KE"
                      data-ocid="admin.stripe-countries.input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated ISO country codes.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      Stripe secret keys are sensitive. Never share them
                      publicly or commit to source control.
                    </p>
                  </div>
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={() => toast.success("Stripe configuration saved!")}
                    data-ocid="admin.stripe.save.button"
                  >
                    Save Configuration
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
