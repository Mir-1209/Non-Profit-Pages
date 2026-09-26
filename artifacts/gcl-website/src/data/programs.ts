import imgWorkshop from '../assets/media/speaker.webp';
import imgCurriculum from '../assets/media/laptop-student.webp';
import imgSchools from '../assets/media/school-kids-2.webp';
import imgTrainers from '../assets/media/trio.webp';
import { courses } from './courses';

const moduleCount = courses.reduce((n, c) => n + c.modules.length, 0);

export interface Program {
  id: string;
  num: string;
  title: string;
  where: string;
  summary: string;
  detail: string;
  facts: string[];
  image: string;
  imageAlt: string;
}

export const programs: Program[] = [
  {
    id: 'workshops',
    num: '01',
    title: 'Live workshops',
    where: 'Youth workshop · Tashkent',
    summary:
      'High-energy, in-person sessions on the psychology of spending, saving and risk — run in local languages by trained youth educators.',
    detail:
      'Every workshop starts with a decision, not a formula. Students play through real choices — spend or save, borrow or wait — then unpack the biases that drove them. They leave with one habit to try the next day.',
    facts: ['In person', 'Youth-led', 'Local languages', 'Free'],
    image: imgWorkshop,
    imageAlt: 'A GCL educator presenting "5 types of income" to a classroom',
  },
  {
    id: 'curriculum',
    num: '02',
    title: 'Open curriculum',
    where: 'Digital reach · Global',
    summary:
      'Self-paced modules grounded in behavioral economics and learning science — culturally adapted, relentlessly practical, and open to all.',
    detail:
      `${courses.length} courses, from The Psychology of Spending to Decisions Under Scarcity. Each module is designed to be taught by a peer in under an hour, with slides, scripts and activities any chapter can run.`,
    facts: [`${courses.length} courses`, `${moduleCount} modules`, 'Peer-teachable', 'Open access'],
    image: imgCurriculum,
    imageAlt: 'A student following a GCL session on a laptop',
  },
  {
    id: 'schools',
    num: '03',
    title: 'School partnerships',
    where: 'School partnership · Tajikistan',
    summary:
      'We bring financial literacy into classrooms that have never had it — partnering with schools, NGOs and universities to reach students where they already are.',
    detail:
      'Partner schools host a GCL team for a series of sessions built around their timetable. Teachers get the materials to keep going after we leave.',
    facts: ['In-school sessions', 'Teacher toolkits', 'NGO & university partners'],
    image: imgSchools,
    imageAlt: 'Secondary school students in uniform working through a GCL session',
  },
  {
    id: 'trainers',
    num: '04',
    title: 'Train the trainer',
    where: 'Community · After session',
    summary:
      'Every student is a future teacher. We train young people to lead workshops in their own communities — and to found chapters of their own.',
    detail:
      'Graduates of the program co-teach, then lead. The best go on to found a chapter: host a first event with ten verified attendees and your city goes on the map.',
    facts: ['Peer educators', 'Leadership', 'Chapter founders'],
    image: imgTrainers,
    imageAlt: 'Three GCL volunteers smiling after a session',
  },
];
