import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { API_URL } from '../../src/config';

type Data = { token?: string; message?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Making a post request to hit our backend api-endpoint
    const apiRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await apiRes.json();

    if (apiRes.ok) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', String(data.token), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: 'strict',
          path: '/',
        })
      );
      res.status(200).json({ token: data.token });
      // res.status(200).json({ name: 'John Doe' })
    } else {
      res.status(data.statusCode).json({ message: data.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
