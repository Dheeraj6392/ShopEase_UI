function QuantityControl({ quantity, loading, onAdd, onDecrease, onIncrease }) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={onAdd}
        className="mx-3 mb-3 w-[calc(100%-1.5rem)] rounded-lg border border-[#f84040] py-2 text-xs font-black text-[#f84040] transition hover:bg-[#f84040] hover:text-white disabled:cursor-not-allowed disabled:border-[#d5d9de] disabled:text-[#aeb4bb]"
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
    );
  }

  return (
    <div className="mx-3 mb-3 flex h-10 w-[calc(100%-1.5rem)] items-center justify-between overflow-hidden rounded-lg bg-[#f84040] text-white">
      <button type="button" aria-label="Decrease quantity" onClick={onDecrease} className="flex h-full w-11 items-center justify-center text-xl font-medium transition hover:bg-[#e52d2d]">-</button>
      <span className="text-sm font-black">{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={onIncrease} className="flex h-full w-11 items-center justify-center text-xl font-medium transition hover:bg-[#e52d2d]">+</button>
    </div>
  );
}

export default QuantityControl;
