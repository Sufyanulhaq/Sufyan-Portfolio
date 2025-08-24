import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

export async function GET() {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get basic counts with error handling
    const [postsCount, portfolioCount, servicesCount, contactFormsCount, unreadMessages] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.posts WHERE status = 'published'`.catch(() => [{ count: '0' }]),
      sql`SELECT COUNT(*) FROM cms.portfolio WHERE status = 'published'`.catch(() => [{ count: '0' }]),
      sql`SELECT COUNT(*) FROM cms.services WHERE status = 'active'`.catch(() => [{ count: '0' }]),
      sql`SELECT COUNT(*) FROM cms.contact_forms`.catch(() => [{ count: '0' }]),
      sql`SELECT COUNT(*) FROM cms.contact_forms WHERE is_read = FALSE`.catch(() => [{ count: '0' }])
    ])

    // Get recent activity with error handling
    const recentActivity = await sql`
      SELECT 
        al.action,
        al.table_name,
        al.record_id,
        al.new_values,
        al.created_at,
        u.name as user_name
      FROM cms.activity_logs al
      LEFT JOIN cms.users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `.catch(() => [])

    // Get contact form trends with error handling
    const contactTrends = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM cms.contact_forms 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `.catch(() => [])

    return NextResponse.json({
      success: true,
      data: {
        postsCount: parseInt(postsCount[0]?.count || '0'),
        portfolioCount: parseInt(portfolioCount[0]?.count || '0'),
        servicesCount: parseInt(servicesCount[0]?.count || '0'),
        contactFormsCount: parseInt(contactFormsCount[0]?.count || '0'),
        unreadMessages: parseInt(unreadMessages[0]?.count || '0'),
        recentActivity: recentActivity.map(activity => ({
          ...activity,
          created_at: activity.created_at?.toISOString()
        })),
        contactTrends: contactTrends.map(trend => ({
          ...trend,
          date: trend.date?.toISOString()
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data',
      data: {
        postsCount: 0,
        portfolioCount: 0,
        servicesCount: 0,
        contactFormsCount: 0,
        unreadMessages: 0,
        recentActivity: [],
        contactTrends: []
      }
    }, { status: 500 })
  }
}
