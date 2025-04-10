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
  border?: string;
};

export const welcomeSteps: WelcomeStep[] = [
  {
    id: 1,
    title: 'Witaj w HowToAGH!',
    description:
      'Witaj w naszej aplikacji! Z jej pomocą łatwiej odnajdziesz się na AGH i podczas Dni Otwartych. Odkryj sekrety Uczelni oraz jej najciekawsze miejsca. Nie zwlekaj – zacznij zwiedzanie i dołącz do nas już teraz!',
    image: {
      id: 1,
      src: '/images/welcome/howtoagh_small.webp',
      width: 200,
      height: 160,
    },
  },
  {
    id: 2,
    title: 'Twórcy',
    description:
      'Aplikacja została stworzona przez Koło Naukowe AGH Code Industry, we współpracy z Wydziałem EAIiIB. Jeśli chcielibyście w przyszłości pomóc tworzyć podobne inicjatywy, zachęcamy do studiowania na AGH i dołączeniu w nasze szeregi 😉',
    image: {
      id: 2,
      src: `/images/welcome/authors.webp`,
      width: 200,
      height: 100,
    },
  },
  {
    id: 3,
    title: 'Mapa',
    description:
      'Zwiedzaj kampus AGH i odkrywaj nowe miejsca. Wybierz interesujące Cię pokazy i dostosuj ścieżkę zwiedzania pod swoje potrzeby.',
    image: {
      id: 3,
      src: `/images/welcome/map.webp`,
      width: 270,
      height: 189,
    },
  },
  {
    id: 4,
    title: 'Wydarzenia',
    description:
      'Przeglądaj wszystkie dostępne wydarzenia oraz ustaw przypomnienia, aby nie ominąć pokazu.',
    image: {
      id: 4,
      src: `/images/welcome/events.webp`,
      width: 270,
      height: 262,
      border: '1px solid lightgray',
    },
  },
  {
    id: 5,
    title: 'Skaner',
    description:
      'Skanuj kody QR dostępne po zakończeniu wydarzeń, aby zbierać punkty i wymieniać je na upominki!',
    image: {
      id: 5,
      src: `/images/welcome/qr.webp`,
      width: 200,
      height: 200,
    },
  },
  {
    id: 6,
    title: 'Nagrody',
    description:
      'Po odwiedzeniu wymaganej ilości pokazów i zeskanowaniu kodów, upominki będą możliwe do odebrania w budynku B1 do godziny 14:45 - szukaj znacznika medalu na mapie.',
    image: {
      id: 6,
      src: `/images/welcome/reward.webp`,
      width: 270,
      height: 140,
      border: '1px solid lightgray',
    },
  },
  {
    id: 7,
    title: 'Ustawienia',
    description:
      'Jeśli chcesz ponownie odtworzyć ten samouczek lub zmienić sposób działania aplikacji, skorzystaj z sekcji ustawień.',
    image: {
      id: 7,
      src: `/images/welcome/settings.webp`,
      width: 270,
      height: 230,
      border: '1px solid lightgray',
    },
  },
  {
    id: 8,
    title: 'Logowanie',
    description:
      'Jeśli nie chcesz utracić postępu, zachęcamy do zalogowania się - sekcje tą również znajdziesz w ustawieniach.',
    image: {
      id: 8,
      src: `/images/welcome/login.webp`,
      width: 270,
      height: 105,
      border: '1px solid lightgray',
    },
  },
  {
    id: 9,
    title: 'Zaczynajmy!',
    description: 'To już wszystko. Życzymy dobrej zabawy i udanego Dnia Otwartego!',
  },
];
