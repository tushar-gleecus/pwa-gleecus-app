import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url, created_at } = req.body;
  const { error } = await supabase.from('submissions').insert({
    text: '',
    image_url: url,
    synced: true,
    created_at,
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
