import { useState, useRef } from 'preact/hooks';

export function ProductCard({ onClickSideEffect }) {
  const [count, setCount] = useState(0);

  const priceRandom = Math.floor(Math.random() * (10000 - 1000) + 1000);
  const priceFormatted = Intl.NumberFormat('es-CL', { currency: 'CLP' }).format(
    priceRandom
  );

  const handleClick = () => {
    setCount(count + 1);
    onClickSideEffect(priceRandom);
  }

  return (
    <div
      class="max-w-sm overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl"
      style={{ maxWidth: '210px', maxHeight: '275px' }}
    >
      <img
        src="http://placeimg.com/640/480/tech"
        alt="Product"
        class="h-auto w-full"
      />
      <div class="p-5">
        <p class="mb-5 font-bold text-center">${priceFormatted}</p>
        <button
          class="relative w-full rounded-md bg-green-600  py-2 text-indigo-100 hover:bg-green-500 hover:shadow-md duration-75"
          onClick={handleClick}
        >
          Added to Card
          <span
            className="absolute inset-y-0 right-2 m-auto inline-block bg-white text-green-600 border-radious text-xs font-bold rounded-full"
            style={{ height: '16px', width: '16px' }}
          >
            {count}
          </span>
        </button>
      </div>
    </div>
  );
}
