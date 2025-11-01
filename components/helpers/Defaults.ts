
// Why is it doing this? Beacuse of circular references due to imports
// A Client was running importing Organization, which imports the store, which imports the organization-slice, which imports the Organization + runs initalization code which used Organization before the import finished, causing circular loop

export const DEFAULT_CFB_SEASON = 2026;
export const DEFAULT_CBB_SEASON = 2026;
export const DEFAULT_CFB_ID = 'f1dedce6-3b4c-11ef-94bc-2a93761010b8';
export const DEFAULT_CBB_ID = 'f1c37c98-3b4c-11ef-94bc-2a93761010b8';
export const DEFAULT_ORGANIZATION_ID = DEFAULT_CBB_ID;
export const DEFAULT_FBS_DIVISION_ID = 'bf258a3f-3b4a-11ef-94bc-2a93761010b8';
export const DEFAULT_FCS_DIVISION_ID = 'bf4a4dac-3b4a-11ef-94bc-2a93761010b8';
export const DEFAULT_D1_DIVISION_ID = 'bf602dc4-3b4a-11ef-94bc-2a93761010b8';
export const DEFAULT_D2_DIVISION_ID = 'bf891a3f-3b4a-11ef-94bc-2a93761010b8';
export const DEFAULT_D3_DIVISION_ID = 'bf9ea506-3b4a-11ef-94bc-2a93761010b8';
