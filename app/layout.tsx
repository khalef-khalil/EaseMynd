import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpenIcon, ChartBarIcon, ListBulletIcon, ClockIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EaseMynd - Personal Life Guidance",
  description: "Track your principles and habits for personal growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-50")}>
        <div className="min-h-screen flex flex-col">
          {/* Desktop Header */}
          <header className="hidden sm:block bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link href="/" className="flex items-center px-2 py-2 text-gray-900 font-semibold text-lg">
                    EaseMynd
                  </Link>
                  <div className="ml-8 flex space-x-4">
                    <Link
                      href="/principles"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-50"
                    >
                      <BookOpenIcon className="h-5 w-5 mr-1.5" />
                      Principles
                    </Link>
                    <Link
                      href="/habits"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-50"
                    >
                      <ChartBarIcon className="h-5 w-5 mr-1.5" />
                      Habits
                    </Link>
                    <Link
                      href="/tasks"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-50"
                    >
                      <ListBulletIcon className="h-5 w-5 mr-1.5" />
                      Tasks
                    </Link>
                    <Link
                      href="/focus"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-50"
                    >
                      <ClockIcon className="h-5 w-5 mr-1.5" />
                      Focus
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </header>

          {/* Mobile Header */}
          <header className="sm:hidden bg-white shadow-sm">
            <div className="h-14 flex items-center justify-center">
              <h1 className="text-lg font-semibold text-gray-900">EaseMynd</h1>
            </div>
          </header>

          <main className="flex-1 py-6 pb-20 sm:pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          {/* Desktop Footer */}
          <footer className="hidden sm:block bg-white">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                EaseMynd - Your Personal Life Guidance App
              </p>
            </div>
          </footer>

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
