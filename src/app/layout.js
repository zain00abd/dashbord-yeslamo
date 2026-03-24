import "./globals.css";
import BottomNav from "./components/BottomNav";

export const metadata = {
  title: "يسلمو - توصيل الطلبات",
  description: "نوصلك كل ما تحتاجه من متاجرك المفضلة إلى باب منزلك بسرعة وأمان",
  icons: {
    icon: "/logo1.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
