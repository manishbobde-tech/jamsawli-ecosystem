# Jamsawli Hanuman Lok - Digital Ecosystem Design

## Vision
**"Jamsawli Hanuman Lok - Where Faith Meets Innovation"**

Transform a 100+ year rural temple into a tech-enabled spiritual ecosystem serving millions of devotees - from local villagers to global diaspora. Build an extensible platform (MandirOS) that can eventually serve other religious organizations across India.

## Background

### About Jamsawli Hanuman Mandir
- **Location:** Village Sawli, Chhindwara district, Madhya Pradesh
- **Significance:** Swayambhu (self-manifested) reclining Hanuman idol at Jam-Sarpa river confluence
- **Management:** Chamatkarik Shri Hanuman Mandir Sansthan (Hanuman Lok) - 32 trustees
- **Government Support:** ₹362 crore development announced by CM Mohan Yadav
- **Current Digital Presence:** WordPress website, social media (Facebook, Instagram, YouTube)

### Target Users
1. **Rural/Local Devotees** - Villagers, nearby towns (Saunsar, Chhindwara), Maharashtra border
2. **National Devotees** - Pan-India Hindu devotees seeking live darshan, virtual pooja
3. **Global Diaspora** - NRI community, spiritual seekers worldwide

## Product Ecosystem

### Core Platform
| Module | Description | Priority |
|--------|-------------|----------|
| Jamsawli Website | Main PWA - info, events, gallery, about | P0 |
| Donation System | One-time, recurring, campaign-based giving | P0 |
| Pooja Booking | Book rituals, select timings, receive prasad | P0 |
| Trust Dashboard | Admin panel for donations, bookings, analytics | P0 |

### Engagement Modules
| Module | Description | Priority |
|--------|-------------|----------|
| Live Darshan | 24/7 temple camera streaming | P1 |
| Event Calendar | Festivals, aartis, special occasions | P1 |
| Community Board | Devotee stories, Q&A, prayer requests | P2 |

### Commerce Modules
| Module | Description | Priority |
|--------|-------------|----------|
| Prasad Delivery | Blessed offerings shipped to homes | P1 |
| Sacred Merchandise | Idols, books, spiritual items | P2 |
| Heritage Store | Local MP crafts, organic products | P3 |

### Pilgrim Services
| Module | Description | Priority |
|--------|-------------|----------|
| Bhakta Niwas | Room/bed booking for visitors | P1 |
| Travel Guide | Routes, transport, nearby attractions | P2 |
| Medical Aid | Hospital info, emergency contacts | P1 |

### Content & Education
| Module | Description | Priority |
|--------|-------------|----------|
| Spiritual Library | Hanuman Chalisa, Ramayana, stories | P2 |
| Video Hub | Aartis, discourses, documentaries | P1 |
| Daily Wisdom | Push notifications with verses/stories | P2 |

### Innovative Features
| Feature | Description |
|---------|-------------|
| Live Devotee Counter | Real-time footfall at temple |
| Live Darshan Queue | Current wait time for in-person darshan |
| AI Hanuman Assistant | Chatbot trained on temple history |
| WhatsApp Bot | Book poojas, donate, get updates via WhatsApp |
| Gamification | Pilgrim badges, darshan streaks, leaderboards |
| Fund Flow Dashboard | See exactly where every donation goes |
| Voice Navigation | Entire app usable by voice |
| Offline Mode | Core features work without internet |

## Technical Architecture

### Platform: MandirOS
A multi-tenant, extensible temple management platform.

### Tech Stack
| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js + TypeScript | Fast, SEO-friendly, SSR |
| UI Library | Tailwind + shadcn/ui | Rapid development |
| Mobile | PWA + Capacitor | Native apps from same codebase |
| Backend | Next.js API Routes | Single codebase |
| Database | PostgreSQL + Prisma | Type-safe, complex queries |
| Auth | NextAuth.js | Google, Phone, Email |
| Payments | Razorpay + UPI | India-focused |
| Video | Mux or Cloudflare Stream | Live streaming |
| Storage | Cloudflare R2 or S3 | Media files |
| CDN | Cloudflare | Global delivery |
| Hosting | Vercel | Zero-config, scales |
| WhatsApp | WhatsApp Business API | Official integration |
| AI | OpenAI API | Chatbot, content |
| Analytics | Plausible or PostHog | Privacy-focused |

### Multi-Tenant Data Model
- Organization → Temple → Content/Donations/Bookings/Users
- Plugin system for extensibility
- Configuration layer for white-labeling

## Implementation Phases

### Phase 1: Foundation (Months 1-3)
- Project setup, database schema, auth
- Temple profile, content CMS, basic pages
- Donation system (UPI, cards, net banking)
- Pooja booking system
- Trust admin dashboard
- Live devotee counter, WhatsApp bot basic

### Phase 2: Engagement (Months 4-6)
- Live darshan streaming
- Prasad delivery system
- AI chatbot (Hanuman Assistant)
- Gamification (badges, streaks)
- Fund transparency dashboard
- Event calendar + notifications

### Phase 3: Scale (Months 7-12)
- Multi-tenant architecture
- Plugin marketplace
- White-labeling system
- Advanced analytics
- Mobile app (Capacitor)
- Temple onboarding flow

### Phase 4: Growth (Year 2)
- Pricing tiers, support system
- AR experiences, Smart TV app
- Temple association partnerships
- Developer ecosystem, plugins

## Revenue Model

### Direct Revenue
- Donations (one-time, recurring)
- Pooja bookings
- Prasad delivery
- Merchandise sales

### Institutional Funding
- Government grants
- CSR funding
- Heritage tourism partnerships

### Platform Revenue (MandirOS)
- Temple subscription fees
- Transaction fees (2-3%)
- Premium features
- Plugin marketplace commissions

## Success Metrics

### Phase 1 (3 months)
- 1,000+ registered devotees
- ₹5,00,000+ in online donations
- 500+ pooja bookings

### Phase 2 (6 months)
- 10,000+ monthly active users
- 50+ daily live darshan viewers
- 100+ prasad deliveries/week

### Phase 3 (12 months)
- 50,000+ registered devotees
- 3+ temples on platform
- ₹50,00,000+ monthly donations

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Low tech adoption in rural areas | Voice-first interface, WhatsApp integration, offline mode |
| Payment failures | Multiple gateways, retry logic, manual verification |
| Video streaming issues | CDN redundancy, adaptive bitrate, offline recording |
| Data privacy concerns | GDPR compliance, encryption, transparent policies |
| Scaling challenges | Serverless architecture, auto-scaling, caching |

## Next Steps

1. Committee approval of this design
2. Create detailed implementation plan
3. Set up development environment
4. Begin Phase 1 development
5. Launch MVP for Jamsawli
