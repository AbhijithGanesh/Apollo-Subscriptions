-- CreateTable
CREATE TABLE "User" (
    "reg_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseRegistrationsId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("reg_no")
);

-- CreateTable
CREATE TABLE "CourseDetails" (
    "course_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CourseDetails_pkey" PRIMARY KEY ("course_code")
);

-- CreateTable
CREATE TABLE "CourseRegistrations" (
    "id" SERIAL NOT NULL,
    "mapped_course_code" TEXT NOT NULL,

    CONSTRAINT "CourseRegistrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_reg_no_key" ON "User"("reg_no");

-- CreateIndex
CREATE UNIQUE INDEX "CourseDetails_course_code_key" ON "CourseDetails"("course_code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_courseRegistrationsId_fkey" FOREIGN KEY ("courseRegistrationsId") REFERENCES "CourseRegistrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRegistrations" ADD CONSTRAINT "CourseRegistrations_mapped_course_code_fkey" FOREIGN KEY ("mapped_course_code") REFERENCES "CourseDetails"("course_code") ON DELETE RESTRICT ON UPDATE CASCADE;
