ALTER TABLE "public"."user" ADD CONSTRAINT "user_email_key" UNIQUE ("email");
ALTER TABLE "public"."user" ADD CONSTRAINT "user_username_key" UNIQUE ("username");