import * as Prismic from '@prismicio/client'
// import { enableAutoPreviews } from '@prismicio/next'

export function getPrismicClient(req?: unknown) {
    const prismic = Prismic.createClient(process.env.PRISMIC_END_POINT,
        {
            accessToken: process.env.PRISMIC_ACESS_TOKEN,
        })

    // enableAutoPreviews({
    //     req: req,
    // })

    return prismic
}