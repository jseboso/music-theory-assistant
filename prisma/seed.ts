const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const basicsCategory = await prisma.lessonCategory.create({
    data: {
      name: 'Music Basics',
      description: 'Fundamental concepts of music theory',
      orderNumber: 1,
    },
  });
  
  const scalesCategory = await prisma.lessonCategory.create({
    data: {
      name: 'Scales and Keys',
      description: 'Understanding scales, modes, and key signatures',
      orderNumber: 2,
    },
  });
  
  const harmonyCategory = await prisma.lessonCategory.create({
    data: {
      name: 'Harmony',
      description: 'Chord construction and progressions',
      orderNumber: 3,
    },
  });

  const notationLesson = await prisma.lesson.create({
    data: {
      title: 'Introduction to Music Notation',
      description: 'Learn the fundamentals of reading and writing music notation.',
      categoryId: basicsCategory.id,
      orderNumber: 1,
      duration: 15,
      content: [
        {
          title: "Understanding the Staff",
          body: "<p>The staff (or stave) is the foundation of written music. It consists of five horizontal lines and the four spaces between them. Each line and space represents a different musical pitch.</p><p>Notes are placed on the staff to indicate which pitch should be played and for how long. The higher a note is placed on the staff, the higher its pitch.</p>"
        },
        {
          title: "Clefs: Treble and Bass",
          body: "<p>Clefs are symbols placed at the beginning of a staff to indicate which notes correspond to which lines and spaces.</p><p>The two most common clefs are:</p><ul><li><strong>Treble Clef (G clef)</strong>: Used for higher-pitched instruments and typically for the right hand in piano music.</li><li><strong>Bass Clef (F clef)</strong>: Used for lower-pitched instruments and typically for the left hand in piano music.</li></ul><p>The treble clef curls around the G line, while the bass clef wraps around the F line, which is how they got their alternative names.</p>"
        },
        {
          title: "Notes and Their Values",
          body: "<p>Notes have two important properties: pitch (which note to play) and duration (how long to play it).</p><p>The main note values are:</p><ul><li><strong>Whole note</strong>: Held for 4 beats</li><li><strong>Half note</strong>: Held for 2 beats</li><li><strong>Quarter note</strong>: Held for 1 beat</li><li><strong>Eighth note</strong>: Held for 1/2 beat</li><li><strong>Sixteenth note</strong>: Held for 1/4 beat</li></ul><p>Each note value is half the duration of the one before it. For example, a half note is half as long as a whole note.</p>"
        },
        {
          title: "Rests and Their Values",
          body: "<p>Rests are symbols that indicate periods of silence in music. Like notes, they have specific durations.</p><p>Each rest corresponds to a note value:</p><ul><li><strong>Whole rest</strong>: 4 beats of silence</li><li><strong>Half rest</strong>: 2 beats of silence</li><li><strong>Quarter rest</strong>: 1 beat of silence</li><li><strong>Eighth rest</strong>: 1/2 beat of silence</li><li><strong>Sixteenth rest</strong>: 1/4 beat of silence</li></ul><p>Rests are just as important as notes in music! They create breathing space and rhythm in music.</p>"
        }
      ],
      resources: [
        {title: "Music Theory Handbook", url: "https://example.com/handbook"},
        {title: "Note Identification Practice", url: "https://example.com/practice"}
      ],
    },
  });

  const notationQuiz = await prisma.quiz.create({
    data: {
      title: 'Music Notation Fundamentals',
      description: 'Test your knowledge of basic music notation concepts.',
      lessonId: notationLesson.id,
      difficulty: 'beginner',
      estimatedTime: 10,
      orderNumber: 1,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: notationQuiz.id,
      question: 'Which of the following determines the pitch of a note on the staff?',
      options: ["The note's vertical position on the staff", "The note's stem direction", "The color of the note head", "The length of the note stem"],
      correctAnswer: 0,
      explanation: 'The vertical position of a note on the staff determines its pitch. Higher positions on the staff represent higher pitches, and lower positions represent lower pitches.',
      orderNumber: 1,
    },
  });

  // Add more questions here...
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });