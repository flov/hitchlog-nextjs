import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message?: string
}

const logout = async (
  req: NextApiRequest,
  res: NextApiResponse<Data> 
  ) => {
  if (req.method === 'POST') {
    // DESTROY COOKIE
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/'
      })
    )

    res.status(200).json({ message: "Success"})

  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}

export default logout
