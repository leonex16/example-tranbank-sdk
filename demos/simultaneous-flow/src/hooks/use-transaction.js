import { useState } from 'preact/hooks';
import { SimultaneousTransaction } from '../services/simultaneous-transaction';

export const useTransaction = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [billing, setBilling] = useState(null);

  const addToShoppingCart = (amountItem) => {
    const item =  { amount: amountItem };
    setShoppingCart(currentState => [...currentState, item]);
  }
  const autorizeItems = async (tbkUser, username) => {
    setBilling(await SimultaneousTransaction.authorize(username, tbkUser, shoppingCart))
  }

  return {
    shoppingCart,
    billing,
    addToShoppingCart,
    autorizeItems,
  }
}