'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff,
  Plus,
  X,
  User,
  Shield,
  Mail,
  Phone,
  Globe,
  MapPin,
  Link as LinkIcon,
  Settings
} from 'lucide-react'
import Link from 'next/link'

interface UserData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  role: string
  is_active: boolean
  is_verified: boolean
  bio: string
  location: string
  website: string
  avatar_url: string
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  preferences: {
    email_notifications: boolean
    two_factor_auth: boolean
    theme: string
  }
}

const roleOptions = [
  { value: 'admin', label: 'Administrator', description: 'Full system access and control' },
  { value: 'editor', label: 'Editor', description: 'Content management and editing' },
  { value: 'author', label: 'Author', description: 'Create and manage content' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'moderator', label: 'Moderator', description: 'Content moderation and user management' }
]

const themeOptions = [
  { value: 'light', label: 'Light Theme' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'auto', label: 'Auto (System)' }
]

export default function NewUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' })
  
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'viewer',
    is_active: true,
    is_verified: false,
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
    social_links: {},
    preferences: {
      email_notifications: true,
      two_factor_auth: false,
      theme: 'auto'
    }
  })

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: keyof UserData['preferences'], value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }))
  }

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setUserData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [newSocialLink.platform.toLowerCase()]: newSocialLink.url
        }
      }))
      setNewSocialLink({ platform: '', url: '' })
    }
  }

  const removeSocialLink = (platform: string) => {
    setUserData(prev => {
      const newSocialLinks = { ...prev.social_links }
      delete newSocialLinks[platform as keyof typeof newSocialLinks]
      return { ...prev, social_links: newSocialLinks }
    })
  }

  const handleSubmit = async () => {
    if (!userData.name || !userData.email || !userData.password) {
      alert('Please fill in required fields')
      return
    }

    if (userData.password !== userData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (userData.password.length < 8) {
      alert('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual API call to create user
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('User created successfully!')
      router.push('/admin/users')
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleDescription = () => {
    const role = roleOptions.find(r => r.value === userData.role)
    return role?.description || ''
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'author': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      case 'moderator': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to User Management
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Create New User</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={userData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Minimum 8 characters"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={userData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select 
                      value={userData.role} 
                      onValueChange={(value) => handleInputChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {getRoleDescription()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={userData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    value={userData.avatar_url}
                    onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                          <LinkIcon className="h-5 w-5" />
                          Social Links
                        </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      value={newSocialLink.platform}
                      onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                      placeholder="e.g., GitHub, LinkedIn"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addSocialLink}
                  disabled={!newSocialLink.platform || !newSocialLink.url}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Social Link
                </Button>
                
                {Object.keys(userData.social_links).length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Social Links</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(userData.social_links).map(([platform, url]) => (
                        <Badge key={platform} variant="secondary" className="gap-1">
                          {platform}
                          <button
                            onClick={() => removeSocialLink(platform)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active Account</Label>
                  <Switch
                    id="is_active"
                    checked={userData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_verified">Email Verified</Label>
                  <Switch
                    id="is_verified"
                    checked={userData.is_verified}
                    onCheckedChange={(checked) => handleInputChange('is_verified', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                  <Switch
                    id="email_notifications"
                    checked={userData.preferences.email_notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="two_factor_auth">Two-Factor Auth</Label>
                  <Switch
                    id="two_factor_auth"
                    checked={userData.preferences.two_factor_auth}
                    onCheckedChange={(checked) => handlePreferenceChange('two_factor_auth', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Preference</Label>
                  <Select 
                    value={userData.preferences.theme} 
                    onValueChange={(value) => handlePreferenceChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themeOptions.map(theme => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Role Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Role Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(userData.role)}>
                      {userData.role.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <p><strong>Permissions:</strong></p>
                    {userData.role === 'admin' && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Full system access</li>
                        <li>• User management</li>
                        <li>• Content management</li>
                        <li>• System settings</li>
                      </ul>
                    )}
                    {userData.role === 'editor' && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Content editing</li>
                        <li>• Media management</li>
                        <li>• Limited user access</li>
                      </ul>
                    )}
                    {userData.role === 'author' && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Create content</li>
                        <li>• Edit own content</li>
                        <li>• Basic media access</li>
                      </ul>
                    )}
                    {userData.role === 'viewer' && (
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Read-only access</li>
                        <li>• View content</li>
                        <li>• No editing rights</li>
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
