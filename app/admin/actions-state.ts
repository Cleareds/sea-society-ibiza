/**
 * Initial state + result types for the admin server actions.
 *
 * Kept in a non-"use server" module because Next.js (16) rejects any
 * non-async-function export from a "use server" file, including plain
 * constants like `initialPageBlockState`.
 */
export interface SaveBoatState {
  status: "idle" | "ok" | "error";
  message?: string;
  savedAt?: number;
  boatId?: string | null;
}
export const initialSaveBoatState: SaveBoatState = { status: "idle" };

export interface SavePageBlockState {
  status: "idle" | "ok" | "error";
  message?: string;
  savedAt?: number;
  id?: string | null;
}
export const initialPageBlockState: SavePageBlockState = { status: "idle" };

export interface SaveSettingsState {
  status: "idle" | "ok" | "error";
  message?: string;
  savedAt?: number;
}
export const initialSettingsState: SaveSettingsState = { status: "idle" };
