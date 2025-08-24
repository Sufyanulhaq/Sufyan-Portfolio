'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft, 
  Mail, 
  Send, 
  CheckCircle, 
  Clock,
  User,
  Phone,
  Globe,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
  Save
} from 'lucide-react'
import Link from 'next/link'

interface ContactForm {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  status: string
  is_read: boolean
  source?: string
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
  response_sent: boolean
  response_sent_at?: string
  notes?: string
}

export default function ContactFormDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [form, setForm] = useState<ContactForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isResponding, setIsResponding] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchContactForm()
    }
  }, [params.id])

  const fetchContactForm = async () => {
    try {
      const response = await fetch(`/api/admin/contact-forms/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setForm(data.form)
        setStatus(data.form.status)
        setNotes(data.form.notes || '')
      }
    } catch (error) {
      console.error('Error fetching contact form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!form) return
    
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/contact-forms/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      })

      if (response.ok) {
        setForm(prev => prev ? { ...prev, status, notes } : null)
        // Mark as read if status is being updated
        if (!form.is_read) {
          await fetch(`/api/admin/contact-forms/${form.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_read: true })
          })
          setForm(prev => prev ? { ...prev, is_read: true } : null)
        }
      }
    } catch (error) {
      console.error('Error updating contact form:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSendResponse = async () => {
    if (!form || !responseMessage.trim()) return
    
    setIsResponding(true)
    try {
      const response = await fetch(`/api/admin/contact-forms/${form.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: responseMessage,
          status: 'responded'
        })
      })

      if (response.ok) {
        setResponseMessage('')
        await fetchContactForm() // Refresh data
        alert('Response sent successfully!')
      }
    } catch (error) {
      console.error('Error sending response:', error)
      alert('Failed to send response')
    } finally {
      setIsResponding(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading contact form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contact Form Not Found</h2>
          <Button asChild>
            <Link href="/admin/contact-forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contact Forms
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/contact-forms">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contact Forms
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Contact Form Details</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Original
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="font-medium">{form.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{form.email}</p>
                  </div>
                </div>
                
                {form.phone && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="font-medium">{form.phone}</p>
                  </div>
                )}

                {form.source && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Source</Label>
                    <p className="font-medium">{form.source}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Inquiry</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{form.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="response">Response Message</Label>
                  <Textarea
                    id="response"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response to the client..."
                    rows={6}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleSendResponse} 
                    disabled={isResponding || !responseMessage.trim()}
                    className="flex-1"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isResponding ? 'Sending...' : 'Send Response'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setResponseMessage('')}
                    disabled={!responseMessage.trim()}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Status & Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <Badge className={getStatusColor(form.status)}>
                    {form.status === 'new' ? 'New' : 
                     form.status === 'in_progress' ? 'In Progress' : 
                     form.status === 'responded' ? 'Responded' : 
                     form.status === 'closed' ? 'Closed' : form.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleStatusUpdate} 
                  disabled={isUpdating}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </CardContent>
            </Card>

            {/* Technical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Submitted</Label>
                  <p className="text-sm">{formatDate(form.created_at)}</p>
                </div>

                {form.updated_at && form.updated_at !== form.created_at && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                    <p className="text-sm">{formatDate(form.updated_at)}</p>
                  </div>
                )}

                {form.response_sent_at && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Response Sent</Label>
                    <p className="text-sm text-green-600">{formatDate(form.response_sent_at)}</p>
                  </div>
                )}

                {form.ip_address && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">IP Address</Label>
                    <p className="text-sm font-mono">{form.ip_address}</p>
                  </div>
                )}

                {form.user_agent && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">User Agent</Label>
                    <p className="text-xs font-mono break-all">{form.user_agent}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Follow-up
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Notes
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
