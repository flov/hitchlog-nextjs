export function NewTripForm() {
  return (
    <form className="container mx-auto max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group my-6">
          <input
            type="text"
            id="origin-input"
            className="form-control
                  block
                  w-full
                  px-3
                  py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            aria-describedby="origin"
            placeholder="Enter an origin location"
          />
        </div>
        <div className="form-group my-6">
          <input
            type="text"
            className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="destination-input"
            aria-describedby="Enter destination"
            placeholder="Enter destination"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group mb-6">
          <input
            type="datetime-local"
            className="form-control block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="started"
            placeholder="Started when?"
          />
        </div>
        <div className="form-group mb-6">
          <input
            type="datetime-local"
            className="form-control block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="arrived"
            placeholder="Arrived when?"
          />
        </div>
      </div>
      <button
        type="submit"
        className="
        w-full
        px-6
        py-2.5
        bg-blue-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
      >
        Add Trip
      </button>
    </form>
  );
}
