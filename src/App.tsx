import { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
// Custom Pagination Component
import Pagination from "./components/Pagination";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  selected: boolean;
};

function App() {
  const [usersDetail, setUsersDetail] = useState<User[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAllRecords, setSelectAllRecords] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const totalPages = Math.ceil((usersDetail?.length || 0) / recordsPerPage);

  const currentRecords = usersDetail?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const handleRowClick = (userId: string) => {
    setUsersDetail((prevUsers) =>
      prevUsers?.map((user) =>
        user.id === userId ? { ...user, selected: !user.selected } : user
      )
    );
  };

  //Get user details function
  const getUsersDetail = async () => {
    const url =
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
    try {
      const res = await axios.get(url);
      setUsersDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // Function to goto first page
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  //Function to go to previous page
  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  //Function to go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  // Function to goto last page

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };
  //Search Function
  const searchFunction = () => {
    event?.preventDefault();
    console.log("first");
    const filtered = usersDetail?.filter((user) =>
      Object.values(user).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setUsersDetail(filtered);
  };
  //Delete User
  const deleteUserRecord = (userId: string) => {
    const newUserArray = usersDetail?.filter((user) => user.id !== userId);
    setUsersDetail(newUserArray);
  };

  //User Edit Function
  const handleEdit = (userId: string) => {
    const userToEdit = usersDetail?.find((user) => user.id === userId);
    setEditingUserId(userId);
    setEditedUser(userToEdit as User);
  };

  // User onchange function
  const handleEditChange = (field: string, value: string) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  //user change info function
  const handleSaveChanges = (userId: string) => {
    // Update the user details in the usersDetail state
    setUsersDetail((prevUsers) =>
      prevUsers?.map((user) =>
        user.id === userId ? { ...user, ...editedUser } : user
      )
    );
    setEditingUserId(null);
    setEditedUser({
      id: "",
      name: "",
      email: "",
      role: "",
    });
  };
  // function to delete selected
  const handleDeleteSelected = () => {
    setUsersDetail((prevUsers) => prevUsers?.filter((user) => !user.selected));
    // Update total pages after deletion
    setCurrentPage(1);
    setSelectAllRecords(false);
  };
  // Function to handle select all rows
  const handleSelectAll = () => {
    setSelectAllRecords(!selectAllRecords);
    setUsersDetail((prevUsers) =>
      prevUsers?.map((user, index) => {
        if (index >= indexOfFirstRecord && index < indexOfLastRecord) {
          return { ...user, selected: !selectAllRecords };
        }
        return user;
      })
    );
  };

  //UseEFfect to get details on first page render
  useEffect(() => {
    getUsersDetail();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center ">
        <h1 className=" text-xl my-4 ">Admin Dashboard</h1>
        <div className="w-full items-center flex justify-center">
          <form onSubmit={searchFunction} action="submit">
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              type="text"
              className=" p-2 border-black border-2 rounded-md"
            />
            <button
              type="submit"
              className=" search-icon mx-2 hover:bg-slate-200 transition-all py-2 border-gray-100 border rounded-md px-4 bg-slate-100"
            >
              Search
            </button>
          </form>
        </div>

        {usersDetail ? (
          <>
            <table className="table-auto  border-separate shadow-md border-spacing-y-3    rounded-md w-[90%] mt-10   ">
              <thead className="text-center text-gray-500 tracking-wider">
                <tr className="h-10">
                  <th>
                    <input
                      checked={selectAllRecords}
                      onChange={handleSelectAll}
                      type="checkbox"
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="text-xl">Name</th>
                  <th className="text-xl">Email</th>
                  <th className="text-xl">Role</th>

                  <th
                    onClick={handleDeleteSelected}
                    className="text-sm cursor-pointer font-normal text-black  "
                  >
                    Delete Selected
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords?.map((user: User) => (
                  <tr
                    key={user.id}
                    className={` bg-card rounded-md transition-all    bg-slate-50  border h-12 gap-10  border-black  text-center ${
                      user.selected ? " bg-slate-500 text-white" : ""
                    } `}
                  >
                    <td className="m-10 ">
                      <input
                        onClick={() => handleRowClick(user.id)}
                        className="w-4 h-4"
                        type="checkbox"
                        checked={user.selected}
                      />
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={editedUser.email}
                          onChange={(e) =>
                            handleEditChange("email", e.target.value)
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={editedUser.role}
                          onChange={(e) =>
                            handleEditChange("role", e.target.value)
                          }
                        />
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <button
                          className="save"
                          onClick={() => handleSaveChanges(user.id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="edit"
                          onClick={() => handleEdit(user.id)}
                        >
                          Edit
                        </button>
                      )}
                      {/* <FiEdit size={20} color="black" /> */}
                    </td>
                    <td
                      className="delete"
                      onClick={() => deleteUserRecord(user.id)}
                    >
                      <MdDeleteOutline size={20} color="red" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              postsPerPage={recordsPerPage}
              totalPosts={usersDetail?.length}
              paginate={paginate}
              firstPage={goToFirstPage}
              previousPage={previousPage}
              nextPage={nextPage}
              lastPage={goToLastPage}
              currentPage={currentPage}
            />
          </>
        ) : (
          <div>Loading</div>
        )}
        {currentRecords?.length === 0 && <h1>No records left</h1>}
      </div>
    </>
  );
}

export default App;
