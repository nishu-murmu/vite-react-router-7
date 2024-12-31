/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface TblBooks {
  author: string | null;
  id: Generated<number>;
  image: string | null;
  is_public: number | null;
  name: string | null;
  user_id: string | null;
}

export interface TblUsers {
  created_at: Date | null;
  email_address: string | null;
  id: string | null;
  profile_image_url: string | null;
  updated_at: Date | null;
  username: string | null;
}

export interface DB {
  tbl_books: TblBooks;
  tbl_users: TblUsers;
}
