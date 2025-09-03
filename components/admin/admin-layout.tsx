'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  Users,
  Mail,
  BarChart3,
  Image as ImageIcon,
  Globe,
  Home,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  Edit3,
  Eye,
  Tag,
  Palette,
  Database,
  TrendingUp,
  MessageSquare,
  Calendar,
  Zap,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    role: string
    avatar?: string
  }
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: 'Posts',
    icon: FileText,
    children: [
      { name: 'All Posts', href: '/admin/posts', icon: FileText },
      { name: 'Add New', href: '/admin/posts/new', icon: Plus },
      { name: 'Categories', href: '/admin/categories', icon: Tag },
    ],
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: ImageIcon,
  },
  {
    name: 'Portfolio',
    icon: FolderOpen,
    children: [
      { name: 'All Projects', href: '/admin/portfolio', icon: FolderOpen },
      { name: 'Add New', href: '/admin/portfolio/new', icon: Plus },
    ],
  },
  {
    name: 'Pages',
    icon: Globe,
    children: [
      { name: 'All Pages', href: '/admin/pages', icon: Globe },
      { name: 'Homepage', href: '/admin/homepage', icon: Home },
    ],
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: Settings,
  },
  {
    name: 'Contact',
    icon: Mail,
    children: [
      { name: 'Messages', href: '/admin/contact-forms', icon: MessageSquare },
      { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
    ],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'SEO',
    href: '/admin/seo',
    icon: TrendingUp,
  },
]

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Posts'])
  const pathname = usePathname()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== '/admin' && pathname.startsWith(href))
  }

  const isParentActive = (children: any[]) => {
    return children.some(child => isActive(child.href))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CMS</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isParentActive(item.children)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <div className={cn(
                        "transform transition-transform",
                        expandedItems.includes(item.name) ? "rotate-90" : ""
                      )}>
                        <span className="text-xs">▶</span>
                      </div>
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                              isActive(child.href)
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <child.icon className="mr-3 h-4 w-4" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive(item.href || '')
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
                  Admin Panel
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user?.name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || 'admin@example.com'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}

