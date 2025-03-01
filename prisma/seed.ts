import { PrismaClient } from '@prisma/client';

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
    
    // Seed entities with dependencies
    const fieldOfStudies = await seedFieldOfStudies(faculties);
    const buildingEntries = await seedBuildingEntries(buildings);
    const occurrences = await seedOccurrences();
    
    // Seed events
    const events = await seedEvents(eventTypes, buildings, qrs, owners);
    
    // Seed event relationships
    await seedEventThemes(events, themes);
    await seedEventFieldOfStudies(events, fieldOfStudies);
    
    // Seed tours and event occurrences
    const tours = await seedTours(owners);
    await seedEventOccurrences(tours, occurrences, events);
    
    // Seed users
    const users = await seedUsers();
    
    // Seed event visits
    await seedEventVisits(events, users);
    
    // Seed quizzes and questions
    const questions = await seedQuestions(questionTypes);
    const answers = await seedAnswers(questions);
    const quizzes = await seedQuizzes();
    const quizQuestions = await seedQuizQuestions(quizzes, questions);
    
    // Seed quiz question answers
    await seedQuizQuestionAnswers(quizQuestions, users);
    
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
  const tablenames = await prisma.$queryRaw<
    Array<{ name: string }>
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations'`;

  for (const { name } of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${name}"`);
    } catch (error) {
      console.log(`Failed to clear table ${name}`);
    }
  }
}

/**
 * Seed QuestionType entities
 */
async function seedQuestionTypes() {
  const questionTypes = [
    { name: 'Single choice' },
    { name: 'Multiple choice' },
    { name: 'True/False' },
    { name: 'Text input' }
  ];

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
    { name: 'Faculty of Computer Science, Electronics and Telecommunications' },
    { name: 'Faculty of Electrical Engineering, Automatics, IT and Biomedical Engineering' },
    { name: 'Faculty of Mechanical Engineering and Robotics' },
    { name: 'Faculty of Materials Science and Ceramics' }
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
  const themes = [
    { name: 'Technology' },
    { name: 'Science' },
    { name: 'Engineering' },
    { name: 'Art' },
    { name: 'Mathematics' }
  ];

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
  const owners = [
    { name: 'Department of Computer Science' },
    { name: 'Department of Electronics' },
    { name: 'Department of Automatics' },
    { name: 'Student Scientific Association' }
  ];

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
    { name: 'Lecture' },
    { name: 'Workshop' },
    { name: 'Exhibition' },
    { name: 'Lab tour' },
    { name: 'Discussion panel' }
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
    { name: 'D-17' },
    { name: 'B-1' },
    { name: 'C-1' },
    { name: 'D-1' }
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
    { code: 'QR123456' },
    { code: 'QR789012' },
    { code: 'QR345678' },
    { code: 'QR901234' },
    { code: 'QR567890' }
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
async function seedFieldOfStudies(faculties: any[]) {
  const fieldOfStudies = [
    { name: 'Computer Science', faculty_id: faculties[0].faculty_id },
    { name: 'Electronics', faculty_id: faculties[0].faculty_id },
    { name: 'Automatics and Robotics', faculty_id: faculties[1].faculty_id },
    { name: 'Mechanical Engineering', faculty_id: faculties[2].faculty_id },
    { name: 'Materials Science', faculty_id: faculties[3].faculty_id }
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
    { map_longitude: 19.9120, map_latitude: 50.0670, building_id: buildings[1].building_id },
    { map_longitude: 19.9145, map_latitude: 50.0665, building_id: buildings[2].building_id },
    { map_longitude: 19.9150, map_latitude: 50.0675, building_id: buildings[3].building_id }
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
  const now = new Date();
  const occurrences = [
    { 
      start_time: new Date(now.getTime() + 3600000), // Now + 1 hour
      end_time: new Date(now.getTime() + 7200000)    // Now + 2 hours
    },
    { 
      start_time: new Date(now.getTime() + 86400000),      // Now + 1 day
      end_time: new Date(now.getTime() + 86400000 + 3600000) // Now + 1 day and 1 hour
    },
    { 
      start_time: new Date(now.getTime() + 172800000),      // Now + 2 days
      end_time: new Date(now.getTime() + 172800000 + 7200000) // Now + 2 days and 2 hours
    },
  ];

  const createdOccurrences = [];
  for (const occurrence of occurrences) {
    const created = await prisma.occurrence.create({ data: occurrence });
    createdOccurrences.push(created);
  }

  return createdOccurrences;
}

/**
 * Seed Event entities
 */
async function seedEvents(eventTypes: any[], buildings: any[], qrs: any[], owners: any[]) {
  const events = [
    {
      name: 'Introduction to AI',
      description: 'Learn about the basics of artificial intelligence and machine learning',
      should_be_displayed: true,
      location_longitude: 19.9137,
      location_latitude: 50.0684,
      event_type_id: eventTypes[0].event_type_id,
      building_id: buildings[0].building_id,
      qr_id: qrs[0].qr_id,
      owner_id: owners[0].owner_id
    },
    {
      name: 'Electronics Workshop',
      description: 'Hands-on workshop with microcontrollers and electronic circuits',
      should_be_displayed: true,
      location_longitude: 19.9120,
      location_latitude: 50.0670,
      event_type_id: eventTypes[1].event_type_id,
      building_id: buildings[1].building_id,
      qr_id: qrs[1].qr_id,
      owner_id: owners[1].owner_id
    },
    {
      name: 'Robotics Showcase',
      description: 'See the latest robotics projects from our students',
      should_be_displayed: true,
      location_longitude: 19.9145,
      location_latitude: 50.0665,
      event_type_id: eventTypes[2].event_type_id,
      building_id: buildings[2].building_id,
      qr_id: qrs[2].qr_id,
      owner_id: owners[2].owner_id
    },
    {
      name: 'Future of Computing Panel',
      description: 'Discussion about future trends in computing and technology',
      should_be_displayed: true,
      location_longitude: 19.9150,
      location_latitude: 50.0675,
      event_type_id: eventTypes[4].event_type_id,
      building_id: buildings[3].building_id,
      qr_id: qrs[3].qr_id,
      owner_id: owners[3].owner_id
    }
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
async function seedEventThemes(events: any[], themes: any[]) {
  const eventThemes = [
    { event_id: events[0].event_id, theme_id: themes[0].theme_id },
    { event_id: events[0].event_id, theme_id: themes[1].theme_id },
    { event_id: events[1].event_id, theme_id: themes[2].theme_id },
    { event_id: events[2].event_id, theme_id: themes[2].theme_id },
    { event_id: events[2].event_id, theme_id: themes[0].theme_id },
    { event_id: events[3].event_id, theme_id: themes[0].theme_id },
    { event_id: events[3].event_id, theme_id: themes[4].theme_id }
  ];

  for (const eventTheme of eventThemes) {
    await prisma.eventTheme.create({ data: eventTheme });
  }
}

/**
 * Seed EventFieldOfStudy relationships
 */
async function seedEventFieldOfStudies(events: any[], fieldOfStudies: any[]) {
  const eventFieldsOfStudy = [
    { event_id: events[0].event_id, field_of_study_id: fieldOfStudies[0].field_of_study_id },
    { event_id: events[0].event_id, field_of_study_id: fieldOfStudies[1].field_of_study_id },
    { event_id: events[1].event_id, field_of_study_id: fieldOfStudies[1].field_of_study_id },
    { event_id: events[2].event_id, field_of_study_id: fieldOfStudies[2].field_of_study_id },
    { event_id: events[3].event_id, field_of_study_id: fieldOfStudies[0].field_of_study_id }
  ];

  for (const eventFieldOfStudy of eventFieldsOfStudy) {
    await prisma.eventFieldOfStudy.create({ data: eventFieldOfStudy });
  }
}

/**
 * Seed Tour entities
 */
async function seedTours(owners: any[]) {
  const tours = [
    {
      name: 'Computer Science Tour',
      description: 'Tour of the computer science department and labs',
      owner_id: owners[0].owner_id
    },
    {
      name: 'Electronics Tour',
      description: 'Tour of the electronics department and labs',
      owner_id: owners[1].owner_id
    },
    {
      name: 'Full Faculty Tour',
      description: 'Comprehensive tour of the entire faculty',
      owner_id: owners[3].owner_id
    }
  ];

  const createdTours = [];
  for (const tour of tours) {
    const created = await prisma.tour.create({ data: tour });
    createdTours.push(created);
  }

  return createdTours;
}

/**
 * Seed EventOccurrence relationships
 */
async function seedEventOccurrences(tours: any[], occurrences: any[], events: any[]) {
  const eventOccurrences = [
    { 
      tour_id: tours[0].tour_id, 
      occurrence_id: occurrences[0].occurrence_id, 
      event_id: events[0].event_id 
    },
    { 
      tour_id: tours[0].tour_id, 
      occurrence_id: occurrences[1].occurrence_id, 
      event_id: events[3].event_id 
    },
    { 
      tour_id: tours[1].tour_id, 
      occurrence_id: occurrences[1].occurrence_id, 
      event_id: events[1].event_id 
    },
    { 
      tour_id: tours[2].tour_id, 
      occurrence_id: occurrences[2].occurrence_id, 
      event_id: events[2].event_id 
    }
  ];

  for (const eventOccurrence of eventOccurrences) {
    await prisma.eventOccurrence.create({ data: eventOccurrence });
  }
}

/**
 * Seed User entities
 */
async function seedUsers() {
  // Note: In a real application, these passwords should be hashed
  const users = [
    { name: 'Jan', surname: 'Kowalski', password: 'hashedpassword1' },
    { name: 'Anna', surname: 'Nowak', password: 'hashedpassword2' },
    { name: 'Piotr', surname: 'Wiśniewski', password: 'hashedpassword3' },
    { name: 'Marta', surname: 'Dąbrowska', password: 'hashedpassword4' }
  ];

  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    createdUsers.push(created);
  }

  return createdUsers;
}

/**
 * Seed EventVisit relationships
 */
async function seedEventVisits(events: any[], users: any[]) {
  const now = new Date();
  const eventVisits = [
    { 
      time: new Date(now.getTime() - 86400000), // Yesterday
      event_id: events[0].event_id, 
      user_id: users[0].user_id 
    },
    { 
      time: new Date(now.getTime() - 43200000), // 12 hours ago
      event_id: events[1].event_id, 
      user_id: users[0].user_id 
    },
    { 
      time: new Date(now.getTime() - 86400000), // Yesterday
      event_id: events[1].event_id, 
      user_id: users[1].user_id 
    },
    { 
      time: new Date(now.getTime() - 172800000), // 2 days ago
      event_id: events[2].event_id, 
      user_id: users[2].user_id 
    }
  ];

  for (const eventVisit of eventVisits) {
    await prisma.eventVisit.create({ data: eventVisit });
  }
}

/**
 * Seed Question entities
 */
async function seedQuestions(questionTypes: any[]) {
  const questions = [
    {
      title: 'What is the primary function of a CPU?',
      description: 'Choose the most accurate description',
      question_type_id: questionTypes[0].question_type_id
    },
    {
      title: 'Which of the following are input devices?',
      description: 'Select all that apply',
      question_type_id: questionTypes[1].question_type_id
    },
    {
      title: 'C++ is a compiled language.',
      description: null,
      question_type_id: questionTypes[2].question_type_id
    },
    {
      title: 'Explain the concept of polymorphism in OOP',
      description: 'Provide a brief explanation',
      question_type_id: questionTypes[3].question_type_id
    }
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
    { text: 'Processing data and executing instructions', is_correct: true, question_id: questions[0].question_id },
    { text: 'Storing large amounts of data', is_correct: false, question_id: questions[0].question_id },
    { text: 'Displaying output to the user', is_correct: false, question_id: questions[0].question_id },
    { text: 'Managing network connectivity', is_correct: false, question_id: questions[0].question_id },
    
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
      description: 'Test your knowledge of fundamental computer science concepts'
    },
    { 
      name: 'Programming Concepts',
      description: 'Questions about programming paradigms and techniques'
    }
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
    { quiz_id: quizzes[1].quiz_id, question_id: questions[3].question_id }
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
async function seedQuizQuestionAnswers(quizQuestions: any[], users: any[]) {
  const quizQuestionAnswers = [
    { 
      correct_answer: 1, // Assuming 1 is the ID of the correct answer
      quiz_question_id: quizQuestions[0].quiz_question_id,
      user_id: users[0].user_id
    },
    { 
      correct_answer: 0, // Assuming 0 means incorrect answer
      quiz_question_id: quizQuestions[1].quiz_question_id,
      user_id: users[0].user_id
    },
    { 
      correct_answer: 1, 
      quiz_question_id: quizQuestions[0].quiz_question_id,
      user_id: users[1].user_id
    },
    { 
      correct_answer: 1, 
      quiz_question_id: quizQuestions[2].quiz_question_id,
      user_id: users[2].user_id
    }
  ];

  for (const answer of quizQuestionAnswers) {
    await prisma.quizQuestionAnswer.create({ data: answer });
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
