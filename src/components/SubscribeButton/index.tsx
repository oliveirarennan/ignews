import axios from "axios";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceId: string,
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {

  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {

    if (!session) {
      signIn('github')
      return
    }

    if(session.activeSubscription) {
      router.push('/posts');
    }

    try {
      const response = await axios.post('api/subscribe')

      const { sessionId } = response.data;

      const stripe = getStripeJs()

      await (await stripe).redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message)
    }

  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}