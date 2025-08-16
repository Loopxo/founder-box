"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "Proposals",
      href: "/",
      icon: "📋",
      active: pathname === "/",
    },

    {
      label: "Cold Emails",
      href: "/cold-emails",
      icon: "🧾",
      active: pathname === "/cold-emails",
    },

    {
      label: "SEO",
      href: "/seo",
      icon: "🧾",
      active: pathname === "/seo",
    },

    {
      label: "Social Media Content",
      href: "/social-media-content",
      icon: "📝",
      active: pathname === "/social-media-content",
    },

    {
      label: "Competitive Analysis",
      href: "/competitive-analysis",
      icon: "📝",
      active: pathname === "/competitive-analysis",
    },

     {
      label: "Sales",
      href: "/sales",
      icon: "🧾",
      active: pathname === "/sales",
    },

    {
      label: "Invoices",
      href: "/invoice",
      icon: "🧾",
      active: pathname === "/invoice",
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img src="/logo.png" alt="FounderBox" className="h-6 w-auto" />
            <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-blue-800 bg-clip-text text-transparent">
              FounderBox
            </span>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    item.active
                      ? "bg-gradient-to-r from-red-600 to-blue-800 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-xs">{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Status */}
          <div className="text-xs text-gray-500 hidden md:block">v1.0 Beta</div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors
                  ${
                    item.active
                      ? "bg-gradient-to-r from-red-600 to-blue-800 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Status */}
            <div className="px-3 py-2 text-xs text-gray-500 border-t mt-2">
              FounderBox v1.0 Beta
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
