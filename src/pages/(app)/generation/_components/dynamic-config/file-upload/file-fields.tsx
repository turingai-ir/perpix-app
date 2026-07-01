import { useCallback, useEffect, useState, type FC } from "react";

import { useAppTranslate } from "@/hook";

import { DynamicConfigFileField } from "./file-field";
import { clearTopLevelMediaConflicts } from "./media";
import type { DynamicConfigForm } from "../types";

export const DynamicConfigFileFields: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  excludedFields?: ReadonlySet<string>;
  onUploadingChange?: (isUploading: boolean) => void;
  requestId?: string;
}> = ({
  disabled,
  dynamicForm,
  excludedFields,
  onUploadingChange,
  requestId = "dynamic_config",
}) => {
  const { t } = useAppTranslate();
  const [uploadingByField, setUploadingByField] = useState<
    Record<string, boolean>
  >({});
  const fileFieldNames = dynamicForm.orderedFieldNames.filter((fieldName) => {
    const property = dynamicForm.properties[fieldName];

    return (
      Boolean(property?.["x-file"]) &&
      !excludedFields?.has(fieldName) &&
      dynamicForm.isFieldVisible(fieldName)
    );
  });
  const handleFieldUploadingChange = useCallback(
    (fieldName: string, isUploading: boolean) => {
      setUploadingByField((prev) => {
        if (prev[fieldName] === isUploading) return prev;

        return {
          ...prev,
          [fieldName]: isUploading,
        };
      });
    },
    [],
  );

  useEffect(() => {
    onUploadingChange?.(
      fileFieldNames.some((fieldName) => uploadingByField[fieldName]),
    );
  }, [fileFieldNames, onUploadingChange, uploadingByField]);

  return (
    <>
      {fileFieldNames.map((fieldName) => {
        const property = dynamicForm.properties[fieldName];

        return (
          <DynamicConfigFileField
            key={fieldName}
            dynamicForm={dynamicForm}
            fieldName={fieldName}
            label={t(`common.dynamicConfig.fields.${fieldName}`, {
              defaultValue: property.title ?? fieldName,
            })}
            property={property}
            disabled={disabled}
            requestId={requestId}
            onUploadingChange={(isUploading) =>
              handleFieldUploadingChange(fieldName, isUploading)
            }
            onValueChange={() =>
              clearTopLevelMediaConflicts(dynamicForm, fieldName)
            }
          />
        );
      })}
    </>
  );
};
