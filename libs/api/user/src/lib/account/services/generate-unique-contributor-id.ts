import { Dependencies } from '../../../dependencies';
import { contributorIdExistsQuery } from '../queries';
import { generateRandomContributorId } from '../utils/contribution';

export const createGenerateUniqueContributorId =
  (dependencies: Dependencies) => async () => {
    const { postgres } = dependencies;

    const contributorIdExists = async (id: string) => {
      const [result] = await postgres.exec(contributorIdExistsQuery(id));
      return result && result.exists;
    };

    let contributorId: string;

    do {
      contributorId = generateRandomContributorId();
    } while (await contributorIdExists(contributorId));

    return contributorId;
  };
