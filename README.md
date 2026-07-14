# KitchenOS_Private

KitchenOS_Private is a custom low-level kitchen management platform built for both individual users and organizations.

It provides:
- Recipe management
- Inventory tracking
- Vendor organization
- Team collaboration
- Shared/public recipe systems
- Organization management

Powered by Supabase and PostgreSQL.

---

# Features

## User Features
- User authentication and account management
- Personal recipe storage
- Shared/public recipe browsing
- Kitchen tools management
- Recipe sharing between users
- Personal workspace system

## Organization Features
- Organization-level recipe management
- Inventory tracking
- Vendor management
- Team dashboards
- Member invitations and permissions
- Shared recipe systems

---

# System Architecture

```text
Start Page
├── Sign Up / Authentication
└── Home Page
    ├── Personal Workspace
    │   ├── Recipes
    │   ├── Tools
    │   │   └── Public Shared Recipes
    │   └── Sharing
    │
    └── Organizational Workspace
        ├── Recipes
        ├── Inventory
        ├── Vendors
        ├── Tools
        │   └── Public Shared Recipes
        └── Dashboard
            └── Invite Members
```

---

# Tech Stack

## Frontend
- TypeScript
- Supabase Client SDK

## Backend
- Supabase
- PostgreSQL
- Row Level Security (RLS)

---

# Supabase Configuration

## Environment Variables

Create a `.env` file in the root project directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Supabase Client Setup

Example `client-side.ts` configuration:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
```

---

# Supabase Database Schemas

## Users_SignIn

Stores basic authenticated user login information.

```sql
create table public."Users_SignIn" (
  email text not null,
  created_at timestamp with time zone not null default now(),
  constraint Users_SignIn_pkey primary key (email)
) TABLESPACE pg_default;
```

---

## User_Metadata

Stores extended profile information and user relationships.

```sql
create table public."User_Metadata" (
  user_id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  age numeric not null,
  email text not null,
  recipe_references text[] null,
  organizations_member text[] null,
  invite_requests jsonb[] null,

  constraint User_Metadata_pkey primary key (user_id),

  constraint User_Metadata_email_fkey
    foreign KEY (email)
    references "Users_SignIn" (email)

) TABLESPACE pg_default;
```

### Stored Data
- User identity information
- Recipe references
- Organization memberships
- Invite requests
- User profile metadata

---

## Recipes

Stores all recipe-related information.

```sql
create table public."Recipes" (
  recipe_id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,

  created_by uuid not null,
  updated_by uuid null,

  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,

  tags text[] null,

  prep_time_minutes integer null,
  cook_time_minutes integer null,

  servings integer not null,
  difficulty text null,

  is_public boolean null default false,

  constraint Recipes_pkey primary key (recipe_id),

  constraint recipes_created_by_fkey
    foreign KEY (created_by)
    references "User_Metadata" (user_id),

  constraint recipes_updated_by_fkey
    foreign KEY (updated_by)
    references "User_Metadata" (user_id),

  constraint difficulty_check check (
    (
      difficulty = any (
        array[
          'easy'::text,
          'medium'::text,
          'hard'::text
        ]
      )
    )
  ),

  constraint updated_after_created check (
    (
      (updated_at is null)
      or (updated_at >= created_at)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_recipes_created_by
on public."Recipes"
using btree (created_by)
TABLESPACE pg_default;

create index IF not exists idx_recipes_updated_by
on public."Recipes"
using btree (updated_by)
TABLESPACE pg_default;

create index IF not exists idx_recipes_created_at
on public."Recipes"
using btree (created_at desc)
TABLESPACE pg_default;

create index IF not exists idx_recipes_tags
on public."Recipes"
using gin (tags)
TABLESPACE pg_default;
```

### Recipe Features
- Structured ingredients and steps
- Public/private recipe visibility
- Recipe tagging
- Difficulty tracking
- Time estimation
- Ownership tracking
- Indexed queries for performance

---

## Organizations

Stores organization-level operational data.

```sql
create table public."Organizations" (
  organization_id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),

  recipe_references text[] not null,

  created_by uuid not null,
  owner_id uuid not null,

  users text[] not null,

  vendor jsonb not null,
  inventory jsonb not null,
  assigned_tasks jsonb not null,

  organization_name text not null,

  constraint Organizations_pkey primary key (organization_id),

  constraint Organizations_owner_id_fkey
    foreign KEY (owner_id)
    references "User_Metadata" (user_id)

) TABLESPACE pg_default;
```

### Organization Features
- Shared recipes
- Vendor management
- Inventory systems
- Task assignments
- Multi-user collaboration
- Organization ownership

---

# Database Structure

KitchenOS uses PostgreSQL through Supabase with four primary public tables:

| Table | Purpose |
|---|---|
| `Users_SignIn` | Stores authentication-linked user login data |
| `User_Metadata` | Stores user profile and relationship data |
| `Recipes` | Stores recipe information and metadata |
| `Organizations` | Stores organization collaboration data |

---

# Security

KitchenOS uses Supabase Row Level Security (RLS) policies for secure multi-user access control.

## Example Policy

```sql
CREATE POLICY "Members can update organization"
ON public."Organizations"
FOR UPDATE
USING (
  auth.uid() = ANY(users->>'user_id')
);
```

---

# Planned Features

- Real-time collaboration
- Recipe scaling calculator
- Nutritional analysis
- Barcode inventory scanning
- Vendor ordering automation
- Analytics dashboard
- Mobile support
- Advanced permissions system
- Recipe version history

---

# Recommended Project Structure

```text
/src
├── components
├── pages
├── lib
│   └── client-side.ts
├── services
├── hooks
├── database
├── types
└── utils
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/KitchenOS_Private.git
cd KitchenOS_Private
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file:

```env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

## 4. Run the Development Server

```bash
npm run dev
```

---

# Goals

KitchenOS_Private is designed to become:
- A flexible kitchen operating system
- A collaborative culinary workspace
- A scalable organization management platform
- A customizable backend for food operations
- A centralized recipe and inventory ecosystem

---

# License

Public project — not licensed for commercial redistribution or resale.
