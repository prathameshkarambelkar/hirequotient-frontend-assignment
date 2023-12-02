type paginateType = {
  postsPerPage: number;
  totalPosts: number;
  paginate: (number: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  currentPage: number;
};
const Paginate = ({
  postsPerPage,
  totalPosts,
  paginate,
  previousPage,
  nextPage,
  currentPage,
}: paginateType) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="">
      <ul className="flex  gap-10 items-center justify-center m-10">
        <li onClick={previousPage} className="cursor-pointer">
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
        <li onClick={nextPage} className="cursor-pointer">
          Next
        </li>
      </ul>
    </div>
  );
};

export default Paginate;
