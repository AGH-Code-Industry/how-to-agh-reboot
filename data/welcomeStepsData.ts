export type WelcomeStep = {
  id: number;
  title: string;
  description: string;
  image?: WelcomeStepImg;
};

export type WelcomeStepImg = {
  id: number;
  src: string;
  width: number;
  height: number;
};

export const welcomeSteps: WelcomeStep[] = [
  {
    id: 1,
    title: 'Witaj w HowToAGH!',
    description:
      'Witaj w naszej aplikacji! Z jej pomocą łatwiej odnajdziesz się na AGH i podczas dni otwartych. Odkryj sekrety uczelni oraz jej najciekawsze miejsca. Nie zwlekaj – zacznij zwiedzanie i dołącz do nas już teraz!',
    image: {
      id: 1,
      src: '/images/welcome.png',
      width: 200,
      height: 130,
    },
  },
  {
    id: 2,
    title: 'Mapa',
    description:
      'Zwiedzaj kampus AGH i odkrywaj nowe miejsca. Dołączaj do tematycznych tras i pogłębiaj swoją wiedzę.',
    image: {
      id: 2,
      src: `https://placehold.co/100x240`,
      width: 100,
      height: 240,
    },
  },
  {
    id: 3,
    title: 'Zadania',
    description:
      'Wykonuj zadania i odblokowuj Nagrody. Zadania są dostępne na mapie. Zadanie zostaje zaliczone po zeskanowaniu odpowiedniego kodu QR.',
    image: {
      id: 3,
      src: `https://placehold.co/100x240`,
      width: 100,
      height: 240,
    },
  },
  {
    id: 4,
    title: 'Skaner',
    description: 'Skanuj kody QR, aby zaliczyć zadania i zdobywać punkty.',
    image: {
      id: 4,
      src: `https://placehold.co/100x240`,
      width: 100,
      height: 240,
    },
  },
  {
    id: 5,
    title: 'Nagrody',
    description:
      'Po zaliczeniu wymaganych zadań odbieraj nagrody. Nagrody do odebrania będą w namiocie.',
    image: {
      id: 5,
      src: `https://placehold.co/100x240`,
      width: 100,
      height: 240,
    },
  },
  {
    id: 6,
    title: 'Zaczynajmy',
    description: 'To już wszystko. Zaczynajmy zwiedzanie!',
  },
];
