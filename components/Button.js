const Button = ({ children, ...props }) => {
  return (
    <button
      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 m-2"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
