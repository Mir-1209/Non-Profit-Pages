---
name: Admin data architecture
description: How AdminContext connects to the member/team portals and what keys are persisted in localStorage.
---

## Rule
AdminContext is the single source of truth. Member and team portals must read from it — never from hardcoded local arrays.

**Why:** Previously MemberDashboard and TeamPortal had hardcoded APPLIED_PROGRAMS arrays that were disconnected from admin actions. Now everything flows through context.

## localStorage keys
- `gcl_events` — Event[]
- `gcl_courses` — Course[]
- `gcl_news` — NewsPost[]
- `gcl_assignments` — Assignment[] (new)
- `gcl_submissions` — AssignmentSubmission[] (new)
- `gcl_programs` — Program[] (new)

## Member ID linking
- `user.id` from AuthContext === `memberId` in ProgramApplicant
- Mirzo10 → member account; Mirzo11 → gcl_team account; Mirzo12 → admin
- `getMyPrograms(memberId)` and `getMyAssignments(memberId)` are the two helper functions

## How to apply
- Any new page that shows program/assignment data for a logged-in user MUST call getMyPrograms/getMyAssignments with user.id
- Admin decision changes (accept/waitlist/reject) propagate instantly via React context — no refresh needed
