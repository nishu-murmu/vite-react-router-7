import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Mail, Phone, Send } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const ContactUsPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Us
              </CardTitle>
              <CardDescription>
                <a
                  href="mailto:support@booksville.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@booksville.com
                </a>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Us
              </CardTitle>
              <CardDescription>
                <a
                  href="tel:+1234567890"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  +1 (234) 567-890
                </a>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Send us a message and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUsPage;
