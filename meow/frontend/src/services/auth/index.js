import { RoleAuth, RoleAuthJSXLiteral } from "./roleAuth";

export const ED = RoleAuth("Editors");
export const Copy = RoleAuth("Copy");
export const Online = RoleAuth("Online");

export const CTOnlyLiteral = RoleAuthJSXLiteral(["CT"]);
export const EDLiteral = RoleAuthJSXLiteral("Editors");
