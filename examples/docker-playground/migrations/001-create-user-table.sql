CREATE TABLE "public"."user" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "username" integer NOT NULL,
    "email" integer NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
)