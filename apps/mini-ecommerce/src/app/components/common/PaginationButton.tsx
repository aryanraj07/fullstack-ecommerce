import { setPage } from "@/features/filters/filterSlice";
import { useAppDispatch } from "@/hooks/hooks";
interface Props {
  currentPage: number;
  lastPage: number;
}

const PaginationButton = ({ currentPage, lastPage }: Props) => {
  const dispatch = useAppDispatch();

  const generatePages = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // pages around current
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(lastPage, currentPage + delta);

    if (start > 1) pages.push(1, "...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < lastPage) pages.push("...", lastPage);
    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap py-5 ">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => dispatch(setPage(currentPage - 1))}
        className="px-3 py-2 rounded-lg border disabled:opacity-40"
      >
        Prev
      </button>

      {/* Pages */}
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => dispatch(setPage(p as number))}
            className={`px-3 py-2 rounded-lg border transition
              ${currentPage === p ? "bg-black text-white" : "hover:bg-gray-100"}
            `}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        disabled={currentPage === lastPage}
        onClick={() => dispatch(setPage(currentPage + 1))}
        className="px-3 py-2 rounded-lg border disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationButton;
