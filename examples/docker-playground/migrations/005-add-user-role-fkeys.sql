ALTER TABLE "public"."user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY (role_id) REFERENCES "role"(id) NOT DEFERRABLE;
ALTER TABLE "public"."user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) NOT DEFERRABLE;