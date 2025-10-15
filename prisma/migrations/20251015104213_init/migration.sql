-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "userId" TEXT,
    "choice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalPlayed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "aiVotes" INTEGER NOT NULL DEFAULT 0,
    "realVotes" INTEGER NOT NULL DEFAULT 0,
    "aiPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "realPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_imageId_userId_key" ON "Vote"("imageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_imageId_key" ON "Stat"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_userId_key" ON "Leaderboard"("userId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stat" ADD CONSTRAINT "Stat_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
