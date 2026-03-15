export default function Register() {
  return (
    <div className="flex justify-center items-center py-16">

      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-4xl">

        <h2 className="text-2xl font-bold text-center mb-8">
          Create Account
        </h2>

        <form className="grid grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Complete Name
            </label>
            <input
              type="text"
              className="border rounded-lg p-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="border rounded-lg p-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              className="border rounded-lg p-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="border rounded-lg p-3"
            />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-sm font-semibold mb-1">
              Complete Address
            </label>
            <input
              type="text"
              className="border rounded-lg p-3"
            />
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-sm font-semibold mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              className="border rounded-lg p-3"
            />
          </div>




          <button
            className="col-span-2 bg-black text-white py-3 rounded-lg font-semibold mt-4"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}