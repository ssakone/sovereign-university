// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ResourcesId } from './Resources';
import type { TagsId } from './Tags';

/** Represents the table content.resource_tags */
export default interface ResourceTags {
  resource_id: ResourcesId;

  tag_id: TagsId;
}

/** Represents the initializer for the table content.resource_tags */
export interface ResourceTagsInitializer {
  resource_id: ResourcesId;

  tag_id: TagsId;
}

/** Represents the mutator for the table content.resource_tags */
export interface ResourceTagsMutator {
  resource_id?: ResourcesId;

  tag_id?: TagsId;
}
