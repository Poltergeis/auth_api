-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "semester" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasCompletedEvaluation" BOOLEAN NOT NULL DEFAULT false,
    "isTutor" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "relationship" TEXT,
    "minorName" TEXT,
    "minorEmail" TEXT,
    "minorBirthdate" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
