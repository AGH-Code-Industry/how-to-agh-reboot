import { PageLayout, PageTitle } from '@/components/layout/PageLayout';

export default function Qr() {
  return (
    <PageLayout className="flex size-full flex-col justify-center">
      <PageTitle>Woah!</PageTitle>
      <div className="mb-4 text-center">
        Ten kod QR powinien zostać zeskanowany <span className="font-bold">skanerem</span> w naszej
        aplikacji - prowadzi do niego przycisk na środku paska dolnej nawigacji 😄.
      </div>

      <div className="text-center">
        Zeskanuj kod ponownie i bądź jeden punkt bliżej do otrzymania upominku!
      </div>
    </PageLayout>
  );
}
