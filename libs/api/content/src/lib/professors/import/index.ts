import { firstRow } from '@sovereign-university/database';
import { ChangedFile, Professor } from '@sovereign-university/types';

import { Language } from '../../const';
import { Dependencies } from '../../dependencies';
import { ChangedContent } from '../../types';
import {
  getContentType,
  getRelativePath,
  separateContentFiles,
} from '../../utils';

import { createProcessLocalFile } from './local';
import { createProcessMainFile } from './main';

interface ProfessorDetails {
  path: string;
  language?: Language;
}

export type ChangedProfessor = ChangedContent;

/**
 * Parse professor details from path
 *
 * @param path - Path of the file
 * @returns Quiz details
 */
export const parseDetailsFromPath = (path: string): ProfessorDetails => {
  const pathElements = path.split('/');

  // Validate that the path has at least 3 elements (professors/name)
  if (pathElements.length < 2) throw new Error('Invalid professor path');

  return {
    path: pathElements.slice(0, 2).join('/'),
    language: pathElements[2].replace(/\..*/, '') as Language,
  };
};

export const groupByProfessor = (files: ChangedFile[]) => {
  const professorsFiles = files.filter(
    (item) => getContentType(item.path) === 'professors',
  );

  const groupedProfessors = new Map<string, ChangedProfessor>();

  for (const file of professorsFiles) {
    try {
      const { path: professorPath, language } = parseDetailsFromPath(file.path);

      const professor: ChangedProfessor = groupedProfessors.get(
        professorPath,
      ) || {
        type: 'professors',
        path: professorPath,
        files: [],
      };

      professor.files.push({
        ...file,
        path: getRelativePath(file.path, professorPath),
        language,
      });

      groupedProfessors.set(professorPath, professor);
    } catch {
      console.warn(`Unsupported path ${file.path}, skipping file...`);
    }
  }

  return Array.from(groupedProfessors.values());
};

export const createProcessChangedProfessor =
  (dependencies: Dependencies) => async (professor: ChangedProfessor) => {
    const { postgres } = dependencies;

    const { main, files } = separateContentFiles(professor, 'professor.yml');

    return postgres.begin(async (transaction) => {
      const processMainFile = createProcessMainFile(transaction);
      const processLocalFile = createProcessLocalFile(transaction);

      await processMainFile(professor, main);

      const id = await transaction<Professor[]>`
          SELECT id FROM content.professors WHERE path = ${professor.path}
        `
        .then(firstRow)
        .then((row) => row?.id);

      if (!id) {
        throw new Error(`Professor not found for path ${professor.path}`);
      }

      for (const file of files) {
        await processLocalFile(id, file);
      }
    });
  };
