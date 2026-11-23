import type { ToolMeta } from '../registry'

const meta: ToolMeta = {
  slug: 'jwt-decoder',
  name: 'JWT Decoder',
  description:
    'Decode a JSON Web Token into its header and payload. The signature is not verified.',
  tags: ['jwt', 'token', 'decode', 'auth', 'base64url'],
  category: 'encoding',
}

export default meta
