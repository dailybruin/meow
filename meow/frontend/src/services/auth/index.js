import { RoleAuth, RoleAuthJSXLiteral } from "./roleAuth";

export const ED = RoleAuth("Editors");
export const Copy = RoleAuth("Copy");

export const CTOnlyLiteral = RoleAuthJSXLiteral(["CT"]);
