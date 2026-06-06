import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, 'public', 'app-icon.svg')

for (const size of [192, 512]) {
  const out = path.join(root, 'public', `pwa-${size}.png`)
  await sharp(source).resize(size, size).png().toFile(out)
  console.log(`created ${out}`)
}
