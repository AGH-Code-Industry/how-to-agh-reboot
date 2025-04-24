import { X } from 'lucide-react';
import ScreenOverlay from '../global/ScreenOverlay';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import ImageWithPlaceholder from '../global/ImageWithPlaceholder';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FaDiscord } from '@react-icons/all-files/fa/FaDiscord';
import { FaFacebookF } from '@react-icons/all-files/fa/FaFacebookF';
import { FaLink } from '@react-icons/all-files/fa/FaLink';
import { cn } from '@/lib/utils';

type AboutUsOverlayProps = {
  visible: boolean;
  onClose: () => void;
};

export default function AboutUsOverlay({ visible, onClose }: AboutUsOverlayProps) {
  if (!visible) return null;

  return (
    <ScreenOverlay>
      <Card className="relative flex size-full flex-col gap-y-4 p-6">
        <CardHeader className="m-0 p-0">
          <button
            onClick={onClose}
            className="flex justify-end"
            data-testid="close-about-us-overlay"
          >
            <X size={24} />
          </button>
        </CardHeader>
        <CardContent className="flex grow flex-col items-center justify-start gap-y-10 overflow-y-auto p-1 text-center">
          <SectionTitle title="O nas" className="text-2xl" />
          <AboutUsInfo />
          <SectionTitle title="Partnerzy" />
          <Partners />
        </CardContent>
        <CardFooter className="flex w-full p-0">
          <Button onClick={onClose} className="w-full">
            Zamknij
          </Button>
        </CardFooter>
      </Card>
    </ScreenOverlay>
  );
}

function SectionTitle({ title, className }: { title: string; className?: string }) {
  return <h2 className={cn('text-lg font-bold', className)}>{title}</h2>;
}

function AboutUsInfo() {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex flex-col items-center">
        <ImageWithPlaceholder src="/images/COINLogo.png" alt="COIN logo" width={72} height={72} />
        <p className="text-xl font-bold">AGH Code Industry</p>
      </div>
      <p className="text-pretty text-sm">Dołącz do naszej społeczności już teraz!</p>
      <SocialLinks />
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex w-full flex-row justify-center gap-x-8">
      <AboutUsLink href="https://coin.agh.edu.pl/">
        <FaLink size={24} />
      </AboutUsLink>
      <AboutUsLink href="https://www.facebook.com/aghcodeindustry">
        <FaFacebookF size={24} />
      </AboutUsLink>
      <AboutUsLink href="https://discord.gg/HMRDDby8Aa">
        <FaDiscord size={24} />
      </AboutUsLink>
    </div>
  );
}

function Partners() {
  return (
    <div className="flex flex-col items-center gap-y-6">
      <div className="flex flex-row items-center gap-x-4">
        <ImageWithPlaceholder
          src="/images/eaiiibLogo.png"
          alt="EAIiIB logo"
          width={64}
          height={64}
        />
        <p className="text-xl font-bold">Wydział EAIiIB</p>
      </div>
      <div className="flex w-full flex-row justify-center gap-x-8">
        <AboutUsLink href="https://www.eaiib.agh.edu.pl/">
          <FaLink size={24} />
        </AboutUsLink>
        <AboutUsLink href="https://www.facebook.com/EAIiIBAGH/timeline?filter=3">
          <FaFacebookF size={24} />
        </AboutUsLink>
      </div>
    </div>
  );
}

type AboutUsLinkProps = {
  href: string;
  children: React.ReactNode;
};

function AboutUsLink({ href, children }: AboutUsLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex flex-col items-center justify-center gap-1 rounded-full bg-foreground p-3 text-xs text-background transition-colors"
      prefetch={true}
    >
      {children}
    </Link>
  );
}
