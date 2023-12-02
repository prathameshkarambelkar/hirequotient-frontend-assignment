import {  useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import Pagination from "./components/Pagination";
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function App() {
  const [usersDetail, setUsersDetail] = useState<User[]>();

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAllRecords, setSelectAllRecords] = useState(false);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = usersDetail?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== Math.ceil(usersDetail?.length ?? 0 / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

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
    console.log(filtered);
    console.log(searchTerm);
  };

  const deleteUserRecord = (userId: string) => {
    const newUserArray = usersDetail?.filter((user) => user.id !== userId);
    setUsersDetail(newUserArray);
  };
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  const handleEdit = (userId: string) => {
    const userToEdit = usersDetail?.find((user) => user.id === userId);
    setEditingUserId(userId);
    setEditedUser(userToEdit as User);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handleSaveChanges = (userId: string) => {
    // Update the user details in the usersDetail state
    setUsersDetail((prevUsers) =>
      prevUsers?.map((user) =>
        user.id === userId ? { ...user, ...editedUser } : user
      )
    );

    // Clear the editing state
    setEditingUserId(null);
    setEditedUser({
      id: "",
      name: "",
      email: "",
      role: "",
    });
  };

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
                      onChange={() => {
                        console.log("first");
                        setSelectAllRecords(!selectAllRecords);
                      }}
                      type="checkbox"
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="text-xl">Name</th>
                  <th className="text-xl">Email</th>
                  <th className="text-xl">Role</th>
                </tr>
              </thead>
              <tbody className="">
                {currentRecords?.map((user: User) => (
                  <tr
                    key={user.id}
                    className=" bg-card rounded-md transition-all  hover:bg-slate-200 bg-slate-50  border h-12 gap-10  border-black  text-center"
                  >
                    <td className="m-10 ">
                      <input
                        checked={selectAllRecords}
                        className="w-4 h-4"
                        type="checkbox"
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
                            handleEditChange("name", e.target.value)
                          }
                        />
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <button onClick={() => handleSaveChanges(user.id)}>
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(user.id)}>
                          Edit
                        </button>
                      )}
                      {/* <FiEdit size={20} color="black" /> */}
                    </td>
                    <td onClick={() => deleteUserRecord(user.id)}>
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
              previousPage={previousPage}
              nextPage={nextPage}
              currentPage={currentPage}
            />
          </>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </>
  );
}

export default App;
