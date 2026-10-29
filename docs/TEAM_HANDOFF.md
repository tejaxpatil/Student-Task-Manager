# Team handoff and task boundaries

Project: Student Task Manager (STM), Sprint 1.

## Tejas Patil — assigned work
- STM-6: Design registration form UI.
- STM-9: Design login form UI.
- STM-13: Implement responsive homepage.
- STM-17: Test contact form submission and validation after Harsh's implementation is available.

## Thalesh — teammate-owned work
- STM-7: Implement registration and input validation (Completed — see `docs/STM-7-REGISTRATION-TEST-PLAN.md`).
- STM-10: Implement authentication and validation (Completed — see `docs/STM-10-AUTHENTICATION-TEST-PLAN.md`).
- STM-14: Test homepage responsiveness.

## Harsh Pillai — teammate-owned work
- STM-12: Design homepage layout.
- STM-16: Implement contact form and validation.

## Integration rules
- Registration and login pages currently contain presentation-only forms. Do not treat them as working authentication.
- The contact page is intentionally a placeholder until STM-16 is ready.
- Coordinate with Harsh before changing the homepage's visual design.
- Coordinate with Thalesh before adding form submission, validation, authentication, or protected-route behavior.
- Use separate branches and pull requests where practical; avoid committing directly to `main` for feature work.
- Do not mark a Jira task Done until its acceptance criteria have been checked.

## Suggested branch names
- `feat/STM-6-registration-ui`
- `feat/STM-9-login-ui`
- `feat/STM-13-responsive-homepage`
- `test/STM-17-contact-form`
