export const metadata = {
  manifest: "/manifest-driver.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "يسلمو Driver",
  },
  icons: {
    icon: [
      { url: "/icons/driver-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/driver-icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/driver-icon-192x192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/icons/driver-icon-192x192.png",
  },
};

export const viewport = {
  themeColor: "#0ea5e9",
};

export default function DriverLayout({ children }) {
  return children;
}
