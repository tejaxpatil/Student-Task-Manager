# STM-15 — Contact page layout and form UI design

Owner: Thalesh  
Preceding Task for: Harsh completing STM-16 (contact form submission & validation).  
Preparation for: Tejas executing STM-17 (contact form test plan).

---

## 1. Design Overview

The contact page transforms the previous placeholder into a full-featured, responsive contact workspace:

1. **Information Panel (Left Sidebar)**:
   * Professional blue card accent (`bg-blue-600 rounded-3xl p-8 sm:p-10 text-white`).
   * Campus support email: `support@studenttaskmanager.edu`.
   * Physical campus location: *Computer Science Building, Lab 4*.
   * Active support hours: *Mon – Fri: 9:00 AM – 5:00 PM*.
   * SPM Coursework contextual disclaimer.

2. **Contact Form UI (Right Panel)**:
   * Full Name input (`id="contact-name"`, `name="name"`).
   * Email Address input (`id="contact-email"`, `name="email"`).
   * Subject / Category selection (`id="contact-subject"`) with options:
     - General Inquiry
     - Feature Suggestion
     - Bug Report
     - Coursework Feedback
   * Message Textarea (`id="contact-message"`, `name="message"`, 4 rows).
   * Primary action submit button (*"Send message"*).

3. **Submission State**:
   * Interactive confirmation banner with alert styling (`bg-green-50 border-green-200 text-green-900`).
   * Displays dynamic recipient feedback (*"Your inquiry has been submitted. Our team will review it and reply to {email}"*).
   * "Send another message" reset action.

---

## 2. Responsiveness & Accessibility Specifications

* **Grid Breakpoint**: Stacks single-column on mobile (`< 1024px`) and expands to two-column split (`1fr : 1.3fr`) on desktop.
* **Touch Targets**: All interactive elements exceed 44px height.
* **Form Attributes**: Matched `htmlFor` and `id` pairs, accessible labels, clear placeholders, and visible focus rings (`focus:ring-4 focus:ring-blue-100`).

---

## 3. Integration Boundaries

* **STM-15 (Thalesh)**: Designed contact page layout, typography, visual hierarchy, form controls, and user feedback states.
* **STM-16 (Harsh)**: Implements production server/API validation and backend dispatch.
* **STM-17 (Tejas)**: Executes formal test plan `docs/STM-17-CONTACT-FORM-TEST-PLAN.md`.
