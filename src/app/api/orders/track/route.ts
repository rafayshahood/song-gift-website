import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracking_id } = body;

    // Validate required field
    if (!tracking_id) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    // Validate tracking ID format (should be SG-XXXXXXXX)
    const trackingIdPattern = /^SG-[A-Z0-9]{8}$/;
    if (!trackingIdPattern.test(tracking_id)) {
      return NextResponse.json(
        { error: 'Invalid tracking ID format. Should be SG-XXXXXXXX' },
        { status: 400 }
      );
    }

    console.log('Looking up order with tracking ID:', tracking_id);

    // Query Supabase orders table
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('tracking_id, order_status, expected_delivery_at, created_at')
      .eq('tracking_id', tracking_id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - order not found
        console.log('Order not found:', tracking_id);
        return NextResponse.json(
          { 
            error: 'Order not found',
            message: 'We couldn\'t find an order with that tracking ID. Please check your tracking ID and try again.'
          },
          { status: 404 }
        );
      }

      // Other database error
      console.error('Database error while looking up order:', error);
      return NextResponse.json(
        { error: 'Unable to look up order. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Order found:', {
      tracking_id: order.tracking_id,
      order_status: order.order_status,
      created_at: order.created_at
    });

    // Return order information (excluding sensitive data)
    return NextResponse.json({
      tracking_id: order.tracking_id,
      order_status: order.order_status,
      expected_delivery_at: order.expected_delivery_at,
      created_at: order.created_at
    });

  } catch (error) {
    console.error('Track order API error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}
