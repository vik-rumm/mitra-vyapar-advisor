# Vyapar Mitra Advisor

Build a high-end, light-mode fintech web application named "Vyapar-Mitra" serving as an AI business advisor. Use a layout identical to modern SaaS bento-box dashboards.

Design System & Styling:

- Background: Very light soft gray (#F4F5F7).

- Cards: Pure white (#FFFFFF) with rounded-2xl corners, 1px subtle gray borders (#E2E8F0), and soft shadows.

- Accent Colors: Vibrant Lime Green (#84CC16) for positive metrics, Soft Yellow (#FACC15) for warnings, Dark Slate (#0F172A) for text.

- Font: Inter, clean and modern.

Layout Structure:

1. Left Sidebar (Fixed, width 250px):

   - Logo: "Vyapar-Mitra" with a lime-green app icon.

   - Menu Items (Lucide icons): Dashboard, Idea Validator, Feasibility Engine, Schemes, Settings.

   - Bottom Box: "Upgrade to Advisor Pro" dark card with a lime green CTA button.

2. Top Header Bar:

   - Search input: "Search business ideas or districts..."

   - Language Toggle Pills: English | हिंदी | मराठी

   - Profile avatar and name "Ramesh K."

3. Main Content Area (CSS Grid, Gap-6):

   ROW 1 (Top Stats & Chart):

   - Left Card (col-span-8): "Projected Cashflow Overview". Show a clean bar chart with lime green and yellow bars representing income vs expenses over 6 months.

   - Right Cards (col-span-4): Two stacked small cards.

     - Top: "Est. Break-Even: 4.2 Months" (big bold number).

     - Bottom: "Local Risk: Low" with a map pin icon.

   ROW 2 (Insights & AI):

   - Left Card (col-span-4): "Capital Allocation". Show a multi-colored horizontal progress bar for how to spend ₹50,000 (Inventory, Rent, Marketing).

   - Middle Card (col-span-4): "Business Viability". Show a semi-circle gauge chart hitting 82% in lime green.

   - Right Card (col-span-4, tall card spanning multiple rows): "Vyapar AI Assistant". This is a Botpress-style chat widget. Show a chat bubble: "Is a snack shop viable in Pune?" and an AI reply: "Yes, you have high demand and only 3 competitors nearby." Include a bottom text input bar with a microphone icon for voice search.

   ROW 3:

   - Left Area (col-span-8): "Matched Government Schemes". A clean list view showing "PM MUDRA Yojana" and "MSME Credit Guarantee" with green "Eligible" badges and "Apply" buttons.

Make it fully responsive using Tailwind CSS. Focus on high-quality spacing (p-6 in cards) and typography.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/722dc058-75c9-433a-86bc-86cc08311ee9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
