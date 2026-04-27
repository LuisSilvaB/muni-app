-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roots" (
    "id" UUID NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR(255) NOT NULL,
    "ruc" VARCHAR(20),
    "address" VARCHAR(500),
    "phone" VARCHAR(50),
    "logo_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "roots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roots" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "root_id" UUID NOT NULL,
    "branch_id" UUID,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_roots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "root_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_root_permissions" (
    "id" UUID NOT NULL,
    "user_root_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_root_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "roots_deleted_at_idx" ON "roots"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "roots_ruc_deleted_at_key" ON "roots"("ruc", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_roots_user_id_root_id_key" ON "user_roots"("user_id", "root_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_root_id_name_key" ON "roles"("root_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_root_permissions_user_root_id_permission_id_key" ON "user_root_permissions"("user_root_id", "permission_id");

-- AddForeignKey
ALTER TABLE "user_roots" ADD CONSTRAINT "user_roots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roots" ADD CONSTRAINT "user_roots_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roots" ADD CONSTRAINT "user_roots_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_root_permissions" ADD CONSTRAINT "user_root_permissions_user_root_id_fkey" FOREIGN KEY ("user_root_id") REFERENCES "user_roots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_root_permissions" ADD CONSTRAINT "user_root_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
