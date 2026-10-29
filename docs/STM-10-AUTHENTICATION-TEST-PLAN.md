# STM-10 — Authentication and validation test plan

Owner: Thalesh  
Dependency: Tejas completed STM-9 (login form UI).  
Integration: Seamlessly authenticates users registered in STM-7, protects dashboard routes, and manages active session.

## Test cases

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| LF-01 | Submit with empty fields | Required-field errors appear for Email and Password; submission blocked | Pass |
| LF-02 | Submit whitespace-only values | Values are trimmed and rejected as empty fields | Pass |
| LF-03 | Enter invalid email format (`notanemail`, `user@`) | "Please enter a valid email address" error appears; submission blocked | Pass |
| LF-04 | Attempt login with unregistered email | Displays clear alert ("No account found with this email address") | Pass |
| LF-05 | Enter correct email but incorrect password | Displays clear alert ("Incorrect password. Please verify your password and try again") | Pass |
| LF-06 | Log in with credentials registered in STM-7 | Authentication succeeds, success banner displays, session saved, redirects to dashboard | Pass |
| LF-07 | 1-Click "Fill Demo" credentials login | Auto-populates `student@example.com` / `student123` and logs in successfully | Pass |
| LF-08 | Toggle password visibility control | Switches between masked bullets (`type="password"`) and plain text (`type="text"`) | Pass |
| LF-09 | Unauthorized access to `/dashboard` | Protected route guard intercepts unauthenticated visit and redirects to `/login` | Pass |
| LF-10 | Header navigation session awareness | Header displays student name, "Dashboard" link, and "Log out" button when authenticated | Pass |
| LF-11 | User Log out action | Clears active session from `localStorage`, redirects to login, restores logged-out navigation | Pass |
| LF-12 | Keyboard navigation & accessibility | Fields, toggles, and buttons are tab-accessible with ARIA invalid and alert attributes | Pass |

## Execution summary
- **Tested environment**: React 19 + TypeScript + Vite + Tailwind CSS
- **Validation logic**: RFC email regex, password minimum length, credential matching against `stm_registered_users`
- **Session management**: `localStorage` (`stm_current_user` and `stm_auth_changed` custom event dispatch)
- **Status**: Verified and ready for merge into `main`.
