# Income Stacking Webinar Registration Funnel

High-converting webinar registration funnel for Income Stacking training with Andy Tanner. Built with modern vanilla JavaScript and optimized for mobile devices.

## 🚀 Features

- **Mobile-responsive design** with Tailwind CSS
- **Webinar Fuel integration** for webinar management
- **Infusionsoft CRM integration** for lead capture
- **Optimized conversion flow** with countdown timer and social proof
- **Professional favicon implementation** with multiple sizes
- **Modular JavaScript architecture** for maintainability
- **Real-time form validation** with visual feedback
- **Dual API submission** with error handling

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, Tailwind CSS (CDN)
- **Code Quality**: ESLint
- **Hosting**: Static files (no build process needed)
- **Package Manager**: npm

## 📁 Project Structure

```
├── index.html              # Main registration page
├── js/                     # JavaScript modules
│   ├── app.js             # Main application entry point
│   ├── config.js          # Configuration and constants
│   ├── countdown.js       # Countdown timer functionality
│   ├── webinar-date.js    # Webinar date fetching
│   ├── form-validator.js  # Form validation logic
│   └── form-submission.js # Form submission handling
├── favicon files           # All favicon variants in root
├── package.json           # Dependencies and scripts
├── eslint.config.js       # Code quality rules
├── vercel.json           # Deployment configuration
└── .env.example          # Environment variables template
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rbradshaw9/income-stacking-fb-reg.git
cd income-stacking-fb-reg
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API credentials
```

### Development

Start a local development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

### Production Deployment

**🔒 IMPORTANT: For production, set these environment variables in your hosting platform:**

```bash
# Webinar Fuel Configuration
WEBINAR_FUEL_API_KEY=Dp2kG9Vucpyq5t5RVPqvDxfU
WEBINAR_FUEL_SESSION_TUESDAY=66235
WEBINAR_FUEL_SESSION_SATURDAY=66238
WEBINAR_FUEL_WIDGET_ID=75116
WEBINAR_FUEL_WIDGET_VERSION=126465

# Infusionsoft Configuration
INFUSIONSOFT_ACCOUNT_ID=yv932
INFUSIONSOFT_FORM_XID=2d6fbc78abf8d18ab3268c6cfa02e974
```

**Hosting Platform Setup:**
- **Vercel**: Add variables in Project Settings → Environment Variables
- **Netlify**: Add variables in Site Settings → Environment Variables  
- **GitHub Pages**: Use GitHub Secrets for Actions deployment
- **Other platforms**: Follow their environment variable documentation

### Security

No build process needed! Simply upload all files to any static hosting:

- **Vercel**: Connect GitHub repo or drag & drop files
- **Netlify**: Drag & drop project folder  
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3**: Upload files directly
- **Any web server**: Copy all files to web root

**⚠️ Security Note**: API credentials have fallback values for development but should be set as environment variables for production to prevent exposure.

### Code Quality

Run ESLint:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

## 🌐 Live Site

Visit: https://training.thecashflowacademy.com

## 📝 Recent Updates

- ✅ **Ultra-Simplified Architecture**: Removed build process entirely
- ✅ **Static File Deployment**: No compilation needed, just upload files
- ✅ **95 Dependencies → 95 Dependencies**: Removed Vite and build tools
- ✅ **Zero Vulnerabilities**: Clean, minimal dependency tree
- ✅ **Native ES6 Modules**: Browsers handle module loading directly
- ✅ **Pure Static Files**: Ultimate simplicity and performance

## 🔧 Configuration

### API Configuration

Update `js/config.js` or use environment variables:

- **Webinar Fuel API**: Webinar dates and registration
- **Infusionsoft API**: CRM integration and lead capture

### Customization

- **Countdown Timer**: Modify initial time in `CONFIG.COUNTDOWN`
- **Form Validation**: Customize rules in `form-validator.js`
- **Styling**: Update Tailwind classes in HTML files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
