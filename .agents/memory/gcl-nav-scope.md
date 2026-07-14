---
    name: gcl-website-nav-scope
    description: GCL website nav is intentionally limited to Home/Courses/Events + Sign In/Get Started; other routed pages (Chapters, News, etc.) exist but aren't linked in nav.
    ---

    Global Capital League site nav (artifacts/gcl-website/src/components/Nav.tsx) shows only Home, Courses, Events, Sign In, Get Started.
    Other pages (Chapters, News, OurTeam, dashboards, admin, certificates) remain routed in App.tsx but are deliberately excluded from top nav per user request.

    **Why:** user wants a lean top nav even though the app has grown into a full product (auth, admin dashboard, member/team portals, certificates).
    **How to apply:** when adding new pages, don't assume nav parity with routes — check with the user before adding new nav links, since the app intentionally routes more pages than it links.
    