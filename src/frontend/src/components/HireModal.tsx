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
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import type { Artisan } from "../types";
import type { JobRequest } from "../types";

interface HireModalProps {
  artisan: Artisan;
  open: boolean;
  onClose: () => void;
}

export function HireModal({ artisan, open, onClose }: HireModalProps) {
  const { currentUser, openAuthModal, setJobRequests } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!currentUser) {
      onClose();
      openAuthModal();
      return;
    }
    if (!title || !description || !budget || !date) {
      toast.error("Please fill in all fields");
      return;
    }
    const newJob: JobRequest = {
      id: `j-${Date.now()}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      artisanId: artisan.id,
      artisanName: artisan.name,
      title,
      description,
      budget: Number(budget),
      proposedDate: date,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setJobRequests((prev) => [...prev, newJob]);
    toast.success("Job request sent successfully!");
    onClose();
    setTitle("");
    setDescription("");
    setBudget("");
    setDate("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg" data-ocid="hire.modal">
        <DialogHeader>
          <DialogTitle>Hire {artisan.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="job-title">Job Title</Label>
            <Input
              id="job-title"
              placeholder="e.g. Rewire 3-bedroom flat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="hire.title.input"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="job-desc">Description</Label>
            <Textarea
              id="job-desc"
              placeholder="Describe the work needed in detail..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="hire.description.textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="job-budget">Budget (₦)</Label>
              <Input
                id="job-budget"
                type="number"
                placeholder="e.g. 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                data-ocid="hire.budget.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="job-date">Proposed Start Date</Label>
              <Input
                id="job-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="hire.date.input"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="hire.cancel.button"
          >
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground"
            onClick={handleSubmit}
            data-ocid="hire.submit.button"
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
