import { FIELD_CATEGORIES, FIELD_DEFINITIONS, type FieldCategory } from "../constants";
import { isBindableDataField } from "../utils/fieldData";
import type { FieldDefinitionDto } from "../templateApi";
import { useFieldDefinitionsQuery } from "./useEditorQueries";

const fallbackFields: FieldDefinitionDto[] = FIELD_DEFINITIONS.filter((f) =>
  isBindableDataField(f.key),
).map((f) => ({
  key: f.key,
  label: f.label,
  category: f.category,
}));

export function useFieldDefinitions() {
  const query = useFieldDefinitionsQuery();

  const fields = query.data?.fields?.length ? query.data.fields : fallbackFields;
  const categories = query.data?.categories?.length
    ? (query.data.categories as { id: FieldCategory; title: string }[])
    : FIELD_CATEGORIES;

  return {
    fields,
    categories,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
