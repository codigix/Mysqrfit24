# MySqrfit24 - Pages, APIs & Database Structure

Complete mapping of all frontend pages, their required data, database tables, and APIs.

## 📄 Pages Analysis

### 1. **Home Page (Index.tsx)**

**Components Used:**
- HeroSection - Static content
- BestListingsSection - Uses properties data
- FeaturedNeighborhoods - Uses properties data
- Testimonials - Uses testimonials data
- StatsSection - Static content
- TeamSection - Uses team members data
- BlogSection - Uses blog posts data
- NewsletterSection - Newsletter subscription
- CategoriesSection - Static content
- ChatBot - Chatbot inquiries

**Data Required:**
- Featured properties (limit 5-6)
- Testimonials (limit 3)
- Blog posts (limit 3, published only)
- Team members (public display)

**APIs Used:**
```
GET /api/properties?is_featured=true&status=available
GET /api/testimonials?published_only=true
GET /api/blog?published_only=true
GET /api/team?active_only=true
POST /api/newsletter/subscribe (form submission)
POST /api/chatbot/inquiries
```

---

### 2. **Properties Page (Properties.tsx)**

**Features:**
- List all properties with filters
- Filter by: type, property_type, location, price range, bedrooms, bathrooms

**Data Required:**
- All properties matching filters

**APIs Used:**
```
GET /api/properties?type=sale&property_type=apartment&location=...&min_price=...&max_price=...&bedrooms=...&bathrooms=...
```

---

### 3. **Property Details Page (PropertyDetails.tsx)**

**Features:**
- Full property details
- Image gallery
- Reviews section
- Developer info
- Similar properties
- Contact form

**Data Required:**
- Single property details
- Property reviews
- Similar properties

**APIs Used:**
```
GET /api/properties/:id
POST /api/contact (inquiry form)
GET /api/properties?property_type=apartment&location=... (similar)
```

---

### 4. **About Page (About.tsx)**

**Sections:**
- Company stats (hardcoded)
- Company story (hardcoded)
- Values (hardcoded)
- Team members section
- Contact information

**Data Required:**
- Team members (all active)

**APIs Used:**
```
GET /api/team?active_only=true
```

---

### 5. **Admin Login Page (AdminLogin.tsx)**

**Features:**
- Admin login
- JWT authentication

**APIs Used:**
```
POST /api/auth/login
POST /api/auth/register
```

---

### 6. **Admin Dashboard (Admin.tsx)**

**Features:**
- Property management (CRUD)
- Image uploads
- Chatbot inquiries view
- Feature/unfeature properties

**Data Required:**
- All properties (paginated)
- Chatbot inquiries
- Admin statistics

**APIs Used:**
```
GET /api/properties
POST /api/properties
PUT /api/properties/:id
DELETE /api/properties/:id
GET /api/chatbot/inquiries
DELETE /api/chatbot/inquiries/:id
POST /api/contact/stats
```

---

## 🗄️ Database Tables & Schemas

### **1. users**
```sql
id, email, password_hash, is_admin, created_at, updated_at
```
**Purpose:** Admin user authentication

---

### **2. properties**
```sql
id, title, description, price, type (sale/rent),
property_type (apartment/house/villa/commercial/land),
bedrooms, bathrooms, area, location, address, latitude, longitude,
features (JSON), images (JSON), developer_name, developer_phone,
developer_whatsapp, is_featured, status (available/sold/rented),
created_at, updated_at
```
**Purpose:** Real estate property listings
**Indexes:** type, property_type, location, status, price, created_at

---

### **3. testimonials** ⭐ NEW
```sql
id, name, role, content, rating (1-5), image_url,
is_featured, status (published/draft),
created_at, updated_at
```
**Purpose:** Customer testimonials for home page
**Used By:** Index page testimonials section

---

### **4. blog_posts** ⭐ NEW
```sql
id, title, slug (unique), excerpt, content, image_url,
author, category, status (published/draft), views,
created_at, updated_at, published_at
```
**Purpose:** Blog articles and news
**Used By:** Index page blog section, blog listing page (future)
**Indexes:** status, category, created_at, published_at

---

### **5. team_members** ⭐ NEW
```sql
id, name, role, bio, image_url, email, phone,
social_links (JSON), is_active, display_order,
created_at, updated_at
```
**Purpose:** Company team information
**Used By:** About page, team section on home page
**Indexes:** is_active, display_order

---

### **6. newsletter_subscribers** ⭐ NEW
```sql
id, email (unique), name, is_subscribed, subscription_date,
created_at, updated_at
```
**Purpose:** Newsletter email subscriptions
**Used By:** Newsletter section form submission
**Indexes:** email, is_subscribed

---

### **7. contact_messages** ⭐ NEW
```sql
id, name, email, phone, subject, message,
property_id (foreign key), status (new/read/replied),
created_at, updated_at
```
**Purpose:** Contact form submissions
**Used By:** Property detail contact forms, general contact page
**Foreign Keys:** properties.id

---

### **8. chatbot_inquiries**
```sql
id, property_type (rent/buy), budget, location, contact,
name, email, phone, message, created_at, updated_at
```
**Purpose:** Chatbot inquiry submissions

---

### **9. property_reviews**
```sql
id, property_id, author, rating (1-5), comment,
created_at
```
**Purpose:** Property reviews and ratings

---

### **10. property_images**
```sql
id, property_id, image_url, display_order, created_at
```
**Purpose:** Property image gallery management

---

### **11. admin_logs**
```sql
id, admin_id, action, entity_type, entity_id,
changes (JSON), ip_address, created_at
```
**Purpose:** Admin action audit trail

---

## 📡 API Endpoints Reference

### **Authentication** (2 endpoints)
```
POST   /api/auth/login              Login admin
POST   /api/auth/register           Create admin account
```

### **Properties** (5 endpoints)
```
GET    /api/properties              List all properties with filters
GET    /api/properties/:id          Get property details
POST   /api/properties              Create property (admin)
PUT    /api/properties/:id          Update property (admin)
DELETE /api/properties/:id          Delete property (admin)
```

### **Testimonials** (5 endpoints) ⭐ NEW
```
GET    /api/testimonials            List testimonials
GET    /api/testimonials/:id        Get single testimonial
POST   /api/testimonials            Create testimonial (admin)
PUT    /api/testimonials/:id        Update testimonial (admin)
DELETE /api/testimonials/:id        Delete testimonial (admin)
```

### **Blog** (6 endpoints) ⭐ NEW
```
GET    /api/blog                    List blog posts
GET    /api/blog/:id                Get blog post by ID
GET    /api/blog/slug/:slug         Get blog post by slug
POST   /api/blog                    Create blog post (admin)
PUT    /api/blog/:id                Update blog post (admin)
DELETE /api/blog/:id                Delete blog post (admin)
```

### **Team** (5 endpoints) ⭐ NEW
```
GET    /api/team                    List team members
GET    /api/team/:id                Get team member details
POST   /api/team                    Create team member (admin)
PUT    /api/team/:id                Update team member (admin)
DELETE /api/team/:id                Delete team member (admin)
```

### **Newsletter** (4 endpoints) ⭐ NEW
```
POST   /api/newsletter/subscribe    Subscribe to newsletter
POST   /api/newsletter/unsubscribe  Unsubscribe from newsletter
GET    /api/newsletter              Get all subscribers (admin)
DELETE /api/newsletter/:id          Delete subscriber (admin)
```

### **Contact** (6 endpoints) ⭐ NEW
```
POST   /api/contact                 Send contact message
GET    /api/contact                 Get all messages (admin)
GET    /api/contact/:id             Get single message (admin)
PUT    /api/contact/:id             Update message status (admin)
DELETE /api/contact/:id             Delete message (admin)
GET    /api/contact/stats           Get contact statistics (admin)
```

### **Chatbot** (3 endpoints)
```
POST   /api/chatbot/inquiries       Create inquiry
GET    /api/chatbot/inquiries       Get inquiries (admin)
DELETE /api/chatbot/inquiries/:id   Delete inquiry (admin)
```

### **Health Check**
```
GET    /api/health                  Server status
```

---

## 🔄 Query Parameters

### Properties
```
GET /api/properties?type=sale&property_type=apartment&location=NYC&min_price=100000&max_price=500000&bedrooms=2&bathrooms=1
```

### Testimonials
```
GET /api/testimonials?published_only=true&featured_only=true
```

### Blog Posts
```
GET /api/blog?status=published&category=Buying
GET /api/blog/slug/10-tips-for-first-time-homebuyers
```

### Team Members
```
GET /api/team?active_only=true
```

### Newsletter
```
GET /api/newsletter?subscribed_only=true
```

### Contact Messages
```
GET /api/contact?status=new&property_id=xyz
```

---

## 📋 Page-to-Database Mapping

| Page | Database Tables | Primary APIs |
|------|-----------------|--------------|
| Home (Index) | properties, testimonials, blog_posts, team_members, newsletter_subscribers | GET properties, testimonials, blog, team; POST newsletter |
| Properties | properties | GET properties |
| Property Details | properties, contact_messages, property_reviews | GET properties, POST contact |
| About | team_members | GET team |
| Admin Login | users | POST auth |
| Admin Dashboard | properties, chatbot_inquiries, contact_messages | CRUD properties, GET inquiries, GET contact |

---

## 🚀 Implementation Status

### ✅ Completed
- ✅ Database schema (all 11 tables)
- ✅ Backend controllers (auth, properties, testimonials, blog, team, newsletter, contact, chatbot)
- ✅ Backend routes (all endpoints)
- ✅ Frontend API service (apiService)
- ✅ Server integration (all routes connected)

### 📝 Next Steps
- Update frontend components to use API endpoints:
  - Index.tsx (testimonials, blog, team)
  - About.tsx (team)
  - Admin.tsx (all management)
  - NewsletterSection.tsx (subscription)
  - ContactForm components (contact messages)

---

## 🔐 Authentication & Authorization

**Public Endpoints:**
- GET /api/properties
- GET /api/testimonials
- GET /api/blog
- GET /api/team
- POST /api/newsletter/subscribe
- POST /api/contact
- POST /api/chatbot/inquiries

**Admin-Only Endpoints:**
- POST /api/auth/login
- POST /api/properties (create/update/delete)
- PUT /api/properties/:id
- DELETE /api/properties/:id
- Admin endpoints for testimonials, blog, team, newsletter, contact

---

## 📊 Data Flow Examples

### Example 1: Home Page Load
```
1. GET /api/properties?is_featured=true → BestListingsSection
2. GET /api/testimonials?published_only=true → Testimonials
3. GET /api/blog?published_only=true → BlogSection
4. GET /api/team?active_only=true → TeamSection
```

### Example 2: Property Inquiry
```
1. User fills contact form on property detail page
2. POST /api/contact { name, email, phone, message, property_id }
3. Message stored in contact_messages table
4. Admin sees in admin dashboard
5. Admin can update status: new → read → replied
```

### Example 3: Admin Property Management
```
1. Admin logs in: POST /api/auth/login
2. Receives JWT token
3. GET /api/properties (list all)
4. POST /api/properties (create new)
5. PUT /api/properties/:id (update)
6. DELETE /api/properties/:id (delete)
```

---

## 💾 Database Tables Summary

| Table | Purpose | Records/Day Est. |
|-------|---------|-----------------|
| users | Admin accounts | <10 |
| properties | Property listings | 1-10 |
| testimonials | Customer reviews | 1-5 |
| blog_posts | Blog articles | 1-3 |
| team_members | Staff info | <50 |
| newsletter_subscribers | Email subscribers | 5-50 |
| contact_messages | Contact submissions | 5-20 |
| chatbot_inquiries | Chat inquiries | 10-50 |
| property_reviews | Property reviews | 5-10 |
| property_images | Property photos | 50-200 |
| admin_logs | Audit trail | 10-100 |

---

## 🔗 File Locations

### Backend
- Controllers: `backend/controllers/*.js`
- Routes: `backend/routes/*.js`
- Database: `backend/config/database.sql`
- Server: `backend/server.js`

### Frontend
- API Service: `src/services/api.ts`
- Pages: `src/pages/*.tsx`
- Components: `src/components/*.tsx`

---

## 📝 Quick Reference

**Total Tables:** 11  
**Total Endpoints:** 40+  
**Public Endpoints:** 8  
**Admin Endpoints:** 30+  
**Total Controllers:** 8  
**Total Routes Files:** 8  

---

**Last Updated:** December 2024  
**Status:** Ready for Frontend Component Updates
