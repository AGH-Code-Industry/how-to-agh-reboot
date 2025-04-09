/* eslint-disable @typescript-eslint/no-explicit-any */
import { Occurrence, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Main seed function to populate the database
 */
async function main(): Promise<void> {
  try {
    // Clear existing data
    await clearDatabase();

    // Seed independent entities first
    const questionTypes = await seedQuestionTypes();
    const faculties = await seedFaculties();
    const themes = await seedThemes();
    const owners = await seedOwners();
    const eventTypes = await seedEventTypes();
    const buildings = await seedBuildings();
    const qrs = await seedQRs();
    await seedPrizes();

    // Seed entities with dependencies
    const fieldOfStudies = await seedFieldOfStudies(faculties);
    await seedBuildingEntries(buildings);
    const occurrences = await seedOccurrences();

    // Seed events
    const events = await seedEvents(eventTypes, buildings, qrs, owners);

    // Seed event relationships
    await seedEventThemes(events, themes);
    await seedEventFieldOfStudies(events, fieldOfStudies);

    // Seed event occurrences
    await seedEventOccurrences(occurrences, events);

    // Seed event visits
    await seedEventVisits();

    // Seed quizzes and questions
    const questions = await seedQuestions(questionTypes);
    await seedAnswers(questions);
    const quizzes = await seedQuizzes();
    const quizQuestions = await seedQuizQuestions(quizzes, questions);

    // Seed quiz question answers
    await seedQuizQuestionAnswers(quizQuestions);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
async function clearDatabase(): Promise<void> {
  const tableNames = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public' and tablename NOT LIKE '_prisma_migrations'`;

  for (const { tablename } of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`);
    } catch (error) {
      console.error(`Error truncating table ${tablename}:`, error);
    }
  }
}

/**
 * Seed QuestionType entities
 */
async function seedQuestionTypes() {
  const questionTypes = [{ name: 'Single choice' }];

  const createdQuestionTypes = [];
  for (const questionType of questionTypes) {
    const created = await prisma.questionType.create({ data: questionType });
    createdQuestionTypes.push(created);
  }

  return createdQuestionTypes;
}

/**
 * Seed Faculty entities
 */
async function seedFaculties() {
  const faculties = [
    { name: 'Wydział Elektrotechniki, Automatyki, Informatyki i Inżynierii Biomedycznej' },
  ];

  const createdFaculties = [];
  for (const faculty of faculties) {
    const created = await prisma.faculty.create({ data: faculty });
    createdFaculties.push(created);
  }

  return createdFaculties;
}

/**
 * Seed Theme entities
 */
async function seedThemes() {
  const themes = [{ name: 'AGH' }];

  const createdThemes = [];
  for (const theme of themes) {
    const created = await prisma.theme.create({ data: theme });
    createdThemes.push(created);
  }

  return createdThemes;
}

/**
 * Seed Owner entities
 */
async function seedOwners() {
  const owners = [{ name: 'AGH' }];

  const createdOwners = [];
  for (const owner of owners) {
    const created = await prisma.owner.create({ data: owner });
    createdOwners.push(created);
  }

  return createdOwners;
}

/**
 * Seed EventType entities
 */
async function seedEventTypes() {
  const eventTypes = [
    { name: 'Wykład', color: '#22c55e' },
    { name: 'Laboratorium', color: '#f97316' },
    { name: 'Wystawa', color: '#06b6d4' },
    { name: 'Stoisko', color: '#06b6d4' },
  ];

  const createdEventTypes = [];
  for (const eventType of eventTypes) {
    const created = await prisma.eventType.create({ data: eventType });
    createdEventTypes.push(created);
  }

  return createdEventTypes;
}

/**
 * Seed Building entities
 */
async function seedBuildings() {
  const buildings = [
    { name: 'A3-A4' },
    { name: 'B-1' },
    { name: 'C-1' },
    { name: 'C-2' },
    { name: 'C-3' },
    { name: 'D-2' },
  ];

  const createdBuildings = [];
  for (const building of buildings) {
    const created = await prisma.building.create({ data: building });
    createdBuildings.push(created);
  }

  return createdBuildings;
}

/**
 * Seed QR entities
 */
async function seedQRs() {
  const qrs = [
    { code: '0000000000' },
    { code: '1111111111' },
    { code: '2222222222' },
    { code: '3333333333' },
    { code: '4444444444' },
    { code: '5555555555' },
    { code: '6666666666' },
    { code: '7777777777' },
    { code: '8888888888' },
    { code: '9999999999' },
    { code: 'AAAAAAAAAA' },
  ];

  const createdQRs = [];
  for (const qr of qrs) {
    const created = await prisma.qR.create({ data: qr });
    createdQRs.push(created);
  }

  return createdQRs;
}

/**
 * Seed FieldOfStudy entities
 */
async function seedFieldOfStudies(faculties: Awaited<ReturnType<typeof seedFaculties>>) {
  const weaiiib = faculties[0];

  const fieldOfStudies = [
    { name: 'Automatyka i Robotyka', faculty_id: weaiiib.faculty_id },
    { name: 'Computer Science', faculty_id: weaiiib.faculty_id },
    { name: 'Elektrotechnika', faculty_id: weaiiib.faculty_id },
    { name: 'Informatyka', faculty_id: weaiiib.faculty_id },
    { name: 'Informatyka i Systemy Inteligentne', faculty_id: weaiiib.faculty_id },
    { name: 'Inżynieria Biomedyczna', faculty_id: weaiiib.faculty_id },
    { name: 'Mikroelektronika w Technice i Medycynie', faculty_id: weaiiib.faculty_id },
    { name: 'Technologie Przemysłu 4.0', faculty_id: weaiiib.faculty_id },
  ];

  const createdFieldOfStudies = [];
  for (const fieldOfStudy of fieldOfStudies) {
    const created = await prisma.fieldOfStudy.create({ data: fieldOfStudy });
    createdFieldOfStudies.push(created);
  }

  return createdFieldOfStudies;
}

/**
 * Seed BuildingEntry entities
 */
async function seedBuildingEntries(buildings: any[]) {
  const buildingEntries = [
    { map_longitude: 19.9137, map_latitude: 50.0684, building_id: buildings[0].building_id },
    { map_longitude: 19.912, map_latitude: 50.067, building_id: buildings[1].building_id },
    { map_longitude: 19.9145, map_latitude: 50.0665, building_id: buildings[2].building_id },
    { map_longitude: 19.915, map_latitude: 50.0675, building_id: buildings[3].building_id },
  ];

  const createdBuildingEntries = [];
  for (const entry of buildingEntries) {
    const created = await prisma.buildingEntry.create({ data: entry });
    createdBuildingEntries.push(created);
  }

  return createdBuildingEntries;
}

/**
 * Seed Occurrence entities
 */
async function seedOccurrences() {
  const tenAm = 1744358400 * 1000;
  const occurrences = [
    // 1
    [0, 30, 60, 90, 120, 150, 180, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 2
    [30, 90, 150, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 3
    [0, 60, 120, 180].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 4
    [0, 60, 120, 180, 240].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 5
    [0, 30, 60, 90, 120, 150, 180, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 6
    [90, 120, 150, 180, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 6
    [90, 120, 150, 180, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 7
    [150, 180, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 8
    [0, 60, 120, 180, 240].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 9
    [0, 60, 120, 180, 240].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 10
    [0, 30, 60, 90, 120, 150, 180, 210].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),

    // 11
    [0, 60, 120, 180, 240].map((offset) => ({
      start_time: new Date(tenAm + offset * 1000),
      end_time: new Date(tenAm + (offset + 30) * 1000),
    })),
  ];

  const createdOccurrences: Occurrence[][] = [];

  for (const occurrenceGroup of occurrences) {
    const createdOccurrencesGroup: Occurrence[] = [];
    createdOccurrences.push(createdOccurrencesGroup);

    for (const occurrence of occurrenceGroup) {
      const created = await prisma.occurrence.create({ data: occurrence });
      createdOccurrencesGroup.push(created);
    }
  }

  return createdOccurrences;
}

/**
 * Seed Event entities
 */

// A3A4
//              50.065443, 19.920426

// B1
//              50.065926, 19.919384
//              50.066102, 19.919484
//              50.066263, 19.919580

// C1
//              50.065402, 19.922691
//              50.065652, 19.922777

// C2
//              50.065913, 19.922767
//              50.066013, 19.922303

// C3
//              50.066113, 19.921882
//              50.066197, 19.921512

// D2
//              50.065393, 19.918781

async function seedEvents(
  eventTypes: Awaited<ReturnType<typeof seedEventTypes>>,
  buildings: Awaited<ReturnType<typeof seedBuildings>>,
  qrs: Awaited<ReturnType<typeof seedQRs>>,
  owners: Awaited<ReturnType<typeof seedOwners>>
) {
  const lecture = eventTypes.find((et) => et.name === 'Wykład');
  const lab = eventTypes.find((et) => et.name === 'Laboratorium');
  const exhib = eventTypes.find((et) => et.name === 'Wystawa');
  const stand = eventTypes.find((et) => et.name === 'Stoisko');

  if (!lecture || !lab || !exhib || !stand) {
    throw new Error('Missing item');
  }

  const A3A4 = buildings.find((b) => b.name === 'A3-A4');
  const B1 = buildings.find((b) => b.name === 'B-1');
  const C1 = buildings.find((b) => b.name === 'C-1');
  const C2 = buildings.find((b) => b.name === 'C-2');
  const C3 = buildings.find((b) => b.name === 'C-3');
  const D2 = buildings.find((b) => b.name === 'D-2');

  if (!A3A4 || !B1 || !C1 || !C2 || !C3 || !D2) {
    throw new Error('Missing item');
  }

  const AGH = owners[0];

  const events = [
    {
      name: 'Laboratorium Mikro-sieci i Jakości Energii Elektrycznej',
      description:
        'Laboratorium dysponuje mikro-siecią energetyczną, umożliwiającą testowanie inteligentnych sieci elektroenergetycznych (smart grid) oraz pracę wyspową z wykorzystaniem OZE i zasobników energii.',
      should_be_displayed: true,
      location_longitude: 19.919384,
      location_latitude: 50.065926,
      event_type_id: lab.event_type_id,
      building_id: B1.building_id,
      qr_id: qrs[0].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Wysokich Napięć',
      description:
        'Zobacz fascynujące pokazy wyładowań elektrycznych: iskrowych, powierzchniowych i łukowych. Na koniec czeka pokaz transformatora Tesli, generującego spektakularne iskry i grającego melodie!',
      should_be_displayed: true,
      location_longitude: 19.919484,
      location_latitude: 50.066102,
      event_type_id: lab.event_type_id,
      building_id: B1.building_id,
      qr_id: qrs[1].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Techniki Mikroprocesorowej oraz bezprzewodowej transmisji danych i energii',
      description:
        'Mikroelektronika w Technice i Medycynie (MTM) - zobacz, jak tworzymy przyszłość! Prezentacja laboratoriów, projektów i układów scalonych wykorzystywanych na całym świecie.',
      should_be_displayed: true,
      location_longitude: 19.918781,
      location_latitude: 50.065393,
      event_type_id: lab.event_type_id,
      building_id: D2.building_id,
      qr_id: qrs[2].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Robotyki oraz Laboratorium Robotów Mobilnych',
      description:
        'Chcesz programować roboty? Zobacz stanowiska laboratoryjne, gdzie studenci tworzą sterowniki i algorytmy nawigacji dla robotów przemysłowych i mobilnych.',
      should_be_displayed: true,
      location_longitude: 19.921882,
      location_latitude: 50.066113,
      event_type_id: lab.event_type_id,
      building_id: C3.building_id,
      qr_id: qrs[3].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Wbudowanych Systemów Wizyjnych, Arena Dronów',
      description:
        'Drony to przyszłość, która dzieje się teraz! Zobacz najnowsze badania i kierunki rozwoju technologii bezzałogowych statków powietrznych oraz drony wykorzystywane w naszym laboratorium.',
      should_be_displayed: true,
      location_longitude: 19.922767,
      location_latitude: 50.065913,
      event_type_id: lab.event_type_id,
      building_id: C2.building_id,
      qr_id: qrs[4].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Zastosowań AI w Medycznej Diagnostyce Obrazowej',
      description:
        'Sztuczna inteligencja widzi, co w tobie tkwi” - pokazy analizy obrazów medycznych z wykorzystaniem AI.',
      should_be_displayed: true,
      location_longitude: 19.920426,
      location_latitude: 50.065443,
      event_type_id: lab.event_type_id,
      building_id: A3A4.building_id,
      qr_id: qrs[5].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Sieci Komputerowych i Sieciowych Systemów Multimedialnych',
      description:
        'Poznaj technologie sieciowe, systemy multimedialne i interaktywne systemy wizyjne! Zobacz techniki programowania urządzeń sieciowych, sprzęt do budowy sieci i systemy telekonferencji.',
      should_be_displayed: true,
      location_longitude: 19.922303,
      location_latitude: 50.066013,
      event_type_id: lab.event_type_id,
      building_id: C2.building_id,
      qr_id: qrs[6].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Laboratorium Automatyki Budynkowej AutBudNet AGH',
      description:
        'Zobacz, jak działa inteligentny dom i budynek! Interaktywne sterowanie oświetleniem i prezentacja rozwiązań z obszaru smart home, smart building i efektywności energetycznej.',
      should_be_displayed: true,
      location_longitude: 19.922691,
      location_latitude: 50.065402,
      event_type_id: lab.event_type_id,
      building_id: C1.building_id,
      qr_id: qrs[7].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Koło Naukowe Elektrotermii',
      description: 'Zobacz, jak działa i co realizuje KN Elektrotermii',
      should_be_displayed: true,
      location_longitude: 19.922777,
      location_latitude: 50.065652,
      event_type_id: exhib.event_type_id,
      building_id: C1.building_id,
      qr_id: qrs[8].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Koło Naukowe Promotor',
      description:
        'Zobacz hamownię silników do motocykli elektrycznych E-MOTO oraz stanowisko do badań prototypu maszyny PMCM, opracowanej we współpracy ze studentami!',
      should_be_displayed: true,
      location_longitude: 19.91958,
      location_latitude: 50.066263,
      event_type_id: exhib.event_type_id,
      building_id: B1.building_id,
      qr_id: qrs[9].qr_id,
      owner_id: AGH.owner_id,
    },
    {
      name: 'Koło Naukowe BioMedical Innovations',
      description:
        'Poznaj projekty Koła BioMedical Innovation: od rejestratora EKG po antropomorficzny manipulator do ewakuacji rannych (projekt ministerialny). Prezentacja w Laboratorium Systemów Wbudowanych i Internetu Rzeczy.',
      should_be_displayed: true,
      location_longitude: 19.921512,
      location_latitude: 50.066197,
      event_type_id: exhib.event_type_id,
      building_id: C3.building_id,
      qr_id: qrs[10].qr_id,
      owner_id: AGH.owner_id,
    },
  ];

  const createdEvents = [];
  for (const event of events) {
    const created = await prisma.event.create({ data: event });
    createdEvents.push(created);
  }

  return createdEvents;
}

/**
 * Seed EventTheme relationships
 */
async function seedEventThemes(
  events: Awaited<ReturnType<typeof seedEvents>>,
  themes: Awaited<ReturnType<typeof seedThemes>>
) {
  const eventThemes = events.map((e) => ({ event_id: e.event_id, theme_id: themes[0].theme_id }));

  for (const eventTheme of eventThemes) {
    await prisma.eventTheme.create({ data: eventTheme });
  }
}

/**
 * Seed EventFieldOfStudy relationships
 */
async function seedEventFieldOfStudies(
  events: Awaited<ReturnType<typeof seedEvents>>,
  fieldOfStudies: Awaited<ReturnType<typeof seedFieldOfStudies>>
) {
  const AiR = fieldOfStudies.find((fos) => fos.name === 'Automatyka i Robotyka');
  const CS = fieldOfStudies.find((fos) => fos.name === 'Computer Science');
  const Elek = fieldOfStudies.find((fos) => fos.name === 'Elektrotechnika');
  const Inf = fieldOfStudies.find((fos) => fos.name === 'Informatyka');
  const ISiI = fieldOfStudies.find((fos) => fos.name === 'Informatyka i Systemy Inteligentne');
  const IB = fieldOfStudies.find((fos) => fos.name === 'Inżynieria Biomedyczna');
  const MwTiM = fieldOfStudies.find(
    (fos) => fos.name === 'Mikroelektronika w Technice i Medycynie'
  );
  const TP40 = fieldOfStudies.find((fos) => fos.name === 'Technologie Przemysłu 4.0');

  if (!AiR || !CS || !Elek || !Inf || !ISiI || !IB || !MwTiM || !TP40) {
    throw new Error('Missing item');
  }

  const eventFieldsOfStudyGroups = [
    [Elek, MwTiM],
    [MwTiM],
    [Elek],
    [AiR],
    [ISiI, Inf, TP40, AiR, CS],
    [Inf, ISiI, IB, CS],
    [Inf, ISiI, CS],
    [TP40, AiR],
    [TP40, AiR],
    [MwTiM, AiR, TP40],
    [IB],
  ];

  for (const index in eventFieldsOfStudyGroups) {
    const group = eventFieldsOfStudyGroups[index];

    for (const fieldOfStudy of group) {
      await prisma.eventFieldOfStudy.create({
        data: {
          event_id: events[index].event_id,
          field_of_study_id: fieldOfStudy.field_of_study_id,
        },
      });
    }
  }
}

/**
 * Seed EventOccurrence relationships
 */
async function seedEventOccurrences(
  occurrences: Awaited<ReturnType<typeof seedOccurrences>>,
  events: Awaited<ReturnType<typeof seedEvents>>
) {
  for (const index in events) {
    const event = events[index];
    const occurrence = occurrences[index];

    for (const occ of occurrence) {
      await prisma.eventOccurrence.create({
        data: {
          occurrence_id: occ.occurrence_id,
          event_id: event.event_id,
        },
      });
    }
  }
}

/**
 * Seed EventVisit relationships
 */
async function seedEventVisits() {}

/**
 * Seed Question entities
 */
async function seedQuestions(questionTypes: any[]) {
  const questions = [
    {
      title: 'What is the primary function of a CPU?',
      description: 'Choose the most accurate description',
      question_type_id: questionTypes[0].question_type_id,
    },
    {
      title: 'Which of the following are input devices?',
      description: 'Select all that apply',
      question_type_id: questionTypes[0].question_type_id,
    },
    {
      title: 'C++ is a compiled language.',
      description: null,
      question_type_id: questionTypes[0].question_type_id,
    },
    {
      title: 'Explain the concept of polymorphism in OOP',
      description: 'Provide a brief explanation',
      question_type_id: questionTypes[0].question_type_id,
    },
  ];

  const createdQuestions = [];
  for (const question of questions) {
    const created = await prisma.question.create({ data: question });
    createdQuestions.push(created);
  }

  return createdQuestions;
}

/**
 * Seed Answer entities
 */
async function seedAnswers(questions: any[]) {
  const answers = [
    // Answers for the CPU question
    {
      text: 'Processing data and executing instructions',
      is_correct: true,
      question_id: questions[0].question_id,
    },
    {
      text: 'Storing large amounts of data',
      is_correct: false,
      question_id: questions[0].question_id,
    },
    {
      text: 'Displaying output to the user',
      is_correct: false,
      question_id: questions[0].question_id,
    },
    {
      text: 'Managing network connectivity',
      is_correct: false,
      question_id: questions[0].question_id,
    },

    // Answers for the input devices question
    { text: 'Keyboard', is_correct: true, question_id: questions[1].question_id },
    { text: 'Mouse', is_correct: true, question_id: questions[1].question_id },
    { text: 'Monitor', is_correct: false, question_id: questions[1].question_id },
    { text: 'Printer', is_correct: false, question_id: questions[1].question_id },

    // Answers for the C++ question
    { text: 'True', is_correct: true, question_id: questions[2].question_id },
    { text: 'False', is_correct: false, question_id: questions[2].question_id },

    // No answers for the open-ended question about polymorphism
  ];

  const createdAnswers = [];
  for (const answer of answers) {
    const created = await prisma.answer.create({ data: answer });
    createdAnswers.push(created);
  }

  return createdAnswers;
}

/**
 * Seed Quiz entities
 */
async function seedQuizzes() {
  const quizzes = [
    {
      name: 'Computer Science Basics',
      description: 'Test your knowledge of fundamental computer science concepts',
    },
    {
      name: 'Programming Concepts',
      description: 'Questions about programming paradigms and techniques',
    },
  ];

  const createdQuizzes = [];
  for (const quiz of quizzes) {
    const created = await prisma.quiz.create({ data: quiz });
    createdQuizzes.push(created);
  }

  return createdQuizzes;
}

/**
 * Seed QuizQuestion relationships
 */
async function seedQuizQuestions(quizzes: any[], questions: any[]) {
  const quizQuestions = [
    { quiz_id: quizzes[0].quiz_id, question_id: questions[0].question_id },
    { quiz_id: quizzes[0].quiz_id, question_id: questions[1].question_id },
    { quiz_id: quizzes[1].quiz_id, question_id: questions[2].question_id },
    { quiz_id: quizzes[1].quiz_id, question_id: questions[3].question_id },
  ];

  const createdQuizQuestions = [];
  for (const quizQuestion of quizQuestions) {
    const created = await prisma.quizQuestion.create({ data: quizQuestion });
    createdQuizQuestions.push(created);
  }

  return createdQuizQuestions;
}

/**
 * Seed QuizQuestionAnswer entities
 */
async function seedQuizQuestionAnswers(quizQuestions: any[]) {
  const quizQuestionAnswers = [
    {
      correct_answer: 1, // Assuming 1 is the ID of the correct answer
      quiz_question_id: quizQuestions[0].quiz_question_id,
      user_id: 'test-id-1',
    },
    {
      correct_answer: 0, // Assuming 0 means incorrect answer
      quiz_question_id: quizQuestions[1].quiz_question_id,
      user_id: 'test-id-2',
    },
    {
      correct_answer: 1,
      quiz_question_id: quizQuestions[0].quiz_question_id,
      user_id: 'test-id-3',
    },
    {
      correct_answer: 1,
      quiz_question_id: quizQuestions[2].quiz_question_id,
      user_id: 'test-id-3',
    },
  ];

  for (const answer of quizQuestionAnswers) {
    await prisma.quizQuestionAnswer.create({ data: answer });
  }
}

/**
 * Seed QuizQuestion relationships
 */
async function seedPrizes() {
  const prizes: Prisma.PrizeCreateArgs['data'][] = [
    {
      prize_title: 'Nagroda 1',
      prize_description: 'Odwiedź 2 miejsca podczas Dni Otwartych AGH 2025',
      required_visits: 2,
    },
    {
      prize_title: 'Nagroda 2',
      prize_description: 'Odwiedź 4 miejsca podczas Dni Otwartych AGH 2025',
      required_visits: 4,
    },
    {
      prize_title: 'Nagroda 3',
      prize_description: 'Odwiedź aż 6 miejsc podczas Dni Otwartych AGH 2025',
      required_visits: 6,
    },
  ];

  const createdPrizes = [];
  for (const prize of prizes) {
    const created = await prisma.prize.create({ data: prize });
    createdPrizes.push(created);
  }
}

// Run the seed function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
