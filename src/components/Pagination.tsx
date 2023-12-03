type paginateType = {
  postsPerPage: number;
  totalPosts: number;
  paginate: (number: number) => void;
  firstPage: () => void;
  previousPage: () => void;
  nextPage: () => void;
  lastPage: () => void;
  currentPage: number;
};

//Custom Pagination Component
const Paginate = ({
  postsPerPage,
  totalPosts,
  paginate,
  firstPage,
  previousPage,
  nextPage,
  lastPage,
  currentPage,
}: paginateType) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <ul className="flex  gap-10 items-center justify-center mt-10 mb-6">
        <button onClick={firstPage} className="first-page">
          First Page
        </button>
        <li onClick={previousPage} className="cursor-pointer previous-page">
          Prev
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={() => paginate(number)}
            className={`page-number hover:bg-gray-200 cursor-pointer transition-all border-black border p-1 px-2 rounded-sm ${
              number == currentPage && "bg-gray-400 text-white"
            }  `}
          >
            {number}
          </li>
        ))}
        <li onClick={nextPage} className="cursor-pointer next-page">
          Next
        </li>
        <button onClick={lastPage} className="last-page cursor-pointer">
          Last Page
        </button>
      </ul>
      <h2 className="text-center mb-4 ">
        Page {currentPage} of {pageNumbers.slice(-1)}
      </h2>
    </div>
  );
};

export default Paginate;
