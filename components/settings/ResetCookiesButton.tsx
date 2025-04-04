'use client';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

export default function ResetCookiesButton() {
  return <Button onClick={() => Cookies.remove('seen_welcome')}>Resetuj ciasteczka</Button>;
}
