# Rhubarb Landing Page

A modern, responsive landing page for **Rhubarb** (Rural Health Bridge) - a platform connecting rural healthcare facilities with healthcare professionals and founding members.

![Rhubarb Landing Page](public/vite.svg)

## 🌟 Features

### 🎯 **Multi-Audience Design**
- **Healthcare Facilities**: Pricing tiers, ROI examples, and project management tools
- **Healthcare Professionals**: Membership tiers, earnings potential, and career development
- **Founding Members**: Equity opportunities, compensation details, and application process

### 🎨 **Rhubarb-Themed Design**
- Custom rhubarb color palette (red, green, brown, cream)
- Responsive design for mobile and desktop
- Professional typography and visual hierarchy
- Consistent branding throughout

### 🎪 **Interactive Walker Animation**
- **Animated Rhubarb Character**: Walking animation across the footer
- **Direction Control**: Click to reverse direction with spin animation
- **Smart Behavior**: Pause/resume on user activity
- **Responsive**: Adapts to different screen sizes
- **Direction-Specific Images**: Different character sprites for left-to-right and right-to-left

### 📱 **Modern Web Features**
- **Smooth Scrolling**: Enhanced navigation with tab activation
- **Tabbed Interface**: Seamless switching between audience sections
- **Responsive Grid Layouts**: Optimized for all devices
- **Interactive Components**: Hover effects, animations, and transitions

## 🚀 **Live Demo**

- **Development**: http://localhost:5174
- **Production Preview**: http://localhost:4173

## 🛠️ **Technologies Used**

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Vite
- **Architecture**: Web Components (Custom Elements)
- **Animation**: CSS Animations + JavaScript
- **Design**: Mobile-first responsive design

## 📁 **Project Structure**

```
rhubarblandingpage/
├── public/                     # Static assets
│   ├── vite.svg               # Vite logo
│   ├── rhubarb-body.png       # Walker body image (right-to-left)
│   ├── left-rhubarb-body.png  # Walker body image (left-to-right)
│   ├── rhubarb-leg-left.png   # Left leg image
│   └── rhubarb-leg-right.png  # Right leg image
├── src/                       # Source code
│   ├── main.js               # Main application logic
│   ├── style.css             # Rhubarb-themed styles
│   ├── rhubarb-walker.js     # Walker animation component
│   └── counter.js            # Vite template counter
├── index.html                # Main HTML file
├── package.json              # Project dependencies
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## 🎮 **Walker Animation**

The animated rhubarb character is implemented as a custom Web Component with the following features:

### **Features**
- **Walking Animation**: Smooth left-to-right and right-to-left movement
- **Interactive Control**: Click character to reverse direction
- **Direction-Specific Sprites**: Different body images for each direction
- **Spin Animation**: Visual feedback when direction changes
- **Smart Pause**: Pauses during user inactivity (3 seconds)
- **Responsive Positioning**: Adapts to different screen sizes

### **Usage**
```html
<rhubarb-walker></rhubarb-walker>
```

### **Customization**
The walker positioning can be adjusted in `src/rhubarb-walker.js`:

```javascript
// Left-to-right direction positioning
body.style.left = '50%';
body.style.transform = 'translateX(-50%)';
leftLeg.parentElement.style.left = '50%';
leftLeg.parentElement.style.transform = 'translateX(-50%)';

// Right-to-left direction positioning  
body.style.left = '52%';
body.style.transform = 'translateX(-52%)';
leftLeg.parentElement.style.left = '49%';
leftLeg.parentElement.style.transform = 'translateX(-49%)';
```

## 🏃‍♂️ **Getting Started**

### **Prerequisites**
- Node.js (version 14 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rhubarblandingpage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📊 **Performance**

### **Bundle Sizes** (Production Build)
- **JavaScript**: 16.01 kB (gzipped: 4.01 kB)
- **CSS**: 13.87 kB (gzipped: 2.76 kB)
- **HTML**: 51.13 kB (gzipped: 10.16 kB)

### **Optimization Features**
- Vite's automatic code splitting
- CSS purging and minification
- JavaScript tree shaking
- Asset optimization
- Gzip compression

## 🎨 **Design System**

### **Color Palette**
- **Rhubarb Red**: `#C73E3A` (Primary brand color)
- **Rhubarb Green**: `#4A7C59` (Secondary brand color)
- **Rhubarb Brown**: `#8B7355` (Accent color)
- **Rhubarb Cream**: `#F5F1E8` (Background color)
- **Rhubarb Dark**: `#2C2C2C` (Text color)

### **Typography**
- **Font Family**: Inter (with fallbacks)
- **Responsive Scaling**: Mobile-optimized font sizes
- **Visual Hierarchy**: Clear heading and paragraph structure

### **Spacing System**
- **Base Unit**: 1rem (16px)
- **Consistent Margins/Padding**: 0.5rem, 1rem, 1.5rem, 2rem, 3rem
- **Responsive Breakpoints**: 768px (tablet), 480px (mobile)

## 🔧 **Development**

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter (if configured)

### **Development Features**
- **Hot Module Replacement**: Instant updates during development
- **Source Maps**: Easy debugging
- **Fast Refresh**: React-style component updates
- **Error Overlay**: Clear error messages and stack traces

## 📱 **Browser Support**

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: CSS Grid, Flexbox, Custom Properties, Web Components

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- **Vite Team**: For the excellent build tool
- **Inter Font**: For the beautiful typography
- **Healthcare Community**: For inspiration and feedback
- **Rhubarb Character**: Custom-designed animation assets

## 📞 **Contact**

For questions, suggestions, or contributions, please open an issue or contact the development team.

---

**Built with ❤️ for rural healthcare communities**