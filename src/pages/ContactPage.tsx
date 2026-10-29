import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // STM-15: UI design. Harsh owns full backend validation and submission handling in STM-16.
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        {/* Left Side: Contact Information & Help */}
        <div className="rounded-3xl bg-blue-600 p-8 text-white sm:p-10">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
            Get in touch
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            We'd love to hear from you.
          </h1>
          <p className="mt-4 text-sm leading-6 text-blue-100 sm:text-base">
            Have questions about Student Task Manager, ideas for new features, or need support with your academic workflow?
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lg">
                ✉
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Email Us</p>
                <p className="mt-0.5 text-sm font-medium">support@studentaskmanager.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lg">
                📍
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Campus Office</p>
                <p className="mt-0.5 text-sm font-medium">Faculty Of Engineeirng(FET), 324 Lab</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lg">
                ⏰
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Support Hours</p>
                <p className="mt-0.5 text-sm font-medium">Mon – Fri: 9:00 AM – 3:45 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-white/10 p-5 text-xs text-blue-100">
            <p className="font-semibold text-white">Student Project Notice</p>
            <p className="mt-1 leading-5">
              Built for Software Project Management coursework. Contact requests are processed for academic evaluation.
            </p>
          </div>
        </div>

        {/* Right Side: Contact Form UI */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {/* STM-15: Contact form UI design by Thalesh. Form validation & backend handling by Harsh in STM-16. */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Send a message</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Leave us a note
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill out the form below and we will get back to your student email.
            </p>
          </div>

          {submitted ? (
            <div role="status" className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-600 text-sm font-bold text-white">
                  ✓
                </span>
                <div>
                  <h3 className="font-bold">Thank you for your message!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Your inquiry has been submitted. Our team will review it and reply to{" "}
                    <span className="font-semibold text-green-900">{formData.email || "your email"}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
                    }}
                    className="mt-4 rounded-xl bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@student.edu"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Subject Category */}
              <div>
                <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-slate-700">
                  Subject / Topic
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Coursework Feedback">Coursework Feedback</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you with your tasks or semester plans?"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Send message
              </button>

              <p className="text-center text-xs text-slate-500">
                Validation & backend processing integration owned by Harsh (STM-16); tested by Tejas (STM-17).
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
