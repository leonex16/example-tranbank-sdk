import { useEffect, useState } from 'preact/compat';

import { PaymentMethod } from '../services/payment-method';

// const username = `U-${Math.floor(Math.random() * 100000)}`;
// const email = `${username}@gmail.com`;
// console.log({username, email})

const initState = {
  username: 'U-66246',
  email: 'U-66246@gmail.com',
  isTherePaymentMethod: false,
  tbkUser: null,
  card: null,
  inscription: null,
}

const getTbkToken = () => {
  const { searchParams } = new URL(window.location.href);
  const tbkToken = searchParams.get('TBK_TOKEN');

  return tbkToken;
}

const setUpPaymentMethod = async (state, setState) => {
  const tbkToken = getTbkToken();

  if ( tbkToken ) {
    const { card, tbkUser } = await PaymentMethod.confirm(tbkToken);

    setState(currentState => ({
      ...currentState,
      isTherePaymentMethod: true,
      tbkUser,
      card,
    }))
  }

  if ( tbkToken === null ) {
    const { token, url } = await PaymentMethod.getDataToInscription(state.username, state.email);

    setState(currentState => ({
      ...currentState,
      inscription: {
        token,
        url,
      },
    }))
  }

}

export const usePaymentMethod = () => {
  const [data, setData] = useState(initState);

  useEffect( async () => {
    await setUpPaymentMethod(data, setData);
  }, [])

  const removePaymentMethod = async () => {
    await PaymentMethod.remove(data.tbkUser, data.username);

    setData(currentState => ({
      ...currentState,
      isTherePaymentMethod: false,
      tbkUser: null,
      card: null,
    }))

    window.location.search = '';
  };

  return {
    data,
    removePaymentMethod
  }
}