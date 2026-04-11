# Chatbot Dashboard Redesign & Schema Expansion Plan

Your request involves massively scaling up the level of customization a non-technical admin has over the Chatbot tool. To cleanly handle nearly 20 different dynamic styling properties without creating a spaghetti mess of React "inline-styles", I am introducing a native CSS Variables architecture bound to your database.

---

## Proposed Changes

### 1. Database & Backend Upgrade (`Backend`)
#### [MODIFY] `Backend/model/ChatbotSettings.js`
- Append the 13 new styling fields to the Mongoose Schema (e.g. `aiAvatarBackgroundColor`, `botBubbleColor`, `userBubbleColor`, `onlineIndicatorColor`, `backgroundImage`).
- We will define safe, elegant SaaS defaults (like Stripe) using Indigo/Gold pairings so that a fresh deployment immediately looks high-end.

#### [MODIFY] `Backend/controllers/chatbotSettingsController.js`
- Currently, the `updateSettings` API manually hardcodes property assignments (`if (headerColor) settings.headerColor = ...`).
- I will refactor this to use a dynamic payload whitelist, ensuring any newly added Schema property is seamlessly digested without requiring future controller tweaks.

---

### 2. Admin Settings UI Rebuild (`admin-ui`)
#### [MODIFY] `admin-ui/src/pages/ChatbotControl/UISettings.jsx`
- Rebuild the form layout into a pristine modern SaaS UI using distinct visual grouping:
  - **Header Settings** (Backgrounds)
  - **Accent Colors** (Icons, Buttons, Status)
  - **Text Colors** (Titles, subtitles)
  - **Background Engine** (Image upload dropzone, bubbling logic).
- Introduce a **"Reset to Default"** utility button alongside the Save state.
- Update `/styles/chatbotControl.css` to build an elegant flex-grid mapping for these multiple fields rather than stacking them vertically.

---

### 3. Rendering Engine Transformation (`chatbot-ui`)
#### [MODIFY] `chatbot-ui/src/components/chatbot/ChatbotUI.jsx`
- Instead of manually passing 15 different styling props down through `ChatHeader`, `ChatInput`, and `MessageBubble`, the root `ChatbotUI` will generate an inline **CSS Dictionary object** mapping database values to Root Layout `<div style={{"--accent-icon": settings.sendButtonIconColor}}>`.
- This ensures lightning-fast dynamic inheritance across every React child element simply by mounting.

#### [MODIFY] `chatbot-ui/src/styles/chat.css`
- Scrub hardcoded hex values locally.
- Replace variables globally (e.g. `background: var(--header-bg, #0B1F3A);`, `color: var(--badge-text, #D4AF37);`).

## User Review Required

> [!TIP]
> The architectural switch to `--css-variables` mapping allows you to add infinite new customizable colors in the future just by tweaking the backend schema. Review the above workflow, and if it satisfies your Customization Dashboard requirements, instruct me to proceed!
