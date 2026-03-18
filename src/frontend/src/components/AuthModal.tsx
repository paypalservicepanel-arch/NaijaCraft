import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import type { UserRole } from "../types";

type Step = "login" | "register" | "role";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setCurrentUser } = useApp();
  const [step, setStep] = useState<Step>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin@naijcraft.ng") {
      setCurrentUser({
        id: "admin",
        name: "Platform Admin",
        email,
        role: "admin",
        avatar: "https://i.pravatar.cc/150?img=33",
      });
      closeAuthModal();
      return;
    }
    setStep("role");
  };

  const handleRegister = () => {
    setStep("role");
  };

  const handleRoleSelect = (role: UserRole) => {
    const artisanId = role === "artisan" ? "a1" : undefined;
    setCurrentUser({
      id: `user-${Date.now()}`,
      name: name || "Demo User",
      email: email || "demo@naijcraft.ng",
      role,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 30) + 1}`,
      artisanId,
    });
    closeAuthModal();
    setStep("login");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog
      open={isAuthModalOpen}
      onOpenChange={(open) => {
        if (!open) closeAuthModal();
      }}
    >
      <DialogContent className="sm:max-w-md" data-ocid="auth.modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === "login" && "Welcome back"}
            {step === "register" && "Create an account"}
            {step === "role" && "How will you use NaijaCraft?"}
          </DialogTitle>
        </DialogHeader>

        {step === "login" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="auth.email.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="auth.password.input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Use <strong>admin@naijcraft.ng</strong> to login as admin.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground"
              onClick={handleLogin}
              data-ocid="auth.login.submit_button"
            >
              Sign In
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => setStep("register")}
              >
                Register
              </button>
            </p>
          </div>
        )}

        {step === "register" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="reg-name">Full Name</Label>
              <Input
                id="reg-name"
                placeholder="e.g. Chukwuemeka Obi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-ocid="auth.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="auth.email.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-ocid="auth.password.input"
              />
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground"
              onClick={handleRegister}
              data-ocid="auth.register.submit_button"
            >
              Create Account
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => setStep("login")}
              >
                Sign In
              </button>
            </p>
          </div>
        )}

        {step === "role" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Select how you'd like to use the platform:
            </p>
            <button
              type="button"
              className="w-full p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-secondary transition-all text-left group"
              onClick={() => handleRoleSelect("customer")}
              data-ocid="auth.customer-role.button"
            >
              <p className="font-semibold group-hover:text-primary">
                I'm Looking to Hire
              </p>
              <p className="text-sm text-muted-foreground">
                Find and hire skilled artisans for your projects
              </p>
            </button>
            <button
              type="button"
              className="w-full p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-secondary transition-all text-left group"
              onClick={() => handleRoleSelect("artisan")}
              data-ocid="auth.artisan-role.button"
            >
              <p className="font-semibold group-hover:text-primary">
                I'm an Artisan / Skilled Worker
              </p>
              <p className="text-sm text-muted-foreground">
                Showcase your skills and get hired for jobs
              </p>
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
