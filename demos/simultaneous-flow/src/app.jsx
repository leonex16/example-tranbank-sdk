import './app.css';

import { CreditCard } from './components/credit-card';
import { ProductCard } from './components/product-card';
import { Loader } from './components/loader';

import { usePaymentMethod } from './hooks/use-payment-method';
import { useTransaction } from './hooks/use-transaction';

export function App() {
  const { data, removePaymentMethod } = usePaymentMethod();
  const { addToShoppingCart, autorizeItems, billing, shoppingCart } = useTransaction();

  const handleAddProduct = (amountItem) => {
    addToShoppingCart(amountItem);
  };

  const handleRemoveCreditCard = async () => {
    await removePaymentMethod();
  };

  const handleBuyItems = async () => {
    const { tbkUser, username } = data;
    await autorizeItems(tbkUser, username);
  };

  return (
    <main className='relative bg-slate-900 w-screen h-screen'>
      {data.isTherePaymentMethod || (
        <div className='absolute z-10 h-full w-full backdrop-blur-xl bg-gray-900/80 backdrop-opacity-100'>
          <article className='h-full w-full flex flex-col justify-center items-center pt-20'>
            <h2 className='text-white text-3xl text-center w-1/2'>
              First you must add a payment method
            </h2>
            <span className='text-4xl my-10 animate-bounce'>⬇️</span>
          </article>
        </div>
      )}
      <article id='container' className='flex flex-col'>
        <header className='py-10'>
          <CreditCard username={data.username} number={data.card?.number} />
        </header>
        <article className='grow flex w-full'>
          <section className='flex flex-col grow border-r' style={{ maxWidth: '330px' }}>
            <header>
              <h3 className='text-3xl font-bold text-center text-white'>Store</h3>
            </header>
            <article className='flex justify-center items-center my-8 grow'>
              <ProductCard onClickSideEffect={handleAddProduct} />
            </article>
            <footer className='m-auto'>
              <button
                className='bg-blue-600 text-white w-40 p-2 rounded-md disabled:opacity-25'
                disabled={shoppingCart.length === 0}
                onClick={handleBuyItems}
              >
                Buy
              </button>
            </footer>
          </section>
          <section className='flex flex-col grow'>
            <header className='w-full'>
              <h3 className='text-3xl font-bold text-center text-white'>Billing</h3>
            </header>
            <article className='flex justify-center items-center grow'>
              {billing === null ? (
                <Loader />
              ) : (
                <pre className=' overflow-auto' style={{ maxHeight: '400px' }}>
                  <code className='text-white'>{JSON.stringify(billing, null, 2)}</code>
                </pre>
              )}
            </article>
          </section>
        </article>
        <footer className='m-auto my-5'>
          {data.isTherePaymentMethod ? (
            <button
              className='relative z-20 bg-red-600 text-white font-bold p-2 rounded-md'
              onClick={handleRemoveCreditCard}
            >
              Remove Credit Card
            </button>
          ) : (
            <form method='POST' action={data.inscription?.url}>
              <input type='hidden' name='TBK_TOKEN' value={data.inscription?.token} />
              <button className='relative z-20 bg-orange-600 text-white font-bold p-2 rounded-md'>
                Add Credit Card
              </button>
            </form>
          )}
        </footer>
      </article>
    </main>
  );
}
