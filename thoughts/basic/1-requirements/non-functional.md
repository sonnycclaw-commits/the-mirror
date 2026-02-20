# Non-Functional Requirements

**Section:** 1-requirements
**Status:** Draft
**Source:** Distilled from `concept/05a-technical-architecture.md`, `ideation/CHALLENGES.md`

---

## NFR-1: Performance

### NFR-1.1: Page Load

| Metric | Target | Maximum | Measurement |
|--------|--------|---------|-------------|
| First Contentful Paint | <1.5s | 2.5s | Lighthouse |
| Time to Interactive | <3s | 5s | Lighthouse |
| Largest Contentful Paint | <2.5s | 4s | Lighthouse |

### NFR-1.2: Constellation Rendering

| Metric | Target | Condition |
|--------|--------|-----------|
| Frame rate | 60fps | Up to 50 stars + animations |
| Initial render | <500ms | Cold start, 20 stars |
| Star addition | <100ms | New star appears |
| Interaction response | <50ms | Tap on star |

### NFR-1.3: API Response Times

| Endpoint | Target | Maximum |
|----------|--------|---------|
| Load constellation | <500ms | 1s |
| Send message | <100ms | 500ms |
| TARS response | <3s | 5s |
| Star extraction | Inline with response | — |

### NFR-1.4: Mobile Performance

| Device Class | Requirement |
|--------------|-------------|
| High-end (iPhone 13+, Pixel 6+) | Full animations, 60fps |
| Mid-range (iPhone SE, budget Android) | Reduced animations, 30fps acceptable |
| Low-end | Must remain functional, minimal animations |

---

## NFR-2: Security

### NFR-2.1: Authentication

| Requirement | Implementation |
|-------------|----------------|
| No stored passwords | Magic link only via Clerk |
| Session security | Secure, HTTP-only cookies |
| Session duration | 30 days, refresh on activity |
| Multi-device | Allowed, sessions independent |

### NFR-2.2: Data Encryption

| Data State | Requirement |
|------------|-------------|
| In transit | TLS 1.3 minimum |
| At rest | AES-256 (Convex default) |
| Backups | Encrypted by provider |

### NFR-2.3: API Security

| Requirement | Implementation |
|-------------|----------------|
| Authentication | All API calls require valid session |
| Authorization | Users can only access own data |
| Rate limiting | 100 requests/minute per user |
| Input validation | All inputs validated server-side |

### NFR-2.4: Privacy

| Requirement | Implementation |
|-------------|----------------|
| GDPR compliance | Data export, deletion rights |
| No data selling | Architectural enforcement |
| No AI training on user data | Explicit policy, Claude API setting |
| Consent | Clear explanation at signup |

---

## NFR-3: Reliability

### NFR-3.1: Availability

| Metric | Target |
|--------|--------|
| Uptime | 99.5% (allows ~1.8 days/year downtime) |
| Planned maintenance | Off-peak hours, < 1 hour monthly |

### NFR-3.2: Data Durability

| Requirement | Implementation |
|-------------|----------------|
| No data loss | Convex handles replication |
| Recovery point objective (RPO) | <1 hour |
| Recovery time objective (RTO) | <4 hours |

### NFR-3.3: Error Handling

| Error Type | Handling |
|------------|----------|
| Network failure | Retry with backoff, user notification after 3 failures |
| API error | Graceful degradation, error message to user |
| Claude API failure | Cache recent context, retry, fallback message |
| Unexpected error | Log, alert, user-friendly error page |

---

## NFR-4: Scalability

### NFR-4.1: Initial Scale Targets

| Metric | MVP | 6 Months |
|--------|-----|----------|
| Concurrent users | 50 | 500 |
| Total users | 100 | 5,000 |
| Stars per user | 50 | 200 |
| Messages per user | 500 | 2,000 |

### NFR-4.2: Bottleneck Identification

| Component | Potential Bottleneck | Mitigation |
|-----------|---------------------|------------|
| Claude API | Rate limits, cost | Response caching, context summarization |
| Convex | Read/write throughput | Within free tier initially |
| Canvas rendering | Star count | Virtualization at 100+ stars |

---

## NFR-5: Accessibility

### NFR-5.1: WCAG Compliance

| Level | Target |
|-------|--------|
| WCAG 2.1 | AA compliance |

### NFR-5.2: Specific Requirements

| Requirement | Implementation |
|-------------|----------------|
| Screen reader support | ARIA labels on all interactive elements |
| Keyboard navigation | Full app navigable via keyboard |
| Color contrast | 4.5:1 minimum for text |
| Text sizing | Respects user font preferences |
| Motion sensitivity | Respect `prefers-reduced-motion` |

### NFR-5.3: Constellation Accessibility

| Challenge | Solution |
|-----------|----------|
| Visual-only information | Alternative text list view of stars |
| Star interactions | Keyboard-accessible star selection |
| Animations | Reducible via settings |

---

## NFR-6: Browser & Device Support

### NFR-6.1: Browsers

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 100+ |
| Safari | 15+ |
| Firefox | 100+ |
| Edge | 100+ |
| Mobile Safari | iOS 15+ |
| Chrome Android | 100+ |

### NFR-6.2: Devices

| Device Type | Requirement |
|-------------|-------------|
| Desktop | 1280x720 minimum viewport |
| Tablet | Responsive, touch-optimized |
| Mobile | 375px minimum width |

### NFR-6.3: PWA Requirements

| Feature | Status |
|---------|--------|
| Installable | Required |
| Offline support | Not required (MVP) |
| Push notifications | Not required (MVP) |
| App icon | Required |

---

## NFR-7: Maintainability

### NFR-7.1: Code Quality

| Metric | Target |
|--------|--------|
| TypeScript coverage | 100% (strict mode) |
| Linting | Zero errors |
| Test coverage | 70% critical paths |

### NFR-7.2: Documentation

| Requirement | Implementation |
|-------------|----------------|
| Code comments | JSDoc for public functions |
| Architecture docs | This folder (basic/) |
| API docs | Generated from types |

---

## Traceability

| Requirement | Source | User Need |
|-------------|--------|-----------|
| NFR-1 Performance | Technical feasibility | Seamless experience |
| NFR-2 Security | `concept/05a-technical-architecture.md` | Trust with sensitive data |
| NFR-3 Reliability | Standard practice | Dependable tool |
| NFR-4 Scalability | Business planning | Room to grow |
| NFR-5 Accessibility | Ethical requirement | Inclusive design |
| NFR-6 Support | User research | Works on their devices |
| NFR-7 Maintainability | Developer experience | Sustainable development |
