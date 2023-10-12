import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MainLayout } from '../../../components/MainLayout';
import {
  PageDescription,
  PageHeader,
  PageSubtitle,
  PageTitle,
} from '../../../components/PageHeader';
import { trpc } from '../../../utils/trpc';
import { CoursePreview } from '../components/coursePreview';
import { LevelPicker } from '../components/level-picker';
import { Course, SolarSystem } from '../components/solarSystem';

export const CoursesExplorer = () => {
  const { i18n, t } = useTranslation();
  const { data: courses } = trpc.content.getCourses.useQuery();

  const coursesInLanguage = courses?.filter(
    (course) => course.language === i18n.language,
  );

  // Hardcoded unreleased courses
  const unreleasedCourses: Course[] = [
    {
      id: 'fin101',
      name: t('courses.unreleased.financeIntroduction'),
      level: 'beginner',
      language: 'fr',
      unreleased: true,
    },
    {
      id: 'btc301',
      name: t('courses.unreleased.colcardAndSparrow'),
      level: 'advanced',
      language: 'fr',
      unreleased: true,
    },
    {
      id: 'ln301',
      name: t('courses.unreleased.theoreticalLightning'),
      level: 'advanced',
      language: 'fr',
      unreleased: true,
    },
    {
      id: 'fin205',
      name: t('courses.unreleased.financialCrisis'),
      level: 'intermediate',
      language: 'fr',
      unreleased: true,
    },
    {
      id: 'econ205',
      name: t('courses.unreleased.hyperinflation'),
      level: 'intermediate',
      language: 'fr',
      unreleased: true,
    },
  ];

  const categories = [
    {
      prefix: 'btc',
      topic: t('courses.categories.btc'),
    },
    {
      prefix: 'ln',
      topic: t('courses.categories.ln'),
    },
    {
      prefix: 'econ',
      topic: t('courses.categories.econ'),
    },
    {
      prefix: 'secu',
      topic: t('courses.categories.secu'),
    },
    {
      prefix: 'fin',
      topic: t('courses.categories.fin'),
    },
    {
      prefix: 'min',
      topic: t('courses.categories.min'),
    },
  ];

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const coursesWithUnreleased = [
    ...(coursesInLanguage || []),
    ...unreleasedCourses,
  ];

  return (
    <MainLayout footerVariant="dark">
      <div className="flex w-full flex-col items-center justify-center bg-blue-900">
        <PageHeader>
          <PageTitle>{t('courses.explorer.pageTitle')}</PageTitle>
          <PageSubtitle>{t('courses.explorer.pageSubtitle')}</PageSubtitle>
          <PageDescription>
            {t('courses.explorer.pageDescription')}
          </PageDescription>
        </PageHeader>

        <div className="flex w-full flex-col items-center bg-blue-900 md:h-full">
          <SolarSystem courses={coursesWithUnreleased} />
        </div>
        <div className="flex max-w-3xl flex-col items-center justify-center px-5 pt-8 text-white">
          <div className="mb-16 hidden w-full flex-col sm:flex">
            <h3 className="mb-5 text-xl font-semibold">
              {t('courses.explorer.s2t1')}
            </h3>
            <div className="flex flex-col justify-between space-y-5 text-base font-light">
              <span>{t('courses.explorer.s2p1')}</span>
              <span>{t('courses.explorer.s2p2')}</span>
              <span>{t('courses.explorer.s2p3')}</span>
            </div>
          </div>

          {/* Aqui empieza picker nuevo, aun no esta terminado  */}
          <h3 className="mb-6 text-xl font-semibold">
            {t('courses.explorer.s3t1')}
          </h3>
          <div className="mb-16 hidden w-full flex-col rounded-lg border-2 border-white  bg-blue-800 sm:flex">
            <div className=" grid grid-cols-1 items-center justify-center px-5 text-base md:grid-cols-4 xl:grid-cols-3">
              {categories.map(({ prefix, topic }, index) => (
                <div
                  className="my-3 flex flex-row place-items-center space-x-2"
                  key={index}
                >
                  <div
                    className={`flex h-8 w-14 place-items-center justify-center rounded-lg border-2 border-orange-700 text-base font-semibold uppercase lg:h-10 lg:w-16 lg:text-base  ${
                      activeCategory === prefix
                        ? 'bg-orange-700'
                        : 'bg-blue-1000'
                    }`}
                    onClick={() => setActiveCategory(prefix)}
                  >
                    {prefix}
                  </div>
                  <span className="w-1/2 text-base font-light capitalize lg:text-base">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid  place-content-center items-center">
              <LevelPicker courseId={t('courses.explorer.pageTitle')} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 bg-blue-900 px-5 sm:grid-cols-2  md:grid-cols-3 lg:max-w-6xl xl:grid-cols-4">
          {coursesInLanguage
            ?.filter(({ id }) => id !== 'btc102' && id !== 'min201')
            .map((course) => (
              <CoursePreview
                course={course}
                className="h-auto"
                key={course.id}
              />
            ))}
        </div>
        <div className="flex max-w-3xl flex-col items-center px-5 pt-8 text-white">
          <div className="w-full bg-blue-900 pb-6 pt-3 text-right text-orange-700">
            {t('courses.explorer.moreToCome')}
          </div>
          <div className="flex w-full flex-col space-y-3 bg-blue-900 text-base text-white">
            <h4 className="mb-3 text-center text-xl font-semibold lg:text-3xl">
              {t('courses.explorer.footerTitle')}
            </h4>
            <span>{t('courses.explorer.footerp1')}</span>
            <span>{t('courses.explorer.footerp2')}</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};