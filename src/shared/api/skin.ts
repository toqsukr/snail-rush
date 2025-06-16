import { z } from 'zod'
import baseTemplate from './base-template'

const SkinDTOSchema = z.object({
  name: z.string(),
  skin_id: z.string(),
})

class SkinService {
  readonly SKIN_PREFIX = '/skin'

  async getAllSkins() {
    return baseTemplate.get(`${this.SKIN_PREFIX}/`).then(({ data }) => SkinDTOSchema.parse(data))
  }

  async createSkin(name: string) {
    return baseTemplate
      .post(`${this.SKIN_PREFIX}/`, { name })
      .then(({ data }) => SkinDTOSchema.parse(data))
  }

  async getSkinByID(skin_id: string) {
    return baseTemplate
      .get(`${this.SKIN_PREFIX}/${skin_id}/`)
      .then(({ data }) => SkinDTOSchema.parse(data))
  }
}

export default new SkinService()
