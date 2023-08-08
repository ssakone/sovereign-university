// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ResourcesId } from './Resources';

/** Represents the table content.books */
export default interface Books {
  resource_id: ResourcesId;

  level?: string;

  author: string;

  website_url?: string;
}

/** Represents the initializer for the table content.books */
export interface BooksInitializer {
  resource_id: ResourcesId;

  level?: string;

  author: string;

  website_url?: string;
}

/** Represents the mutator for the table content.books */
export interface BooksMutator {
  resource_id?: ResourcesId;

  level?: string;

  author?: string;

  website_url?: string;
}
