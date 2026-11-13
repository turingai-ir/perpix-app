/**
 * Backend application codes (ai_gateway) a submit can be refused with while
 * nothing was created: slots are full, or a transient conflict happened.
 */
const GENERATION_CAPACITY_EXCEEDED = 1813;
const GENERATION_ADMISSION_CONFLICT = 1812;
const GENERATION_TRANSACTION_CONFLICT = 1815;

export function getGenerationErrorMessageKey(
  code: number | undefined,
): string | undefined {
  if (code === GENERATION_CAPACITY_EXCEEDED) {
    return "common.generationCapacityExceeded";
  }
  if (
    code === GENERATION_ADMISSION_CONFLICT ||
    code === GENERATION_TRANSACTION_CONFLICT
  ) {
    return "common.generationBusy";
  }
  return undefined;
}
