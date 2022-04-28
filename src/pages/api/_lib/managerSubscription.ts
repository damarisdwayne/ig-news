import { query as q } from 'faunadb'

import { fauna } from '../../../Services/fauna'
import { stripe } from '../../../Services/stripe'

export async function saveSubscription(
    subdcriptionId: string,
    customerId: string,
    createAction = false
) {
    //Buscar o usuário no banco do faunaDB com o ID {customerId}
    //Salvar os dados da subscription no FaunaDB

    const userRef = await fauna.query( //id do user no faune userRef
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subdcriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    if (createAction) {
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        )
    } else { //att a subscription existente
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subdcriptionId
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )
    }
}