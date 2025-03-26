import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon } from "lucide-react";

interface HelpContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpContactModal = ({ open, onOpenChange }: HelpContactModalProps) => {
  // Form state
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Just clear the form fields - no actual submission
    setEmail("");
    setSubject("");
    setMessage("");
    setSubmitSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };

  // Reset form when modal is opened
  React.useEffect(() => {
    if (open) {
      setEmail("");
      setSubject("");
      setMessage("");
      setSub(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-base-100 text-base-content max-w-md border border-base-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-base-content">
            <MailIcon className="h-5 w-5 text-primary" />
            Contact Us
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base-content">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-base-200 border-base-300 text-base-content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-base-content">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="How can we help you?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-base-200 border-base-300 text-base-content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-base-content">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Please describe your issue or question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full min-h-[120px] bg-base-200 border-base-300 text-base-content"
            />
          </div>

          {submitSuccess && (
            <div className="bg-success/10 text-success p-3 rounded-md text-sm">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-base-300 hover:bg-base-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white dark:text-black hover:bg-primary/90"
            >
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HelpContactModal;
