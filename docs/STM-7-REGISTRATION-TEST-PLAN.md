# STM-7 — Registration and input validation test plan

Owner: Thalesh  
Dependency: Tejas completed STM-6 (registration form UI).  
Integration: Prepares data and redirect flow for STM-10 (authentication).

## Test cases

| ID | Scenario | Expected result | Result |
|---|---|---|---|
| RF-01 | Submit with every field empty | Required-field errors appear for Name, Email, Password, and Confirm Password; submission blocked | Pass |
| RF-02 | Enter whitespace-only values | Values are trimmed and rejected as empty fields | Pass |
| RF-03 | Enter single-character name | "Full name must be at least 2 characters" error appears | Pass |
| RF-04 | Enter invalid email formats (`user`, `user@`, `user@domain`) | "Please enter a valid email address" error appears; submission blocked | Pass |
| RF-05 | Enter short password (< 6 characters) | "Password must be at least 6 characters long" error appears; submission blocked | Pass |
| RF-06 | Enter mismatched confirmation password | "Passwords do not match" error appears; submission blocked | Pass |
| RF-07 | Correct invalid input after error | Error message clears when valid input is typed | Pass |
| RF-08 | Toggle password visibility controls | Password / confirm password toggles between masked and visible text | Pass |
| RF-09 | Submit valid registration credentials | User is persisted to localStorage, success notification shows, redirects to `/login` | Pass |
| RF-10 | Duplicate registration attempt | Duplicate account warning displays ("An account with this email address already exists") | Pass |
| RF-11 | Keyboard navigation & accessibility | Fields and controls are keyboard-navigable and labeled with ARIA error attributes | Pass |

## Execution summary
- **Tested environment**: React 19 + TypeScript + Vite modern browser
- **Validation logic**: Client-side name length, RFC email regex, password minimum length, password match, and email uniqueness checks
- **Persistence**: `localStorage` (`stm_registered_users` and `stm_last_registered_email`)
- **Status**: Verified and ready for merge into `main` and integration with STM-10.
