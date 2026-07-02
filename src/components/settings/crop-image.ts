export type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

const TO_RADIANS = Math.PI / 180

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

/**
 * Memotong gambar sesuai `pixelCrop` (dari react-easy-crop `onCropComplete`)
 * dan mengembalikan object URL hasil crop (PNG).
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Tidak ada context 2d untuk canvas")
  }

  const rotRad = rotation * TO_RADIANS

  // bounding box gambar yang diputar
  const bBoxSize =
    Math.max(image.width, image.height) *
    (Math.abs(Math.sin(rotRad)) + Math.abs(Math.cos(rotRad)))

  canvas.width = bBoxSize
  canvas.height = bBoxSize

  ctx.translate(bBoxSize / 2, bBoxSize / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const data = ctx.getImageData(0, 0, bBoxSize, bBoxSize)

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.putImageData(
    data,
    Math.round(0 - bBoxSize / 2 + image.width / 2 - pixelCrop.x),
    Math.round(0 - bBoxSize / 2 + image.height / 2 - pixelCrop.y)
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas kosong"))
        return
      }
      resolve(URL.createObjectURL(blob))
    }, "image/png")
  })
}
