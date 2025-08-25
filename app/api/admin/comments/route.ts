import { NextRequest, NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"
    
    let whereClause = "WHERE 1=1"
    if (status !== "all") {
      whereClause += ` AND c.status = '${status}'`
    }

    const offset = (page - 1) * limit
    
    // Get comments with post information
    const comments = await sql.unsafe(`
      SELECT 
        c.id,
        c.content,
        c.status,
        c.author_name,
        c.author_email,
        c.ip_address,
        c.created_at,
        c.updated_at,
        p.title as post_title,
        p.slug as post_slug,
        p.id as post_id
      FROM cms.comments c
      LEFT JOIN cms.posts p ON c.post_id = p.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    // Get total count for pagination
    const countResult = await sql.unsafe(`
      SELECT COUNT(*) as total 
      FROM cms.comments c
      ${whereClause}
    `)

    const totalComments = parseInt(countResult[0].total)
    const totalPages = Math.ceil(totalComments / limit)

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      status: comment.status,
      author: {
        name: comment.author_name,
        email: comment.author_email
      },
      post: comment.post_id ? {
        id: comment.post_id,
        title: comment.post_title,
        slug: comment.post_slug
      } : null,
      ipAddress: comment.ip_address,
      createdAt: comment.created_at?.toISOString(),
      updatedAt: comment.updated_at?.toISOString()
    }))

    return NextResponse.json({
      success: true,
      comments: formattedComments,
      pagination: {
        page,
        limit,
        total: totalComments,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, commentId, status, content, authorName, authorEmail, postId } = body

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    if (action === "updateStatus" && commentId && status) {
      // Update comment status
      await sql`
        UPDATE cms.comments 
        SET status = ${status}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${commentId}
      `

      // Log the activity
      await sql`
        INSERT INTO cms.activity_logs (
          user_id, action, table_name, record_id, new_values
        ) VALUES (
          ${session.id}, 'update', 'comments', ${commentId}, 
          ${JSON.stringify({ status, updated_by: session.name })}
        )
      `

      return NextResponse.json({
        success: true,
        message: `Comment ${status} successfully`
      })

    } else if (action === "create" && content && authorName && authorEmail && postId) {
      // Create new comment
      const result = await sql`
        INSERT INTO cms.comments (
          content, author_name, author_email, post_id, status
        ) VALUES (
          ${content}, ${authorName}, ${authorEmail}, ${postId}, 'pending'
        ) RETURNING id
      `

      const commentId = result[0].id

      // Log the activity
      await sql`
        INSERT INTO cms.activity_logs (
          user_id, action, table_name, record_id, new_values
        ) VALUES (
          ${session.id}, 'create', 'comments', ${commentId}, 
          ${JSON.stringify({ content, author_name: authorName, created_by: session.name })}
        )
      `

      return NextResponse.json({
        success: true,
        message: "Comment created successfully",
        commentId
      })

    } else {
      return NextResponse.json(
        { error: "Invalid action or missing required fields" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Error processing comment:", error)
    return NextResponse.json(
      { error: "Failed to process comment" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get("id")

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Get comment details for logging
    const comment = await sql`
      SELECT * FROM cms.comments WHERE id = ${commentId} LIMIT 1
    `

    if (comment.length === 0) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      )
    }

    // Delete the comment
    await sql`
      DELETE FROM cms.comments WHERE id = ${commentId}
    `

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, old_values
      ) VALUES (
        ${session.id}, 'delete', 'comments', ${commentId}, 
        ${JSON.stringify({ ...comment[0], deleted_by: session.name })}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    )
  }
}