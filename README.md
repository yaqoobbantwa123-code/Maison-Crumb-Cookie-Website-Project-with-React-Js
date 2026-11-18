
# MAISON CRUMB
### The Art of Perfect Cookies.

A premium, modern and interactive cookie e-commerce experience crafted to bring the elegance of artisanal baking into the digital world.

MAISON CRUMB is a luxury-inspired cookie brand website focused on sophisticated design, immersive animations, interactive product experiences and a smooth shopping journey.

---

## Overview

MAISON CRUMB combines elegant visual storytelling with modern frontend technologies to create an engaging digital storefront for a premium cookie brand.

The project focuses on delivering more than a traditional e-commerce interface. It aims to provide an immersive brand experience through sophisticated GSAP animations, interactive product presentations and a realistic Matter.js-powered cookie physics experience.

From exploring cookie collections to interacting with the animated cookie pouch, every detail is designed around a refined and premium user experience.

---

## Key Features

### 1. Premium User Interface
- Modern luxury-inspired design.
- Elegant typography and carefully balanced layouts.
- Sophisticated color palette and visual styling.
- Responsive layouts across desktop, tablet and mobile.
- Dark and light theme support.
- Consistent brand identity throughout the website.

### 2. Advanced GSAP Animations
- Sophisticated page-load animations.
- Animated hero section and typography reveals.
- Scroll-triggered section transitions.
- Staggered product card animations.
- Smooth image reveal effects.
- Elegant hover interactions and micro-animations.
- Animated navigation and interactive elements.
- Smooth page transitions.
- Refined visual storytelling throughout the website.

### 3. Interactive Matter.js Cookie Experience
An interactive cookie-bag experience designed to bring physical interaction into the website.

- Physics-based cookie movement.
- Natural gravity and collision behavior.
- Interactive cookie dragging.
- Mouse and touch interaction.
- Realistic cookie stacking and settling.
- Open-top cookie pouch interaction.
- Scroll-independent physics simulation.

### 4. E-Commerce Experience
- Product collections and browsing.
- Product detail presentation.
- Shopping cart interface.
- Add-to-cart interactions.
- Wishlist functionality.
- Product quantity controls.
- Checkout interface.
- Order experience and tracking UI.

*Payment processing and backend-dependent functionality require their respective integrations.*

### 5. Responsive Experience
- Desktop-first premium presentation.
- Tablet and mobile optimization.
- Responsive navigation.
- Touch-friendly interactions.
- Adaptive animation behavior.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Component-based frontend development |
| Vite | Development environment and build tooling |
| JavaScript (ES6+) | Application logic |
| Tailwind CSS | Utility-first styling |
| CSS3 | Custom styling and visual effects |
| GSAP | Advanced animations |
| GSAP ScrollTrigger | Scroll-based animation sequences |
| Matter.js | 2D physics simulation |
| React Router | Client-side navigation |

---

## Animation & Interaction

MAISON CRUMB uses GSAP to create sophisticated motion experiences throughout the interface.

### GSAP
GSAP is used for:
- Timeline-based animation sequences.
- Text and image reveals.
- Scroll-triggered transitions.
- Staggered content animations.
- Interactive hover effects.
- Page and section transitions.

### Matter.js
Matter.js powers the interactive cookie physics experience.

The physics system is designed around:
- Gravity.
- Collision detection.
- Friction and restitution.
- Angular movement.
- Cookie stacking.
- Mouse-based interaction.
- Touch-based interaction.

The goal is to make cookies behave naturally inside an open-top pouch while keeping the physics simulation independent of normal page scrolling.

---

## Project Structure

The project follows a component-based React architecture.

```text
MAISON-CRUMB/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── ProductCard/
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Shop/
│   │   ├── ProductDetails/
│   │   ├── Cart/
│   │   ├── Wishlist/
│   │   ├── About/
│   │   └── Contact/
│   │
│   ├── animations/
│   │   └── ...
│   │
│   ├── physics/
│   │   └── ...
│   │
│   ├── hooks/
│   ├── context/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

*The structure above illustrates the intended organization. Actual folders and filenames may differ depending on the existing implementation.*

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd MAISON-CRUMB
```

### 3. Install Dependencies

```bash
npm install
```

If the required packages are not already included in the project, install them using:

```bash
npm install gsap matter-js react-router
```

### 4. Start the Development Server

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

### 5. Create a Production Build

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

---

## Performance & Optimization

The project aims to maintain a smooth and responsive experience through:

- Optimized animation sequences.
- Efficient DOM updates.
- Scoped GSAP animations.
- Proper animation cleanup.
- Controlled physics simulation.
- Responsive image handling.
- Reduced unnecessary re-renders.
- Mobile-friendly interactions.
- Reduced-motion accessibility support.

---

## Design Philosophy

MAISON CRUMB follows a luxury-first digital design philosophy.

The experience is built around three core principles:

**Elegance**

A sophisticated visual identity with refined typography, premium layouts and carefully selected design details.

**Interaction**

Meaningful interactions and immersive animations that make the website engaging without overwhelming the user.

**Experience**

A smooth, responsive and intuitive journey that connects product discovery with the personality of the brand.

---

## Future Improvements

Potential future enhancements include:

- Full backend integration.
- Database-driven product management.
- Secure user authentication.
- Real payment gateway integration.
- Order management and tracking.
- Customer accounts.
- Product reviews and ratings.
- Advanced inventory management.
- Enhanced 3D product experiences.

---

## Project Status

**Development:** Ongoing

MAISON CRUMB is an evolving frontend project. Features, animations, physics interactions and performance are continuously being refined to achieve a polished production-quality experience.

---

## Author

**Shamir Yaqoob**

Full Stack Developer

- GitHub: https://github.com/yaqoobbantwa123-code
- LinkedIn: https://www.linkedin.com/in/shamir-bantwa-4b1690395/

---

## License

This project is currently intended for personal portfolio and educational purposes.

All rights to original branding, custom design assets and project content remain with their respective owners.

---

<p align="center">
  <strong>MAISON CRUMB</strong><br/>
  The Art of Perfect Cookies.
  <br/><br/>
  Crafted with creativity, technology and attention to detail.
</p>
```
