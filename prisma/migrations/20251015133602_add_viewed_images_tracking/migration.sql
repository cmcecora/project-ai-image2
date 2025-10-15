-- CreateTable
CREATE TABLE "ViewedImage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewedImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ViewedImage_sessionId_viewedAt_idx" ON "ViewedImage"("sessionId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ViewedImage_sessionId_imageId_key" ON "ViewedImage"("sessionId", "imageId");

-- AddForeignKey
ALTER TABLE "ViewedImage" ADD CONSTRAINT "ViewedImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
