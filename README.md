
# Le Délice Moderne - Restaurant Management Application

A modern, full-featured restaurant management application built with React, TypeScript, and Tailwind CSS. This application provides a complete solution for restaurant operations including customer ordering, admin management, and user dashboards.

## 🌟 Features

### Customer Features
- **Browse Menu**: Categorized menu with filtering and search capabilities
- **Order Management**: Add items to cart, customize orders, and track order status
- **User Dashboard**: View order history, loyalty points, and activity logs
- **Special Offers**: Browse and order special deals and combo offers
- **Authentication**: Secure login and registration system
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Features
- **Order Management**: View, accept, update, and track all orders in real-time
- **Dashboard Analytics**: Overview of sales, revenue, and key metrics
- **User Management**: View customer information and order history
- **Menu Management**: Add, edit, and manage menu items and categories
- **Real-time Updates**: Synchronized order status between admin and customers

### Technical Features
- **State Management**: Centralized state with Zustand
- **Persistent Storage**: Local storage for user sessions and cart data
- **Activity Tracking**: Comprehensive logging of user actions
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resto-menu-magic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 📱 Usage

### For Customers
1. Browse the menu by categories or search for specific items
2. Add items to your cart with customization options
3. Create an account or log in to place orders
4. Track your order status in real-time
5. View your order history and loyalty points in the dashboard

### For Administrators
1. Access the admin panel via the settings icon in the footer
2. Login with credentials: `admin` / `admin123`
3. Monitor incoming orders and update their status
4. View analytics and customer information
5. Manage menu items and special offers

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin-specific components
│   ├── user/           # User dashboard components
│   └── offer/          # Special offer components
├── pages/              # Page components
├── store/              # State management
│   ├── types.ts        # TypeScript type definitions
│   └── useStore.ts     # Main Zustand store
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── data/               # Mock data and constants
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **Zustand** - State management
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build tool

## 🔧 Configuration

### Environment Variables
The application currently runs with mock data. For production deployment, you may want to configure:
- API endpoints
- Authentication providers
- Payment gateways
- Email services

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.ts`
- **Restaurant Info**: Update restaurant details in the components
- **Menu Data**: Replace mock data with real menu information

## 📋 API Integration

The application is currently built with mock data and local state management. For production use, you can:

1. **Replace mock data** with real API calls
2. **Add authentication** with services like Auth0 or Firebase
3. **Integrate payment** processing with Stripe or PayPal
4. **Add real-time features** with WebSockets or Server-Sent Events

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- **Real-time notifications** for order updates
- **Multi-language support** (French, English, Arabic)
- **Payment integration** for online payments
- **Inventory management** for menu items
- **Advanced analytics** and reporting
- **Mobile app** version
- **Kitchen display system** for order management

---

**Developed by NewTech Solutions** - Building modern solutions for restaurants
