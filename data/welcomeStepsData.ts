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
    title: 'Personalizacja',
    description: 'Dostosuj ustawienia konta do swoich potrzeb.',
  },
  {
    id: 3,
    title: 'Gotowe do działania!',
    description: 'Możesz teraz zacząć korzystać z aplikacji.',
  },
];
