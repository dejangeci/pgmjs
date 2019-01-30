CREATE TABLE "public"."user_role" (
    "user_id" integer NOT NULL,
    "role_id" integer NOT NULL,
    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id", "role_id")
)