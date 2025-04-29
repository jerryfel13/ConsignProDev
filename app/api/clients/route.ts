import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'https://lwphsims-uat.up.railway.app';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Try to get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!token) {
      return NextResponse.json({ status: { success: false, message: 'No auth token found' } }, { status: 401 });
    }

    const response = await axios.post(
      `${API_BASE_URL}/clients`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { status: { success: false, message: error?.response?.data?.status?.message} },
      { status: error?.response?.status || 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Forward query params
    const url = new URL(req.url);
    const params = url.searchParams.toString();
    // Try to get the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const apiUrl = `${API_BASE_URL}/clients${params ? `?${params}` : ''}`;
    const response = await axios.get(apiUrl, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { status: { success: false, message: error?.response?.data?.status?.message } },
      { status: error?.response?.status || 500 }
    );
  }
} 