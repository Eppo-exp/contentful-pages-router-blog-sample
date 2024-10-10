import type { Attributes } from '@eppo/js-client-sdk-common';
import { init } from '@eppo/node-server-sdk';

import {
  EppoExperimentFieldsFragment,
  PageBlogPostFieldsFragment,
  RichImageFieldsFragment,
} from '@src/lib/__generated/sdk';

/**
 * For this example, we'll assume that our "Eppo Experiment" can accept
 * "component - Rich image" or "page - Blog post" for use in variations.
 * This can be updated in src/lib/graphql/eppoExperimentFields.graphql.
 */
export type VariationEntry = RichImageFieldsFragment | PageBlogPostFieldsFragment;

const eppoClientPromise = (() => {
  if (!process.env.EPPO_SDK_KEY) {
    throw new Error('Missing EPPO_SDK_KEY environment variable');
  }
  return init({
    apiKey: process.env.EPPO_SDK_KEY,
    baseUrl: process.env.EPPO_BASE_URL_OVERRIDE || undefined,
    assignmentLogger: {
      logAssignment(assignment) {
        console.log('EppoClient.assignmentLogger => logAssignment()', assignment);
      },
    },
  });
})();

async function getEppoClient() {
  return await eppoClientPromise;
}

export async function selectExperimentEntry<T extends VariationEntry>(
  eppoExperiment: EppoExperimentFieldsFragment | null | undefined,
  subjectKey: string,
  subjectAttributes: Attributes = {},
): Promise<T | null> {
  if (!eppoExperiment) {
    return null;
  }
  const flagKey = eppoExperiment.flagKey;
  if (!flagKey) {
    throw new Error(`missing required flagKey for entry ${eppoExperiment.sys.id}`);
  }
  const controlVariationEntry = eppoExperiment.controlVariation as T;
  if (!controlVariationEntry) {
    throw new Error(`missing required controlVariation for entry ${eppoExperiment.sys.id}`);
  }
  const treatmentVariationEntries = (eppoExperiment.treatmentVariationsCollection?.items ??
    []) as Array<T>;
  if (!treatmentVariationEntries.length) {
    throw new Error(
      `missing required treatmentVariationsCollection for entry ${eppoExperiment.sys.id}`,
    );
  }
  const eppoClient = await getEppoClient();
  const experiment = {
    flagKey,
    controlVariationEntry,
    treatmentVariationEntries,
  };
  return eppoClient.getExperimentContainerEntry(experiment, subjectKey, subjectAttributes);
}
