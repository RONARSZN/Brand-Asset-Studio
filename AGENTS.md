# Brand Asset Studio

<!-- BEGIN:nextjs-agent-rules -->
## Next.js Version Note
This project uses the installed Next.js version in `node_modules`. Check local Next.js docs when touching version-sensitive APIs.
<!-- END:nextjs-agent-rules -->

## What this app is
A multi-brand image and poster generation tool for a small creative team of 6.
Web app with two primary modes: Library (asset management) and Studio (AI image generation).
Desktop-first. Mobile responsiveness is not a priority.

## Stack
- Frontend: Next.js (App Router) + TypeScript
- AI orchestration: Vercel AI SDK
- Auth + database + file storage: Supabase
- Image generation: Google Gemini API (multi-model, swappable)
- Template compositor: Fabric.js
- Hosting: Vercel free tier

## Asset system
- Organized by Brand -> Asset Type -> Files
- Supported asset types: Characters, Textures, Backgrounds, Logos, Misc
- All uploads auto-converted to PNG on ingest. Source files are not stored.
- Input formats: JPG, JPEG, PNG, WebP stored natively.
  SVG, PDF, PSD, TIFF, AI, EPS auto-flattened to PNG on upload.
- Assets stored in Supabase Storage
- UI must show a note on the upload screen: source files are converted and not retained

## Image generation
- Model selectable per-generation in Studio interface, not saved per brand
- Available models:
  - Gemini 2.5 Flash Image -> label: "Free - Draft"
  - Gemini 3 Pro Image -> label: "$0.134/image - Final + Pegs"
  - Imagen 4 Fast -> label: "$0.02/image - Fast Paid"
  - Imagen 4 Standard -> label: "$0.04/image - Balanced Paid"
- Cost label shown next to each model at point of selection
- Generation layer must be modular. Provider is a config variable, never hardcoded
- Always show a loading state during generation (takes 3-15 seconds)

## Database schema (Supabase)
- brands: id (uuid), name (text), created_at (timestamp)
- assets: id (uuid), brand_id (uuid FK -> brands.id), asset_type (text),
  file_url (text), original_filename (text), created_at (timestamp)
- Auth: handled by Supabase Auth (email/password)

## App modes
- /library -> Brand and asset management
- /studio -> Chat interface, peg selection, model selection, image generation, output

## Design direction
- Aesthetic: Dark, minimal, masculine. Think tool, not dashboard.
- Color palette: Near-black backgrounds (#0f0f0f), dark surfaces (#1a1a1a),
  muted warm white text (#e8e6e1), single accent color in deep amber or slate blue.
- Typography: Sharp, utilitarian. No decorative fonts.
- UI feel: Considered, immersive, not rushed. Avoid generic SaaS dashboard patterns.
- No gradients, no glassmorphism, no rounded pill buttons.

## Rules
- Free tiers only unless explicitly noted
- Never hardcode API keys. Use environment variables only
- Create .env.local.example listing all required variable names without values
- Keep components under 150 lines. Extract if larger
- No new dependencies without listing them in the response
- Always confirm completed phases with folder structure before proceeding
