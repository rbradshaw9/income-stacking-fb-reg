# Funnel Builder - Proof of Concept

A simple config-driven funnel generator for quickly creating webinar registration funnels.

## 🎯 Purpose

Speed up development and testing by generating funnels from JSON configs instead of manually copying and editing HTML files.

## 📁 Structure

```
funnel-builder/
├── build.js           # Build script that generates HTML from configs
├── package.json       # Dependencies
├── configs/           # Funnel configurations (JSON)
│   └── test-funnel.json
├── templates/         # Handlebars templates
│   └── index.hbs
└── output/            # Generated funnels appear here
    └── test-funnel/
        └── index.html
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd funnel-builder
   npm install
   ```

2. **Build a funnel:**
   ```bash
   npm run build
   ```
   
   This will build the `test-funnel` by default.

3. **Build a specific funnel:**
   ```bash
   npm run build my-funnel
   ```
   
   This looks for `configs/my-funnel.json` and generates `output/my-funnel/index.html`.

4. **Open the generated funnel:**
   Navigate to `funnel-builder/output/test-funnel/index.html` and open in a browser.

## 📝 Creating a New Funnel

1. **Copy the test config:**
   ```bash
   cp configs/test-funnel.json configs/my-new-funnel.json
   ```

2. **Edit the config:**
   Open `configs/my-new-funnel.json` and customize:
   - `id`: Unique identifier (used for output folder name)
   - `meta.title`: Page title
   - `hero.title`: Main headline (array of lines)
   - `hero.subtitle`: Subheadline with HTML support
   - `webinar.date`: ISO 8601 date (e.g., "2026-03-15T19:00:00Z")
   - `benefits`, `testimonials`, `finalCta`: Content sections
   - `gtmId`: Google Tag Manager ID (optional)

3. **Build it:**
   ```bash
   npm run build my-new-funnel
   ```

4. **Test it:**
   Open `output/my-new-funnel/index.html` in your browser.

## ⚙️ Config Options

### Required Fields

- `id` - Unique funnel identifier
- `meta.title` - Page title
- `hero.title` - Array of headline lines
- `hero.subtitle` - Subheadline (supports HTML)
- `webinar.date` - ISO 8601 datetime
- `webinar.dateDisplay` - Human-readable date
- `webinar.timezonesDisplay` - Timezone information

### Optional Fields

- `gtmId` - Google Tag Manager container ID
- `badge` - Top badge (text + bgColor)
- `quickBenefits` - 3 benefit items with icons
- `benefits` - Main benefits section with items array
- `testimonials` - Testimonials section with items array
- `finalCta` - Bottom CTA section

## 🎨 Customization

### Colors

Adjust in your config:
```json
"hero": {
  "colorPrimary": "#f59e0b",
  "colorSecondary": "#ef4444"
}
```

### Webinar Timing

The funnel automatically redirects to the replay page after the webinar + grace period:
```json
"webinar": {
  "date": "2026-02-15T19:00:00Z",
  "gracePeriodMinutes": 30,
  "replayUrl": "/my-funnel/replay.html"
}
```

### Form Integration

Currently, the form shows an alert. To connect to your CRM:
1. Copy your Infusionsoft form ID from an existing funnel
2. Add to the config (requires template update)
3. Or manually edit the generated HTML

## 📦 What Gets Generated

Each build creates:
- `output/[funnel-id]/index.html` - Complete standalone HTML file
- All styles and scripts are inline/CDN-based
- No build dependencies in production
- Ready to deploy to Vercel

## ⚠️ Important Notes

- **This is a POC** - It only generates the registration page (index.html)
- **Live funnel is safe** - All generated files go to `output/` directory
- **Manual form setup** - Form submission needs CRM integration
- **Assets not copied** - Favicons reference `../assets/` (existing path)

## 🔮 Future Enhancements

- [ ] Generate all funnel pages (replay, confirmed, replay-watch)
- [ ] Infusionsoft form integration in config
- [ ] Copy/generate assets automatically
- [ ] Live preview server
- [ ] Multiple template options
- [ ] Config validation

## 📚 Examples

See `configs/test-funnel.json` for a complete working example with all options configured.

## 🐛 Troubleshooting

**Build fails:**
- Check JSON syntax in your config file
- Ensure all required fields are present
- Run `npm install` if dependencies are missing

**Generated page looks broken:**
- Open in a browser (not just view source)
- Check browser console for errors
- Verify favicon paths point to existing files

**Countdown shows wrong time:**
- Ensure webinar.date is in ISO 8601 format
- Check timezone (dates should be in UTC with 'Z' suffix)

## 💡 Tips

- Keep config IDs lowercase with hyphens
- Test with `test-funnel` first to understand the structure
- Use HTML in `subtitle` and `description` fields for formatting
- Icons use Heroicons SVG paths (copy from existing configs)
